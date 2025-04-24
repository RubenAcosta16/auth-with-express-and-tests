import { UserError } from "../../domain/errors";

export class UserName {
  value: string;
  constructor(value: string) {
    this.value = value;
    this.isValid();
  }

  private isValid() {
    if (!this.value) {
      throw new UserError("User name is not valid");
    }
    if (this.value.length < 3) {
      throw new UserError("User name must have at least 3 characters");
    }
  }
}
