import app from './app.js';
import { registry, checkEnvStability } from './config/registry.js';
import { logger } from './utils/logger.js';
import { ckbService } from './services/ckb.service.js';

async function bootstrap() {
  try {
    // 1. Verify Environment Variables
    checkEnvStability();

    // 2. Start CKB Service (Initialize Lumos config)
    await ckbService.start();

    // 3. Start Express Server
    const { port } = registry.server;
    app.listen(port, () => {
      logger.info(`🚀 HashThis Backend running on port ${port}`);
      logger.info(`API Environment: ${registry.server.env}`);
      logger.info(`Target Network: ${registry.ckb.network}`);
    });
  } catch (error) {
    logger.error('Critical Failure during bootstrap', error);
    process.exit(1);
  }
}

bootstrap();