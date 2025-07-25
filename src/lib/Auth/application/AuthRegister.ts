import { AuthRepository } from "../domain/AuthRepository";
import { UserCreate } from "../../User/application/UserCreate";
import { User } from "../../User/domain/User";
import { UserId } from "../../User/domain/Props/UserId";
import { UserName } from "../../User/domain/Props/UserName";
import { UserEmail } from "../../User/domain/Props/UserEmail";
import { UserPassword } from "../../User/domain/Props/UserPassword";
import { UserRole } from "../../User/domain/Props/UserRole";
import { UserRepository } from "../../User/domain/UserRepository";
import { roles } from "../../User/UserTypes";
import { AuthInvalidCredentialsError } from "../domain/errors";
// import { roles } from 'src/lib/User/UserTypes';

export class AuthRegister {
  constructor(
    private userRepository: UserRepository,
    private authRepository: AuthRepository
  ) {}

  async run(
    // id: string,
    name: string,
    email: string,
    password: string,
    role: string,
    userAuthenticatedRole: UserRole
  ): Promise<void> {
    if (userAuthenticatedRole.value !== roles.Admin && role == roles.Admin) {
      throw new AuthInvalidCredentialsError(
        "Only admins can create other admins"
      );
    }

    const userApplication = new UserCreate(this.userRepository);

    const id = this.authRepository.generateId();

    const newUser = new User(
      new UserId(id),
      new UserName(name),
      new UserEmail(email),
      new UserPassword(password),
      new UserRole(role)
    );

    const hashedPassword = await this.authRepository.hashPassword(
      newUser.password.value
    );

    return await userApplication.run(
      newUser.id.value,
      newUser.name.value,
      newUser.email.value,
      hashedPassword,
      newUser.role.value
    );
  }
}
