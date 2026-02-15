export interface HashPayload {
  fileHash: string;      // The SHA-256 hash of the file
  timestamp: string;     // ISO String of when it was hashed
  fileName?: string;     // Optional metadata
}

export interface SubmissionResult {
  txHash: string;
  blockNumber: string;
  status: 'pending' | 'committed';
}