import { UserEmail } from '../domain/Props/UserEmail';
import { UserId } from '../domain/Props/UserId';
import { UserName } from '../domain/Props/UserName';
import { UserPassword } from '../domain/Props/UserPassword';
import { UserRole } from '../domain/Props/UserRole';
import { User } from '../domain/User';
import { UserRepository } from '../domain/UserRepository';
import { UserError } from '../domain/errors';
// import { roles } from '../UserTypes';

export class UserCreate {
  constructor(private repository: UserRepository) {}

  async run(
    id: string,
    name: string,
    email: string,
    password: string,
    role: string,
  ): Promise<void> {
    const FoundEmail = await this.repository.findByEmail(new UserEmail(email));
    if (FoundEmail) throw new UserError('Email already exists');

    const FoundId = await this.repository.findById(new UserId(id));
    if (FoundId) throw new UserError('Id already exists');

    const user = new User(
      new UserId(id),
      new UserName(name),
      new UserEmail(email),
      new UserPassword(password),
      new UserRole(role),
    );

    return await this.repository.create(user);
  }
}
