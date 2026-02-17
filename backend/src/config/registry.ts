import dotenv from 'dotenv';
import path from 'path';

// On Koyeb/production, env vars are injected directly.
// Locally, load from backend/.env using process.cwd() instead of import.meta (production-compatible)
const envPath = path.resolve(process.cwd(), '.env');

dotenv.config({ path: envPath });

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
    // Ensure 0x prefix if missing
    signerPrivKey: process.env.PRIVATE_KEY?.startsWith('0x')
      ? process.env.PRIVATE_KEY
      : `0x${process.env.PRIVATE_KEY}`,
    network: (process.env.CKB_NETWORK || 'testnet') as 'testnet' | 'mainnet',
  },
  app: {
    // Default to Vite's port 5173 for local development
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    apiPrefix: '/api/v1',
  }
};

/**
 * Validates critical environment variables.
 * Call this in your entry point (app.ts) to crash early if setup is wrong.
 */
export function checkEnvStability() {
  const required = ['PRIVATE_KEY', 'CKB_RPC_URL'];
  const missing = required.filter(key => !process.env[key] || process.env[key] === 'undefined');

  if (missing.length > 0) {
    console.error('❌ Found missing variables');
    throw new Error(`Environment Instability: Missing ${missing.join(', ')}`);
  }

  console.log('✅ Registry: Environment variables loaded successfully.');
}