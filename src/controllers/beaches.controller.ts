import mongoose from 'mongoose';

import { Request, Response } from 'express';
import { ClassMiddleware, Controller, Post } from '@overnightjs/core';

import { Beach, BeachModel } from '@src/shared/infra/mongo/models/beach.model';

import { AuthMiddleware } from '@src/shared/infra/http/middlewares/auth.middleware';

import logger from '@src/logger';

@Controller('api/beaches')
@ClassMiddleware(AuthMiddleware)
export class BeachesController {
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
      if (error instanceof mongoose.Error.ValidationError) {
        return response
          .status(422)
          .send({
            error: (error as Error).message
          });
      }

      logger.error(error);

      return response
        .status(500)
        .send({
          error: 'Internal Server Error'
        });
    }
  }
}