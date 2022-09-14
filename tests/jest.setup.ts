import supertest from 'supertest';

import { MainServer } from '@src/server';

let server: MainServer;

/* Facing a jest issue: "Exceeded timeout of 5000 ms for a hook." */
beforeAll(async (): Promise<void> => {
  server = new MainServer();
  await server.initialize();

  global.testRequest = supertest(server.getApp());
});

afterAll(async(): Promise<void> => await server.close());