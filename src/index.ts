import { MainServer } from './server';

import config from 'config';

(async(): Promise<void> => {
  const server: MainServer = new MainServer(config.get('app.port'));
  await server.initialize();

  server.start();
})();