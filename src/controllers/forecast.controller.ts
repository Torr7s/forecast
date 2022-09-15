import { Request, Response } from 'express';
import { Controller, Get } from '@overnightjs/core';

import { ForecastService } from '@src/services/forecast.service';

import { Beach, BeachModel } from '@src/shared/database/models/beach.model';
import { TimeForecast } from '@src/typings';

const forecastService = new ForecastService();

@Controller('api/forecast')
export class ForecastController {
  @Get('')
  public async getForecastForLoggedUser(_: Request, response: Response): Promise<Response> {
    const beaches: BeachModel[] = await Beach.find({});
    const forecastData: TimeForecast[] = await forecastService.processForecastForBeaches(beaches);

    return response.status(200).send(forecastData);
  }
}