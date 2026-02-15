import dotenv from 'dotenv';
dotenv.config();

/**
 * Registry serves as the immutable source of truth for the backend.
 */
export const registry = {
  server: {
    port: Number(process.env.PORT) || 3001,
    env: process.env.NODE_ENV || 'development',
    isDev: process.env.NODE_ENV !== 'production',
  },
  ckb: {
    rpcUrl: process.env.CKB_RPC_URL || 'https://testnet.ckb.dev/rpc',
    indexerUrl: process.env.CKB_INDEXER_URL || 'https://testnet.ckb.dev/indexer',
    signerPrivKey: process.env.PRIVATE_KEY || '',
    network: (process.env.CKB_NETWORK || 'testnet') as 'testnet' | 'mainnet',
  },
  // CHANGED: 'security' is now 'app' to match src/app.ts
  app: {
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    apiPrefix: '/api/v1',
  }
};

/**
 * Validates critical environment variables.
 */
export function checkEnvStability() {
  const required = ['PRIVATE_KEY', 'CKB_RPC_URL'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Environment Instability: Missing ${missing.join(', ')}`);
  }
}