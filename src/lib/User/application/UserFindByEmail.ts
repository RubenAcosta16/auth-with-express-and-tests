import { UserEmail } from "../domain/Props/UserEmail";
import { User } from "../domain/User";
import { UserRepository } from "../domain/UserRepository";
import { UserNotFoundError } from "../domain/errors";

export class UserFindByEmail {
  constructor(private repository: UserRepository) {}

  async run(email: string): Promise<User> {
    const user = await this.repository.findByEmail(new UserEmail(email));

    if (!user) throw new UserNotFoundError("User Not Found");

    return user;
  }
}
