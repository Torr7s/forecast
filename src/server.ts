import './shared/utils/module-alias';

import express, { Application } from 'express';
import { Server } from '@overnightjs/core';

import * as database from './shared/database';

import { ForecastController } from './controllers/forecast.controller';
import { BeachesController } from './controllers/beaches.controller';

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

    this.addControllers([
      beachesController,
      forecastController
    ]);
  }

  private async databaseSetup(): Promise<void> {
    database.connect();
  }

  /* Will close the whole app */
  public async close(): Promise<void> {
    await database.close();
  }

  public start(): void {
    this.app.listen(this.port, (): void => {
      console.info(
        'Server listening on port ', this.port
      );
    });
  }

  public getApp(): Application {
    return this.app;
  }
}