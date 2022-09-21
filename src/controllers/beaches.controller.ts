import { Request, Response } from 'express';
import { 
  ClassMiddleware, 
  Controller, 
  Post 
} from '@overnightjs/core';

import { BaseController } from './base.controller';

import { Beach, BeachModel } from '@src/shared/infra/mongo/models/beach.model';

import { AuthMiddleware } from '@src/shared/infra/http/middlewares/auth.middleware';

import logger from '@src/logger';

@Controller('api/beaches')
@ClassMiddleware(AuthMiddleware)
export class BeachesController extends BaseController {
  @Post('')
  public async create(request: Request, response: Response): Promise<Response> {
    try {
      const beach: BeachModel = await new Beach({
        ...request.body,
        ...{
          user: request.user
        }
      }).save();

      return response.status(201).send(beach);
    } catch (error) {
      logger.error(error);

      return this.sendCreateUpdateErrorResponse(response, error);
    }
  }
}