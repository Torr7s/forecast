import mongoose from 'mongoose';

import { Request, Response } from 'express';
import { ClassMiddleware, Controller, Post } from '@overnightjs/core';

import { Beach, BeachModel } from '@src/shared/database/models/beach.model';

import { AuthMiddleware } from '@src/shared/infra/http/middlewares/auth.middleware';

@Controller('api/beaches')
@ClassMiddleware(AuthMiddleware)
export class BeachesController {
  @Post('')
  public async create(request: Request, response: Response): Promise<Response> {
    try {
      const beach: BeachModel = await new Beach(request.body).save();

      return response.status(201).send(beach);
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        return response
          .status(422)
          .send({
            error: (error as Error).message
          });
      }

      return response
        .status(500)
        .send({
          error: 'Internal Server Error'
        });
    }
  }
}