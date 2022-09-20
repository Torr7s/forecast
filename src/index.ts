import './shared/utils/module-alias';

import config from 'config';
import logger from './logger';

import { MainServer } from './shared/infra/http/server';

enum ExitStatus {
  FAILURE = 1,
  SUCCESS = 0
}

process.on('unhandledRejection', (reason, promise): void => {
  logger.error(
    `App exiting due to an unhandled promise: ${promise} and reason: ${reason}`
  );

  throw reason;
});

process.on('uncaughtException', (error: Error): void => {
  logger.error(
    `App exiting due to an uncaught exception: ${error}`
  );

  process.exit(ExitStatus.FAILURE);
});

(async (): Promise<void> => {
  try {
    const server: MainServer = new MainServer(config.get('app.port'));
    await server.initialize();

    server.start();

    const exitSignals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGQUIT'];

    exitSignals.map((signal: NodeJS.Signals): NodeJS.Process =>
      process.on(signal, async (): Promise<void> => {
        try {
          await server.close();

          logger.info(`App exited with success.`);
          process.exit(ExitStatus.SUCCESS);

          /* :D */

        } catch (error) {
          logger.error(`App exited with an error: ${error}`);
          process.exit(ExitStatus.FAILURE);
        }
      }));

  } catch (error) {
    logger.error(`App exited with an error: ${error}`);

    process.exit(ExitStatus.FAILURE);
  }
})();