import './shared/utils/module-alias';

import config from 'config';
import logger from './logger';

import { MainServer } from './shared/infra/http/server';

enum ExitStatus {
  FAILURE = 1,
  SUCCESS = 0
}

(async(): Promise<void> => {
  try {
    const server: MainServer = new MainServer(config.get('app.port'));
    await server.initialize();
  
    server.start();
  } catch (error) {
    logger.error(`App exited with error: ${error}`);

    process.exit(ExitStatus.FAILURE);
  }
})();