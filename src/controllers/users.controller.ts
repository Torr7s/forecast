import { Request, Response } from 'express';
import { Controller, Post } from '@overnightjs/core';

import { BaseController } from './base.controller';

import { User, UserModel } from '@src/shared/database/models/user.model';

import { AuthProvider } from '@src/shared/container/providers/auth/auth.provider';

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

  @Post('auth')
  public async authenticate(request: Request, response: Response): Promise<Response | void> {
    const { email, password } = request.body;

    const user: UserModel = await User.findOne({ email });

    if (!user) {
      return response
        .status(401)
        .send({
          code: 401,
          error: 'User not found!'
        });
    }

    const validPassword: boolean = await AuthProvider.comparePasswords(password, user.password);

    if (!validPassword) {
      return response
        .status(401)
        .send({
          code: 401,
          error: 'Invalid password given!'
        });
    };

    const token: string = AuthProvider.signToken(user.toJSON());

    return response
      .status(200)
      .send({
        token
      })
  }
}