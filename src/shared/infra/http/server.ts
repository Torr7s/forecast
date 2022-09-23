import express from 'express';
import cors from 'cors';
import expressPino from 'express-pino-logger';
import swaggerUI from 'swagger-ui-express';

import swaggerJSON from '@src/swagger.json';
import logger from '@src/logger';

import * as database from '../mongo';
import * as OpenApiValidator from 'express-openapi-validator';

import { Server } from '@overnightjs/core';

import { OpenAPIV3 } from 'express-openapi-validator/dist/framework/types';

import { BeachesController } from './controllers/beaches.controller';
import { ForecastController } from './controllers/forecast.controller';
import { UsersController } from './controllers/users.controller';

import { MongoBeachRepository } from '@src/repositories/beach.repository';
import { MongoUserRepository } from '@src/repositories/user.repository';

import { ApiErrorValidator } from './middlewares/api-error-validator.middleware';

export class MainServer extends Server {
  constructor(private port: number = 3000) {
    super();
  }

  public async initialize(): Promise<void> {
    this.setupExpress();
    this.setupDocs();
    this.setupControllers();

    await this.databaseSetup();

    this.setupErrorMiddleware();
  }

  private setupExpress(): void {
    this.app.use(express.json());
    this.app.use(
      expressPino({
        logger
      })
    );
    this.app.use(
      cors({
        origin: '*'
      })
    );
    this.app.use(
      express.urlencoded({
        extended: true
      })
    );
  }

  private setupErrorMiddleware(): void {
    this.app.use(ApiErrorValidator);
  }

  private setupControllers(): void {
    const mongoBeachRepo: MongoBeachRepository = new MongoBeachRepository();
    const mongoUserRepo: MongoUserRepository = new MongoUserRepository();

    const beachesController: BeachesController = new BeachesController(mongoBeachRepo);
    const forecastController: ForecastController = new ForecastController(mongoBeachRepo);
    const usersController: UsersController = new UsersController(mongoUserRepo);

    this.addControllers([
      beachesController,
      forecastController,
      usersController
    ]);
  }

  private setupDocs(): void {
    this.app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerJSON));
    this.app.use(
      OpenApiValidator.middleware({
        apiSpec: swaggerJSON as OpenAPIV3.Document,
        validateRequests: true,
        validateResponses: true
      })
    );
  }

  private async databaseSetup(): Promise<void> {
    await database.connect();
  }

  public async close(): Promise<void> {
    await database.close();
  }

  public start(): void {
    this.app.listen(this.port, (): void => {
      logger.info(
        `Server listening on port ${this.port}.`
      );
    });
  }

  public getApp(): express.Application {
    return this.app;
  }
}