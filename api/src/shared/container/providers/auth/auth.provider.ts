import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from 'config';

const md5HashKey: string = config.get('app.auth.key');

interface JwtPayload { sub: string; }

export class AuthProvider {
  public static async hashPassword(password: string, salt: number = 9): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  public static async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  public static signToken(userId: string): string {
    return jwt.sign({}, md5HashKey, {
      subject: userId,
      expiresIn: '1d'
    });
  }

  public static decodeToken(token: string): JwtPayload {
    return jwt.verify(token, md5HashKey) as JwtPayload;
  }
}