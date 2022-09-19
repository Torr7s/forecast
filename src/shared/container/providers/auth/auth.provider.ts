import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { UserModel } from '@src/shared/database/models/user.model';

interface JwtPayload { sub: string; }

const md5HashKey: string = process.env.MD5_HASH_KEY;

export class AuthProvider {
  public static async hashPassword(password: string, salt: number = 9): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  public static async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  public static signToken(user: UserModel): string {
    return jwt.sign({}, md5HashKey, {
      subject: user.id,
      expiresIn: '1d'
    });
  }

  public static decodeToken(token: string): JwtPayload {
    return jwt.verify(token, md5HashKey) as JwtPayload;
  }
}