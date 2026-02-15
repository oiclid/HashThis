import { Request, Response } from 'express';
import { ckbService } from '../services/ckb.service.js';
import { logger } from '../utils/logger.js';

/**
 * Endpoint to submit a hash to the CKB blockchain.
 */
export const submitHash = async (req: Request, res: Response) => {
  try {
    const { fileHash, timestamp } = req.body;

    if (!fileHash || !timestamp) {
      return res.status(400).json({ error: 'Missing fileHash or timestamp' });
    }

    logger.info(`API Request: Submit Hash ${fileHash}`);
    const result = await ckbService.submitHash({ fileHash, timestamp });
    
    return res.status(200).json(result);
  } catch (error: any) {
    logger.error('Controller Error: submitHash', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

/**
 * Endpoint to verify if a hash exists on the CKB blockchain.
 */
export const verifyHash = async (req: Request, res: Response) => {
  try {
    const { hash } = req.params;

    if (!hash) {
      return res.status(400).json({ error: 'Hash parameter is required' });
    }

    logger.info(`API Request: Verify Hash ${hash}`);
    const result = await ckbService.verifyHash(hash);

    if (!result) {
      return res.status(404).json({ message: 'Hash not found on chain' });
    }

    return res.status(200).json(result);
  } catch (error: any) {
    logger.error('Controller Error: verifyHash', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};