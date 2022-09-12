import './shared/utils/module-alias';

import express, { Application } from 'express';
import { Server } from '@overnightjs/core';

import { ForecastController } from './controllers/forecast.controller';

export class MainServer extends Server {
  constructor(private port: number = 3000) {
    super();
  }

  public initialize(): void {
    this.setupExpress();
    this.setupControllers();
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

  public getApp(): Application {
    return this.app;
  }
}