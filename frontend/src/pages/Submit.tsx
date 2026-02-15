import React, { useState } from 'react';
import { hashFile, getCurrentISOTimestamp } from '../utils/hash';
import { api } from '../services/api';

export const SubmitPage = () => {
  const [status, setStatus] = useState<'idle' | 'hashing' | 'submitting' | 'success' | 'error'>('idle');
  const [txHash, setTxHash] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // 1. Local Hashing
      setStatus('hashing');
      const hash = await hashFile(file);
      const timestamp = getCurrentISOTimestamp();
      
      // 2. Submit to Blockchain
      setStatus('submitting');
      const result = await api.submitHash(hash, timestamp);
      
      setTxHash(result.txHash);
      setStatus('success');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to process file');
      setStatus('error');
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold mb-2">Anchor a File</h2>
      <p className="text-gray-500 mb-6">Select a file to generate a hash and secure it on the Nervos Blockchain.</p>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors">
        <input 
          type="file" 
          onChange={handleFileChange} 
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      {status === 'hashing' && <div className="mt-4 text-blue-600">Generating SHA-256 Hash...</div>}
      {status === 'submitting' && <div className="mt-4 text-indigo-600">Broadcasting to CKB...</div>}
      
      {status === 'success' && (
        <div className="mt-6 p-4 bg-green-50 text-green-800 rounded-md break-all">
          <p className="font-bold">✅ Success!</p>
          <p className="text-xs mt-1">TX: {txHash}</p>
        </div>
      )}

      {status === 'error' && (
        <div className="mt-6 p-4 bg-red-50 text-red-800 rounded-md">
          <p className="font-bold">❌ Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};