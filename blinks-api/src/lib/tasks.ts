import { Connection, PublicKey } from '@solana/web3.js';
import { CONNECTION_URL, PROGRAM_ID, TaskCategory } from './constants';

export interface Task {
  id: string;
  taskIdNum: number;
  agentPubkey: string;
  title: string;
  description: string;
  category: TaskCategory;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';
  bounty: {
    amount: string;
    currency: 'MEAT' | 'USDC';
  };
  location?: {
    city: string;
    lat?: number;
    lng?: number;
    radiusMeters?: number;
  };
  deadline: Date;
  maxWorkers: number;
  currentWorkers: number;
  workersNearby?: number;
  createdAt: Date;
}

// Demo tasks for testing - in production, fetch from on-chain or indexer
const DEMO_TASKS: Record<string, Task> = {
  task_demo1: {
    id: 'task_demo1',
    taskIdNum: 1,
    agentPubkey: '11111111111111111111111111111111',
    title: 'Photograph storefront at 456 Oak St',
    description:
      'Take a clear photo of the business sign and entrance during business hours. Verify the store is open.',
    category: 'verification',
    status: 'open',
    bounty: { amount: '25.00', currency: 'MEAT' },
    location: {
      city: 'Austin, TX',
      lat: 30.2672,
      lng: -97.7431,
      radiusMeters: 50,
    },
    deadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
    maxWorkers: 1,
    currentWorkers: 0,
    workersNearby: 3,
    createdAt: new Date(),
  },
  task_demo2: {
    id: 'task_demo2',
    taskIdNum: 2,
    agentPubkey: '11111111111111111111111111111111',
    title: 'Pick up package from downtown office',
    description:
      'Pick up a small envelope from the lobby desk at 100 Congress Ave and deliver to Suite 400 at 200 Congress Ave.',
    category: 'delivery',
    status: 'open',
    bounty: { amount: '40.00', currency: 'MEAT' },
    location: {
      city: 'Austin, TX',
      lat: 30.2649,
      lng: -97.7428,
      radiusMeters: 500,
    },
    deadline: new Date(Date.now() + 4 * 60 * 60 * 1000),
    maxWorkers: 1,
    currentWorkers: 0,
    workersNearby: 7,
    createdAt: new Date(),
  },
  task_demo3: {
    id: 'task_demo3',
    taskIdNum: 3,
    agentPubkey: '11111111111111111111111111111111',
    title: 'Survey local coffee shop prices',
    description:
      'Visit 3 coffee shops within 1 mile and record the prices for: small drip coffee, medium latte, large cold brew.',
    category: 'survey',
    status: 'open',
    bounty: { amount: '15.00', currency: 'MEAT' },
    location: {
      city: 'Austin, TX',
      lat: 30.27,
      lng: -97.74,
      radiusMeters: 1609,
    },
    deadline: new Date(Date.now() + 48 * 60 * 60 * 1000),
    maxWorkers: 3,
    currentWorkers: 1,
    workersNearby: 12,
    createdAt: new Date(),
  },
};

export async function getTask(taskId: string): Promise<Task | null> {
  // Check demo tasks first
  if (DEMO_TASKS[taskId]) {
    return DEMO_TASKS[taskId];
  }

  // Try to fetch from chain
  try {
    const connection = new Connection(CONNECTION_URL, 'confirmed');
    const programId = new PublicKey(PROGRAM_ID);

    // Parse task ID format: task_<base58>
    const taskIdMatch = taskId.match(/^task_(.+)$/);
    if (!taskIdMatch) {
      return null;
    }

    // For now, return null for non-demo tasks
    // In production, decode the task account here
    return null;
  } catch (error) {
    console.error('Error fetching task from chain:', error);
    return null;
  }
}

export async function listTasks(options?: {
  status?: string;
  category?: string;
  near?: { lat: number; lng: number; radiusMeters: number };
  limit?: number;
}): Promise<Task[]> {
  // Return demo tasks for now
  let tasks = Object.values(DEMO_TASKS);

  if (options?.status) {
    tasks = tasks.filter((t) => t.status === options.status);
  }

  if (options?.category) {
    tasks = tasks.filter((t) => t.category === options.category);
  }

  if (options?.limit) {
    tasks = tasks.slice(0, options.limit);
  }

  return tasks;
}
