import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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
}