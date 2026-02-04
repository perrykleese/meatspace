import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Meatspace } from '../target/types/meatspace';
import { PublicKey, SystemProgram, Keypair } from '@solana/web3.js';
import { assert } from 'chai';

describe('meatspace', () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Meatspace as Program<Meatspace>;

  // Test wallets
  const agent = Keypair.generate();
  const worker = Keypair.generate();

  before(async () => {
    // Airdrop SOL for tests
    const airdropAgent = await provider.connection.requestAirdrop(
      agent.publicKey,
      2 * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(airdropAgent);

    const airdropWorker = await provider.connection.requestAirdrop(
      worker.publicKey,
      2 * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(airdropWorker);
  });

  describe('Agent Management', () => {
    it('registers an agent', async () => {
      const [agentPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('agent'), agent.publicKey.toBuffer()],
        program.programId
      );

      await program.methods
        .registerAgent('TestAgent', 'https://example.com/agent.json')
        .accounts({
          agent: agentPda,
          authority: agent.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([agent])
        .rpc();

      const agentAccount = await program.account.agent.fetch(agentPda);
      assert.equal(agentAccount.name, 'TestAgent');
      assert.equal(agentAccount.tasksCreated.toNumber(), 0);
      assert.equal(agentAccount.reputationScore, 100);
    });
  });

  describe('Worker Management', () => {
    it('registers a worker', async () => {
      const [workerPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('worker'), worker.publicKey.toBuffer()],
        program.programId
      );

      const locationHash = Buffer.alloc(32);
      locationHash.write('austin-tx-location-hash');

      await program.methods
        .registerWorker(
          'TestWorker',
          ['photography', 'verification'],
          Array.from(locationHash)
        )
        .accounts({
          worker: workerPda,
          authority: worker.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([worker])
        .rpc();

      const workerAccount = await program.account.worker.fetch(workerPda);
      assert.equal(workerAccount.name, 'TestWorker');
      assert.equal(workerAccount.isActive, true);
      assert.equal(workerAccount.reputationScore, 100);
    });
  });

  // More tests would go here for task creation, claiming, proof submission, etc.
});
