import { Request, Response } from 'express';
import { 
  Controller, 
  Get, 
  Middleware, 
  Post 
} from '@overnightjs/core';

import { BaseController } from './base.controller';

import { User } from '@src/shared/infra/mongo/models/user.model';
import { UserRepository, WithId } from '@src/repositories/base.repository';

import { AuthProvider } from '@src/shared/container/providers/auth/auth.provider';
import { AuthMiddleware } from '@src/shared/infra/http/middlewares/auth.middleware';

@Controller('api/users')
export class UsersController extends BaseController {
  constructor(private userRepository: UserRepository) {
    super();
  }

  @Post('')
  public async create(request: Request, response: Response): Promise<Response> {
    try {
      const user: WithId<User> = await this.userRepository.create(request.body);

      return response.status(201).send(user);
    } catch (error) {
      return this.sendCreateUpdateErrorResponse(response, error);
    }
  }

  @Post('auth')
  public async authenticate(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const user: WithId<User> = await this.userRepository.findByEmail(email);
    
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

  @Get('me')
  @Middleware(AuthMiddleware)
  public async me(request: Request, response: Response): Promise<Response> {
    const user: WithId<User> = await this.userRepository.findById(request.userId);

    if (!user) {
      return this.createErrorResponse(response, {
        code: 404,
        message: 'User not found!'
      });
    }

    return response.send({ user });
  }
}