import { UserEmail } from "./Props/UserEmail";
import { UserId } from "./Props/UserId";
import { UserName } from "./Props/UserName";
import { UserPassword } from "./Props/UserPassword";
import { UserRole } from "./Props/UserRole";

export class User {
  id: UserId;
  name: UserName;
  email: UserEmail;
  password: UserPassword;
  role: UserRole;

  constructor(
    id: UserId,
    name: UserName,
    email: UserEmail,
    password: UserPassword,
    role: UserRole
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
  }

  public mapToPrimitives() {
    return {
      id: this.id.value,
      name: this.name.value,
      email: this.email.value,
      role: this.role.value,
      password: this.password.value,
    };
  }

  public mapToPrimitivesNoPassword() {
    return {
      id: this.id.value,
      name: this.name.value,
      email: this.email.value,
      role: this.role.value,
    };
  }
}
