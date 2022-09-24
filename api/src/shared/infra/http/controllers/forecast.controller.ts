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
import { ApiError } from '@src/shared/utils/errors/api.error';

import { Beach } from '@src/shared/infra/mongo/models/beach.model';
import { BeachRepository, WithId } from '@src/repositories/base.repository';

import { BeachForecast, TimeForecast } from '@src/typings';

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
  constructor(private beachRepository: BeachRepository) {
    super();
  };

  @Get('')
  @Middleware(RateLimiterMiddleware)
  public async getForecastForLoggedUser(request: Request, response: Response): Promise<Response> {
    try {
      const {
        orderField,
        orderBy
      }: {
        orderField?: keyof BeachForecast;
        orderBy?: 'asc' | 'desc';
      } = request.query;

      if (!request.userId) {
        return this.createErrorResponse(response, {
          code: 500,
          message: 'Something went wrong'
        });
      }

      const beaches: WithId<Beach>[] = await this.beachRepository.findAllBeachesForUser(request.userId);

      const forecastData: TimeForecast[] = await forecastService.processForecastForBeaches(
        beaches,
        orderField,
        orderBy
      );

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