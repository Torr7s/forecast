import express from 'express';
import cors from 'cors';
import expressPino from 'express-pino-logger';
import swaggerUI from 'swagger-ui-express';

import { Server } from '@overnightjs/core';

import * as OpenApiValidator from 'express-openapi-validator';
import { OpenAPIV3 } from 'express-openapi-validator/dist/framework/types';

import apiSchema from '@src/api-schema.json';
import logger from '@src/logger';

import * as database from '../mongo';

import { BeachesController } from '@src/controllers/beaches.controller';
import { ForecastController } from '@src/controllers/forecast.controller';
import { UsersController } from '@src/controllers/users.controller';

export class MainServer extends Server {
  constructor(private port: number = 3000) {
    super();
  }

  public async initialize(): Promise<void> {
    this.setupExpress();
    this.setupDocs();
    this.setupControllers();

    await this.databaseSetup();
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

  private setupControllers(): void {
    const beachesController: BeachesController = new BeachesController()
    const forecastController: ForecastController = new ForecastController();
    const usersController: UsersController = new UsersController();

    this.addControllers([
      beachesController,
      forecastController,
      usersController
    ]);
  }

  private setupDocs(): void {
    this.app.use('/docs', swaggerUI.serve, swaggerUI.setup(apiSchema));
    this.app.use(
      OpenApiValidator.middleware({
        apiSpec: apiSchema as OpenAPIV3.Document,
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