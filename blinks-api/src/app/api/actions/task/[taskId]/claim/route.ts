import {
  ActionPostRequest,
  ActionPostResponse,
  ACTIONS_CORS_HEADERS,
} from '@solana/actions';
import { NextRequest, NextResponse } from 'next/server';
import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
  SystemProgram,
} from '@solana/web3.js';
import { getTask } from '@/lib/tasks';
import { PROGRAM_ID, CONNECTION_URL } from '@/lib/constants';

const connection = new Connection(CONNECTION_URL, 'confirmed');

export async function POST(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const body: ActionPostRequest = await request.json();
    const workerPubkey = new PublicKey(body.account);

    const task = await getTask(params.taskId);

    if (!task || task.status !== 'open') {
      return NextResponse.json(
        { error: 'Task not available for claiming' },
        { status: 400, headers: ACTIONS_CORS_HEADERS }
      );
    }

    // Derive PDAs
    const programId = new PublicKey(PROGRAM_ID);

    // Task PDA: seeds = [b"task", agent.key(), &task_id.to_le_bytes()]
    const taskIdBuffer = Buffer.alloc(8);
    taskIdBuffer.writeBigUInt64LE(BigInt(task.taskIdNum));
    const [taskPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('task'), new PublicKey(task.agentPubkey).toBuffer(), taskIdBuffer],
      programId
    );

    // Worker PDA: seeds = [b"worker", authority.key()]
    const [workerPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('worker'), workerPubkey.toBuffer()],
      programId
    );

    // Task Assignment PDA: seeds = [b"assignment", task.key(), worker.key()]
    const [assignmentPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('assignment'), taskPda.toBuffer(), workerPda.toBuffer()],
      programId
    );

    // Build claim instruction
    // Discriminator for claim_task (first 8 bytes of sha256("global:claim_task"))
    const discriminator = Buffer.from([62, 198, 214, 193, 213, 159, 108, 210]);

    const keys = [
      { pubkey: taskPda, isSigner: false, isWritable: true },
      { pubkey: assignmentPda, isSigner: false, isWritable: true },
      { pubkey: workerPda, isSigner: false, isWritable: false },
      { pubkey: workerPubkey, isSigner: true, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ];

    const claimInstruction = new TransactionInstruction({
      programId,
      keys,
      data: discriminator,
    });

    // Build transaction
    const transaction = new Transaction();
    transaction.add(claimInstruction);

    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.lastValidBlockHeight = lastValidBlockHeight;
    transaction.feePayer = workerPubkey;

    const serializedTx = transaction.serialize({
      requireAllSignatures: false,
      verifySignatures: false,
    });

    const response: ActionPostResponse = {
      type: 'transaction',
      transaction: serializedTx.toString('base64'),
      message: `Claiming: ${task.title}`,
    };

    return NextResponse.json(response, { headers: ACTIONS_CORS_HEADERS });
  } catch (error) {
    console.error('Error building claim transaction:', error);
    return NextResponse.json(
      { error: 'Failed to build claim transaction' },
      { status: 500, headers: ACTIONS_CORS_HEADERS }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: ACTIONS_CORS_HEADERS,
  });
}
