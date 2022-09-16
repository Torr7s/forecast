import { Request, Response } from 'express';
import { Controller, Post } from '@overnightjs/core';

import { User, UserModel } from '@src/shared/database/models/user.model';

@Controller('api/users')
export class UsersController {
  @Post('')
  public async create(request: Request, response: Response): Promise<Response> {
    const user = new User(request.body);
    const newUser: UserModel = await user.save();

    return response.status(201).send(newUser);
  }
}