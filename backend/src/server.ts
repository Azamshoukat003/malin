import app from './app';
import { connectDB } from './config/db';
import { env } from './config/env';
import { logger } from './utils/logger';

const start = async (): Promise<void> => {
  await connectDB();
  app.listen(env.PORT, () => {
    logger.info(`API listening on port ${env.PORT}`);
  });
};

start().catch((err: Error) => {
  logger.error(`Startup failed: ${err.message}`);
  process.exit(1);
});
