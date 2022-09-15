import { Request, Response } from 'express';
import { Controller, Post } from '@overnightjs/core';

@Controller('api/beaches')
export class BeachesController {
  @Post('')
  public async create(request: Request, response: Response): Promise<void> {
    response.status(201).send(request.body);
  }
}