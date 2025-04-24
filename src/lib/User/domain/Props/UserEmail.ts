import { UserError } from "../../domain/errors";

export class UserEmail {
  value: string;

  constructor(value: string) {
    this.value = value;
    this.isValid();
  }

  private isValid() {
    if (!this.value) {
      throw new UserError("User email is not valid");
    }

    if (this.value.length > 255) {
      throw new UserError("User email is too long");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.value)) {
      throw new UserError("User email is not valid");
    }
  }
}
