import { UserId } from "../domain/Props/UserId";
import { UserRepository } from "../domain/UserRepository";
import { UserNotFoundError } from "../domain/errors";

export class UserDelete {
  constructor(private repository: UserRepository) {}

  async run(id: string): Promise<void> {
    const user = await this.repository.findById(new UserId(id));
    if (!user) throw new UserNotFoundError("User Not Found");

    await this.repository.delete(new UserId(id));
  }
}
