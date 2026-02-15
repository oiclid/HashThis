import React, { useState } from 'react';
import { api } from '../services/api';

export const VerifyPage = () => {
  const [hashInput, setHashInput] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await api.verifyHash(hashInput);
      setResult(data);
    } catch (err: any) {
      // 404 means not found, which is a valid result for verification
      if (err.response?.status === 404) {
        setError('Hash not found on chain. This file may not have been anchored yet.');
      } else {
        setError('Connection error or invalid hash format.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold mb-2">Verify Integrity</h2>
      <p className="text-gray-500 mb-6">Enter a SHA-256 hash to check its original timestamp.</p>

      <form onSubmit={handleVerify} className="flex gap-2 mb-6">
        <input 
          type="text" 
          placeholder="0x..." 
          value={hashInput}
          onChange={(e) => setHashInput(e.target.value)}
          className="flex-grow p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
        />
        <button 
          type="submit" 
          disabled={loading || !hashInput}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? '...' : 'Check'}
        </button>
      </form>

      {result && (
        <div className="p-4 bg-blue-50 text-blue-900 rounded-md">
          <p className="font-bold mb-1">✅ Verified Record Found</p>
          <p className="text-sm">Timestamp: {new Date(result.timestamp).toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">Block: {result.blockNumber}</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-gray-100 text-gray-600 rounded-md">
          <p>⚠️ {error}</p>
        </div>
      )}
    </div>
  );
};