import 'dotenv/config';
import './shared/utils/module-alias';

import { MainServer } from './server';

(async(): Promise<void> => {
  const server: MainServer = new MainServer();
  await server.initialize();

  server.start();
})();