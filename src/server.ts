import './shared/utils/module-alias';

import express, { Application } from 'express';
import { Server } from '@overnightjs/core';

import * as database from './database';
import { ForecastController } from './controllers/forecast.controller';

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
    const forecastController = new ForecastController();

    this.addControllers([
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

  public getApp(): Application {
    return this.app;
  }
}