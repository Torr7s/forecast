import { Application } from 'express';
import supertest from 'supertest';

import { MainServer } from '@src/server';

beforeAll((): void => {
  const server: MainServer = new MainServer();
  server.initialize();

  const app: Application = server.getApp();

  global.testRequest = supertest(app);
});