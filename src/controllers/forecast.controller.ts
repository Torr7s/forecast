import { Request, Response } from 'express';
import { ClassMiddleware, Controller, Get } from '@overnightjs/core';

import { ForecastService } from '@src/services/forecast.service';

import { Beach, BeachModel } from '@src/shared/infra/mongo/models/beach.model';

import { AuthMiddleware } from '@src/shared/infra/http/middlewares/auth.middleware';

import { TimeForecast } from '@src/typings';

import logger from '@src/logger';

const forecastService = new ForecastService();

@Controller('api/forecast')
@ClassMiddleware(AuthMiddleware)
export class ForecastController {
  @Get('')
  public async getForecastForLoggedUser(request: Request, response: Response): Promise<Response> {
    try {
      const beaches: BeachModel[] = await Beach.find({ user: request.user });
      
      const forecastData: TimeForecast[] = await forecastService.processForecastForBeaches(beaches);

      return response.status(200).send(forecastData);
    } catch (error) {
      logger.error(error);

      return response
        .status(500)
        .send({
          error: 'Something went wrong'
        });
    }
  }
}