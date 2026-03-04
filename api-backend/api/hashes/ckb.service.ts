import { ccc } from "@ckb-ccc/core";

const ANCHOR_CAPACITY = BigInt("11000000000"); // 110 CKB in shannons

// Timestamp is intentionally absent — always derived server-side.
interface HashPayload {
  fileHash: string;
}

interface UnsignedTxPayload {
  fileHash: string;
  userAddress: string; // CKB address of the user — output cell is locked to them
}

interface UnsignedTxResult {
  outputs: { lock: object; capacity: string }[];
  outputsData: string[];
}

interface SubmissionResult {
  txHash: string;
  blockNumber: string;
  status: string;
}

class CKBService {
  private client: ccc.Client;
  private signer: ccc.SignerCkbPrivateKey | null = null;

  constructor() {
    const network = process.env.CKB_NETWORK || "testnet";
    this.client =
      network === "mainnet"
        ? new ccc.ClientPublicMainnet()
        : new ccc.ClientPublicTestnet();
  }

  private getSigner(): ccc.SignerCkbPrivateKey {
    if (!this.signer) {
      const privKey = process.env.PRIVATE_KEY;
      if (!privKey || privKey === "0x") {
        throw new Error("PRIVATE_KEY is missing from environment variables");
      }
      this.signer = new ccc.SignerCkbPrivateKey(this.client, privKey);
    }
    return this.signer;
  }

  /**
   * Builds an unsigned transaction shell locked to the user's address.
   * Server generates the timestamp — not the caller.
   * The server wallet is not involved in signing or paying.
   */
  public async buildUnsignedTx(payload: UnsignedTxPayload): Promise<UnsignedTxResult> {
    const { fileHash, userAddress } = payload;

    const userScript = (await ccc.Address.fromString(userAddress, this.client)).script;

    // Server owns the timestamp — not the caller
    const serverTimestamp = new Date().toISOString();
    const encodedData = this.encodeHashData(fileHash, serverTimestamp);

    console.log(`[CKB] Built unsigned tx for ${userAddress} — hash: ${fileHash}`);

    return {
      outputs: [{ lock: userScript, capacity: ccc.numToHex(ANCHOR_CAPACITY) }],
      outputsData: [encodedData],
    };
  }

  /**
   * Legacy: server-signs-and-pays flow. Retained for admin/internal use only.
   */
  public async submitHash(payload: HashPayload): Promise<SubmissionResult> {
    try {
      const signer = this.getSigner();
      const addressObj = await signer.getRecommendedAddressObj();

      // Server owns the timestamp — not the caller
      const serverTimestamp = new Date().toISOString();
      const encodedData = this.encodeHashData(payload.fileHash, serverTimestamp);

      const tx = ccc.Transaction.from({
        outputs: [{ lock: addressObj.script, capacity: ccc.numToHex(ANCHOR_CAPACITY) }],
        outputsData: [encodedData],
      });

      await tx.completeInputsByCapacity(signer);
      await tx.completeFeeBy(signer, 1000);

      const txHash = await signer.sendTransaction(tx);
      console.log(`[CKB] Transaction sent: ${txHash}`);

      return { txHash, blockNumber: "pending", status: "committed" };
    } catch (error: any) {
      console.error("[CKB] Submit failed:", error.message);
      throw new Error(`Failed to anchor hash: ${error.message}`);
    }
  }

  /**
   * Scans cells locked to the given user address for a matching file hash.
   * Does not require the server wallet — userAddress is passed from the client.
   */
  public async verifyHash(
    fileHash: string,
    userAddress: string
  ): Promise<{ timestamp: string; blockNumber: string } | null> {
    try {
      // Resolve user address -> lock script, no server signer needed
      const userScript = (await ccc.Address.fromString(userAddress, this.client)).script;
      const cleanSearchHash = fileHash.startsWith("0x") ? fileHash.slice(2) : fileHash;

      console.log(`[CKB] Searching for hash: ${cleanSearchHash} under ${userAddress}`);

      const cells: any[] = [];
      try {
        const iterator: any = this.client.findCells(
          { script: userScript, scriptType: "lock", scriptSearchMode: "exact" },
          "asc"
        );
        for await (const cell of iterator) cells.push(cell);
      } catch (e: any) {
        console.log("[CKB] findCells error:", e.message);
      }

      for (const cell of cells) {
        if (!cell?.outputData) continue;
        if (!cell.outputData.includes(cleanSearchHash)) continue;

        const decoded = this.decodeHashData(cell.outputData);
        return {
          timestamp: decoded.timestamp,
          blockNumber: cell.blockNumber?.toString() || "unknown",
        };
      }

      return null;
    } catch (error: any) {
      console.error("[CKB] Verify failed:", error.message);
      throw new Error(`Failed to verify hash: ${error.message}`);
    }
  }

  // Encodes [32-byte hash][8-byte timestamp ms] as a hex string.
  // Always called with a server-generated timestamp — never user input.
  private encodeHashData(fileHash: string, timestampISO: string): string {
    const cleanHash = fileHash.startsWith("0x") ? fileHash.slice(2) : fileHash;
    const timestampMs = BigInt(new Date(timestampISO).getTime());
    const timestampHex = timestampMs.toString(16).padStart(16, "0");
    return `0x${cleanHash}${timestampHex}`;
  }

  private decodeHashData(hexData: string): { hash: string; timestamp: string } {
    const data = hexData.startsWith("0x") ? hexData.slice(2) : hexData;
    const hash = data.slice(0, 64);
    const timestampHex = data.slice(64, 80);
    const timestampMs = BigInt(`0x${timestampHex}`);
    return {
      hash: `0x${hash}`,
      timestamp: new Date(Number(timestampMs)).toISOString(),
    };
  }
}

export const ckbService = new CKBService();