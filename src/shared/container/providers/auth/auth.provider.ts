import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface JwtPayload { sub: string; }

export class AuthProvider {
  public static async hashPassword(password: string, salt: number = 9): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  public static async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  public static signToken(payload: object): string {
    return jwt.sign(payload, process.env.MD5_HASH_KEY as string, {
      expiresIn: '1d'
    });
  }

  public static decodeToken(token: string): JwtPayload {
    return jwt.verify(token, process.env.MD5_HASH_KEY as string) as JwtPayload;
  }
}