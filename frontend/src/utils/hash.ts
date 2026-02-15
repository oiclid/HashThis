/**
 * Generates a SHA-256 hash of a file using the browser's native Web Crypto API.
 * This ensures privacy: the actual file data never leaves the client.
 */
export async function hashFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  
  // Convert buffer to hex string
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
    
  return `0x${hashHex}`;
}

/**
 * Formats a timestamp for the blockchain submission.
 */
export function getCurrentISOTimestamp(): string {
  return new Date().toISOString();
}