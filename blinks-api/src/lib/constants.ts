// MEATSPACE Protocol Constants

// Program ID - will be updated after deployment
export const PROGRAM_ID = process.env.PROGRAM_ID || 'MeatSpaceProtoco1111111111111111111111111111';

// $MEAT Token Mint
export const MEAT_TOKEN_MINT = 'H2nao1f6tYfnDFTNDWpTJShNztPFDtoKGPP6pWaJGvHy';

// RPC Connection
export const CONNECTION_URL = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';

// App URL
export const MEATSPACE_URL = process.env.NEXT_PUBLIC_URL || 'https://meatspace.work';

// API Rate Limits
export const CLAIM_RATE_LIMIT = 5; // claims per hour per wallet

// Task Categories
export const TASK_CATEGORIES = [
  'verification',
  'delivery',
  'inspection',
  'survey',
  'mystery_shop',
  'photography',
  'data_collection',
  'other',
] as const;

export type TaskCategory = (typeof TASK_CATEGORIES)[number];
