import { UserEmail } from "../../../../src/lib/User/domain/Props/UserEmail";
import { UserId } from "../../../../src/lib/User/domain/Props/UserId";
import { UserName } from "../../../../src/lib/User/domain/Props/UserName";
import { UserPassword } from "../../../../src/lib/User/domain/Props/UserPassword";
import { UserRole } from "../../../../src/lib/User/domain/Props/UserRole";
import { User } from "../../../../src/lib/User/domain/User";
import {
  randEmail,
  randFirstName,
  randUuid,
  // randPassword,
} from "@ngneat/falso";

export class UserStub {
  static create(): User {
    return this.returnUser("User");
  }

  static createAdmin(): User {
    return this.returnUser("Admin");
  }

  private static returnUser(role: string): User {
    return new User(
      new UserId(randUuid()),
      new UserName(this.createSafeName()),
      new UserEmail(randEmail()),
      new UserPassword("12345678"),
      new UserRole(role)
    );
  }

  private static createSafeName(): string {
    const name = randFirstName();
    if (name.length < 3) return this.createSafeName();
    return name;
  }
}
