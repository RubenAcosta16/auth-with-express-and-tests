import { UserError } from "../../domain/errors";

export class UserPassword {
  value: string;

  constructor(value: string) {
    this.value = value;
    this.isValid();
  }

  private isValid() {
    if (!this.value) {
      throw new UserError("Password is not valid");
    }
    if (this.value.length < 8) {
      throw new UserError("Password must have at least 8 characters");
    }
  }
}
