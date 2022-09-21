import { Request, Response } from 'express';
import { 
  ClassMiddleware, 
  Controller, 
  Get 
} from '@overnightjs/core';

import { ForecastService } from '@src/services/forecast.service';
import { TimeForecast } from '@src/typings';

import { BaseController } from './base.controller';

import { Beach, BeachModel } from '@src/shared/infra/mongo/models/beach.model';

import { AuthMiddleware } from '@src/shared/infra/http/middlewares/auth.middleware';

import logger from '@src/logger';

const forecastService = new ForecastService();

@Controller('api/forecast')
@ClassMiddleware(AuthMiddleware)
export class ForecastController extends BaseController {
  @Get('')
  public async getForecastForLoggedUser(request: Request, response: Response): Promise<Response> {
    try {
      const beaches: BeachModel[] = await Beach.find({ user: request.user });
      
      const forecastData: TimeForecast[] = await forecastService.processForecastForBeaches(beaches);

      return response.status(200).send(forecastData);
    } catch (error) {
      logger.error(error);

      return this.createErrorResponse(response, {
        code: 500,
        message: 'Something went wrong'
      });
    }
  }
}