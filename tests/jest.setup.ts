import supertest from 'supertest';

import { MainServer } from '@src/server';

let server: MainServer;

/**
 * Current errors being faced when using "yarn test:func"
 * 
 * 1. "connect ECONNREFUSED 127.0.0.1:80"
 * 2. "Exceeded timeout of 5000 ms for a hook."
*/
beforeAll(async (): Promise<void> => {
  server = new MainServer();
  await server.initialize();

  global.testRequest = supertest(server.getApp());
});

afterAll(async(): Promise<void> => await server.close());