import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { registry } from './config/registry.js';
import { logger } from './utils/logger.js';
import * as hashController from './controllers/hash.controller.js';

const app = express();

// --- Middleware ---
app.use(helmet()); // Basic security headers
app.use(cors({ origin: registry.app.corsOrigin }));
app.use(express.json()); // Body parser

// --- Health Check ---
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    network: registry.ckb.network,
    timestamp: new Date().toISOString()
  });
});

// --- API Routes ---
const prefix = registry.app.apiPrefix;

app.post(`${prefix}/hashes`, hashController.submitHash);
app.get(`${prefix}/hashes/:hash`, hashController.verifyHash);

// --- Error Handling ---
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled Exception', err);
  res.status(500).json({ error: 'An unexpected error occurred' });
});

export default app;