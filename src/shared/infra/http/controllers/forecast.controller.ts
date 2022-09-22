import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';
import { Request, Response } from 'express';

import { 
  ClassMiddleware, 
  Controller, 
  Get, 
  Middleware 
} from '@overnightjs/core';

import { BaseController } from './base.controller';

import { ForecastService } from '@src/services/forecast.service';

import { AuthMiddleware } from '@src/shared/infra/http/middlewares/auth.middleware';
import { Beach, BeachModel } from '@src/shared/infra/mongo/models/beach.model';
import { ApiError } from '@src/shared/utils/errors/api.error';

import { TimeForecast } from '@src/typings';

import logger from '@src/logger';

const forecastService = new ForecastService();

const RateLimiterMiddleware: RateLimitRequestHandler = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  keyGenerator: (request: Request): string => request.ip,
  handler(_: Request, response: Response): Response {  
    return response.status(429).send(
      ApiError.format({
        code: 429,
        message: 'Too many requests to /api/forecast endpoint'
      })
    );
  }
});

@Controller('api/forecast')
@ClassMiddleware(AuthMiddleware)
export class ForecastController extends BaseController {
  @Get('')
  @Middleware(RateLimiterMiddleware)
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