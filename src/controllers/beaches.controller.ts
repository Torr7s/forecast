import mongoose from 'mongoose';

import { Request, Response } from 'express';
import { Controller, Post } from '@overnightjs/core';

import { Beach, BeachModel } from '@src/shared/database/models/beach.model';

@Controller('api/beaches')
export class BeachesController {
  @Post('')
  public async create(request: Request, response: Response): Promise<Response> {
    try {
      const beach = new Beach(request.body);
      const result: BeachModel = await beach.save();

      return response.status(201).send(result);
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