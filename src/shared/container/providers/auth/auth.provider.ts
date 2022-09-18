import bcrypt from 'bcrypt';

export class AuthProvider {
  public static async hashPassword(password: string, salt: number = 9): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  public static async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}