import axios from 'axios';

// We use the environment variable, but fall back to localhost for dev
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  /**
   * Anchors a hash to the CKB blockchain via the backend.
   */
  submitHash: async (fileHash: string, timestamp: string) => {
    const response = await client.post('/hashes', { fileHash, timestamp });
    return response.data;
  },

  /**
   * Checks if a hash already exists on-chain.
   */
  verifyHash: async (hash: string) => {
    const response = await client.get(`/hashes/${hash}`);
    return response.data;
  },

  /**
   * Backend health check to ensure we can connect.
   */
  checkHealth: async () => {
    try {
      const response = await client.get('http://localhost:3001/health');
      return response.data;
    } catch (error) {
      console.error("API Health Check Failed", error);
      return { status: 'offline' };
    }
  }
};