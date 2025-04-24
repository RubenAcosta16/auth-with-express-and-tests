import { User } from 'src/lib/User/domain/User';

export interface AuthRepository {
  generateToken(user: User): Promise<string>;
  verifyPassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
  hashPassword(password: string): Promise<string>;
  generateId(): string;
}
