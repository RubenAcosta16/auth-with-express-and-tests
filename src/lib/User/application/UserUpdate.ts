import { UserEmail } from "../domain/Props/UserEmail";
import { UserId } from "../domain/Props/UserId";
import { UserName } from "../domain/Props/UserName";
import { UserPassword } from "../domain/Props/UserPassword";
import { UserRole } from "../domain/Props/UserRole";
import { User } from "../domain/User";
import { UserRepository } from "../domain/UserRepository";
import { UserError, UserNotFoundError } from "../domain/errors";
// import { roles } from "../UserTypes";

export class UserUpdate {
  constructor(private repository: UserRepository) {}

  async run(
    id: string,
    name: string,
    email: string,
    password: string,
    role: string 
  ): Promise<void> {
    // console.log(id);
    const foundUser = await this.repository.findById(new UserId(id));
    if (!foundUser) throw new UserNotFoundError("User Not Found");

    const UserFoundEmail = await this.repository.findByEmail(
      new UserEmail(email)
    );

    // console.log(UserFoundEmail?.email.value);
    // console.log(email);
    // console.log(id);

    if (UserFoundEmail && UserFoundEmail.id.value !== id) {
      throw new UserError("Email already exists");
    }

    const user = new User(
      new UserId(id),
      new UserName(name),
      new UserEmail(email),
      new UserPassword(password),
      new UserRole(role)
    );

    return await this.repository.update(user);
  }
}
