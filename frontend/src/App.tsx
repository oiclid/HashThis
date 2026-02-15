import { useState, useEffect } from 'react';
import { api } from './services/api';
import { hashFile } from './utils/hash';

function App() {
  const [status, setStatus] = useState<string>('Initializing...');
  const [network, setNetwork] = useState<string>('Unknown');

  // Check backend connection on load
  useEffect(() => {
    api.checkHealth().then((data) => {
      if (data.status === 'ok') {
        setStatus('Backend Connected');
        setNetwork(data.network);
      } else {
        setStatus('Backend Offline');
      }
    });
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setStatus('Hashing locally...');
      // 1. Hash the file
      const hash = await hashFile(file);
      setStatus(`Hash generated: ${hash.slice(0, 10)}...`);
      
      // 2. (Simulated) Submit to backend
      console.log("Ready to submit:", hash);
    } catch (err) {
      setStatus('Error processing file');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">HashThis Prototype</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <div className="mb-4 text-sm">
          <p><strong>System Status:</strong> <span className={status.includes('Offline') ? "text-red-500" : "text-green-600"}>{status}</span></p>
          <p><strong>Network:</strong> {network}</p>
        </div>

        <div className="border-t pt-4">
          <label className="block mb-2 text-sm font-medium text-gray-900">Test Local Hashing</label>
          <input 
            type="file" 
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
      </div>
    </div>
  );
}

export default App;