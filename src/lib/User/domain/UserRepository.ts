import { UserEmail } from "./Props/UserEmail";
import { UserId } from "./Props/UserId";
import { User } from "./User";

export interface UserRepository {
  findById(id: UserId): Promise<User | null>;
  findByEmail(email: UserEmail): Promise<User | null>;
  create(user: User): Promise<void>;
  delete(id: UserId): Promise<void>;
  findAll(): Promise<User[]>;
  update(user: User): Promise<void>;
}
