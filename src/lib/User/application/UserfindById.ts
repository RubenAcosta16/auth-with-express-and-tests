import { UserId } from "../domain/Props/UserId";
import { User } from "../domain/User";
import { UserRepository } from "../domain/UserRepository";
import { UserNotFoundError } from "../domain/errors";

export class UserFindById {
  constructor(private repository: UserRepository) {}

  async run(id: string): Promise<User> {
    const user = await this.repository.findById(new UserId(id));

    if (!user) throw new UserNotFoundError("User Not Found");

    return user;
  }
}
