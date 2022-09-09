import './utils/module-alias';

import express from 'express';
import OvernightJs from '@overnightjs/core';

export class MainServer extends OvernightJs.Server {
  constructor(private port: number = 3000) {
    super();
  };

  public initialize(): void {
    this.setupExpress();
  }

  private setupExpress(): void {
    this.app.use(express.json());
    this.app.use(
      express.urlencoded({
        extended: true
      })
    );
  }
}