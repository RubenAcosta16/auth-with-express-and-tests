import { UserError } from "../../domain/errors";
// import { roles } from "../../UserTypes";

export class UserRole {
  value: string;

  constructor(value: string) {
    this.value = value;
    this.isValid();
  }

  private isValid() {
    if (!this.value) {
      throw new UserError("Role is not valid");
    }
    if (!(this.value == "User" || this.value == "Admin")) {
      throw new UserError("Invalid role");
    }
  }
}
