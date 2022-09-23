import { Request, Response } from 'express';
import {
  ClassMiddleware,
  Controller,
  Post
} from '@overnightjs/core';

import { BaseController } from './base.controller';

import { Beach } from '@src/shared/infra/mongo/models/beach.model';
import { BeachRepository, WithId } from '@src/repositories';

import { AuthMiddleware } from '@src/shared/infra/http/middlewares/auth.middleware';

import logger from '@src/logger';

@Controller('api/beaches')
@ClassMiddleware(AuthMiddleware)
export class BeachesController extends BaseController {
  constructor(private beachRepository: BeachRepository) {
    super();
  };

  @Post('')
  public async create(request: Request, response: Response): Promise<Response> {
    try {
      const beach: WithId<Beach> = await this.beachRepository.create({
        ...request.body,
        ...{
          user: request.user
        }
      });

      return response.status(201).send(beach);
    } catch (error) {
      logger.error(error);

      return this.sendCreateUpdateErrorResponse(response, error);
    }
  }
}