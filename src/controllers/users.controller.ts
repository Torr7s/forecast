import { Request, Response } from 'express';
import { Controller, Post } from '@overnightjs/core';

import { BaseController } from './base.controller';

import { User, UserModel } from '@src/shared/database/models/user.model';

@Controller('api/users')
export class UsersController extends BaseController {
  @Post('')
  public async create(request: Request, response: Response): Promise<Response> {
    try {
      const user = new User(request.body);
      const newUser: UserModel = await user.save();
  
      return response.status(201).send(newUser); 
    } catch (error) {
      return this.sendCreateUpdateErrorResponse(response, error);
    }
  }
}