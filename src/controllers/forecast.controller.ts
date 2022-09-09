import { Request, Response } from 'express';
import { Controller, Get } from '@overnightjs/core';

@Controller('api/forecast')
export class ForecastController {

  @Get('')
  public getForecastForLoggedUser(_: Request, response: Response): void {
    response.send({
      status: 'ok',
      message: 'Forecast controller test'
    });
  }
}