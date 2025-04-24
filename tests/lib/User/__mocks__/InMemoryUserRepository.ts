import { User } from "../../../../src/lib/User/domain/User";
import { UserId } from "../../../../src/lib/User/domain/Props/UserId";
import { UserEmail } from "../../../../src/lib/User/domain/Props/UserEmail";
import { UserRepository } from "../../../../src/lib/User/domain/UserRepository";

export class InMemoryUserRepository implements UserRepository {
  constructor(private users: User[] = []) {}

  async create(user: User): Promise<void> {
    this.users.push(user);
  }

  async findAll(): Promise<User[]> {
    return this.users;
  }

  async findById(id: UserId): Promise<User | null> {
    return this.users.find((user) => user.id.value === id.value) || null;
  }

  async update(user: User): Promise<void> {
    const index = this.users.findIndex((u) => u.id.value === user.id.value);
    if (index !== -1) {
      this.users[index] = user;
    }
  }

  async delete(id: UserId): Promise<void> {
    this.users = this.users.filter((user) => user.id.value !== id.value);
  }

  async findByEmail(email: UserEmail): Promise<User | null> {
    return this.users.find((user) => user.email.value === email.value) || null;
  }
}
