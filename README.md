
# HashThis 🛡️
### Immutable Proof of Existence on Nervos CKB

**HashThis** is a decentralized application (dApp) that anchors file fingerprints (SHA-256 hashes) to the **Nervos Common Knowledge Base (CKB)** blockchain. It allows users to create a permanent, tamper-proof timestamp for any digital file without revealing the file's contents to the network.


## Key Features

* **Privacy-First:** Files are hashed locally in the browser using the Web Crypto API. Your actual file data never leaves your device; only the unique hash is sent to the network.
* **Immutable Anchoring:** Hashes are stored in unique Cells on the Nervos CKB Blockchain (Aggron4 Testnet).
* **Instant Verification:** Anyone can verify the existence and original timestamp of a file by re-hashing it and querying the blockchain.
* **Modern Stack:** Built with a scalable Monorepo architecture using TypeScript, React, Vite, Express, and the Lumos SDK.

---

## Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React + Vite | Fast, client-side UI with local hashing logic. |
| **Styling** | Tailwind CSS | Responsive, modern design system. |
| **Backend** | Express.js | REST API layer to handle blockchain transactions. |
| **Blockchain** | Nervos CKB | Layer 1 Proof-of-Work blockchain for maximum security. |
| **SDK** | @ckb-lumos | Official JavaScript/TypeScript SDK for interacting with CKB. |
| **Testing** | Vitest | End-to-End integration testing for API and Blockchain logic. |


##  Project Structure

This project is a Monorepo containing both the client and server code.

```
HashThis/
├── backend/            # Express API & CKB Logic
│   ├── src/
│   │   ├── services/   # Blockchain integration (Lumos)
│   │   ├── controllers/# API Route Handlers
│   │   └── config/     # Environment configuration
│   └── tests/          # E2E Tests
├── frontend/           # React UI
│   ├── src/
│   │   ├── utils/      # Local Hashing (Web Crypto API)
│   │   ├── pages/      # Submit & Verify Views
│   │   └── services/   # API Client
├── package.json        # Root scripts to run the full stack
└── README.md           # Documentation
```

##  Installation & Setup

### 1. Prerequisites
* **Node.js:** v18 or higher (LTS recommended).
* **CKB Wallet:** A testnet wallet with funds. You can get free testnet CKB from the [Nervos Faucet](https://faucet.nervos.org/).

### 2. Clone the Repository

```
git clone [https://github.com/your-username/HashThis.git](https://github.com/your-username/HashThis.git)
cd HashThis
```

### 3. Install Dependencies
We use npm workspaces to manage dependencies for the entire stack at once.

```
npm install
# This automatically installs dependencies for root, backend, and frontend
```

### 4. Environment Configuration

#### Backend Setup
Create a .env file in the backend/ directory:

```
# backend/.env
PORT=3001
NODE_ENV=development

# CKB Configuration (Aggron4 Testnet)
CKB_RPC_URL=[https://testnet.ckb.dev/rpc](https://testnet.ckb.dev/rpc)
CKB_INDEXER_URL=[https://testnet.ckb.dev/indexer](https://testnet.ckb.dev/indexer)

# YOUR PRIVATE KEY (Required for paying transaction fees)
# WARNING: Never use a Mainnet key here! Use a Testnet key.
PRIVATE_KEY=0xYourPrivateKeyHere
```

#### Frontend Setup

Create a .env file in the frontend/ directory:

```
# frontend/.env
VITE_API_URL=http://localhost:3001/api/v1
```

## Running the Application

**Development Mode (Recommended)**
Launch both the Backend API and the Frontend UI simultaneously with a single command:

```
npm start
```

- Frontend UI: Open http://localhost:5173 in your browser.

- Backend API: Runs on http://localhost:3001.

## Testing

Run the End-to-End (E2E) test suite to verify the API endpoints and Blockchain connectivity:

```
npm test
```

## API Documentation

The backend exposes a RESTful API to interact with the CKB blockchain.

**1. Submit Hash (Anchor)**
Writes a new hash to the blockchain.

- Endpoint: `POST /api/v1/hashes`

- Body:

```
{
  "fileHash": "0x...", 
  "timestamp": "2026-02-15T12:00:00Z"
}
```

- Response: Returns the Transaction Hash (TX ID).

**2. Verify Hash (Audit)**

Checks if a hash exists on-chain and retrieves its original timestamp.

- Endpoint: `GET /api/v1/hashes/:hash`

- Response:

```
{
  "timestamp": "2026-02-15T12:00:00Z",
  "blockNumber": "0x123..."
}
```

## License
This project is open source and available under the [MIT License]().

Built with ❤️ by oïclid on Nervos CKB.