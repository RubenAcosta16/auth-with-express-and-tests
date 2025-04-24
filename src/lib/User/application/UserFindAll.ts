import { User } from "../domain/User";
import { UserRepository } from "../domain/UserRepository";

export class UserFindAll {
  constructor(private repository: UserRepository) {}

  async run(): Promise<User[]> {
    return await this.repository.findAll();
  }
}
