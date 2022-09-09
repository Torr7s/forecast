import './utils/module-alias';

import express from 'express';
import OvernightJs from '@overnightjs/core';

import { ForecastController } from './controllers/forecast.controller';

export class MainServer extends OvernightJs.Server {
  constructor(private port: number = 3000) {
    super();
  };

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
}