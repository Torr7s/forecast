import './shared/utils/module-alias';

import config from 'config';

import { MainServer } from './shared/infra/http/server';

(async(): Promise<void> => {
  const server: MainServer = new MainServer(config.get('app.port'));
  await server.initialize();

  server.start();
})();