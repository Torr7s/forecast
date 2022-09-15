import supertest from 'supertest';

import { MainServer } from '@src/server';

let server: MainServer;

beforeAll(async (): Promise<void> => {
  server = new MainServer();
  await server.initialize();

  global.testRequest = supertest(server.getApp());
});

afterAll(async(): Promise<void> => await server.close());