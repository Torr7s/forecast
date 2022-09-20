import express, { Application } from 'express';
import { Server } from '@overnightjs/core';

import * as database from '../mongo';

import { BeachesController } from '@src/controllers/beaches.controller';
import { ForecastController } from '@src/controllers/forecast.controller';
import { UsersController } from '@src/controllers/users.controller';

import logger from '@src/logger';

export class MainServer extends Server {
  constructor(private port: number = 3000) {
    super();
  }

  public async initialize(): Promise<void> {
    this.setupExpress();
    this.setupControllers();

    await this.databaseSetup();
  }

  private setupExpress(): void {
    this.app.use(express.json());
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

  public getApp(): Application {
    return this.app;
  }
}