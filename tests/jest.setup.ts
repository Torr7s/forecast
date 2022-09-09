import supertest from 'supertest';

import { MainServer } from '@src/server';

beforeAll((): void => {
  const server: MainServer = new MainServer();
  server.initialize();

  global.testRequest = supertest(server.getApp());
});