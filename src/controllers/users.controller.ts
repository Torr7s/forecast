import { Request, Response } from 'express';
import { Controller, Post } from '@overnightjs/core';

import { BaseController } from './base.controller';

import { User, UserModel } from '@src/shared/infra/mongo/models/user.model';

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
      return this.createErrorResponse(response, {
        code: 401,
        message: 'User not found!',
        description: 'Try verifying your email address.'
      });
    }

    const validPassword: boolean = await AuthProvider.comparePasswords(password, user.password);

    if (!validPassword) {
      return this.createErrorResponse(response, {
        code: 401,
        message: 'Invalid password given!'
      });
    };

    const token: string = AuthProvider.signToken(user.id);

    return response
      .status(200)
      .send({
        token
      });
  }
}