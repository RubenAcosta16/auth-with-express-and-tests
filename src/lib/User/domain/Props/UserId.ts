import { UserError } from "../../domain/errors";

export class UserId {
  value: string;

  constructor(value: string) {
    this.value = value;
    this.isValid();
  }

  private isValid() {
    if (!this.value) {
      throw new UserError("User id is not valid");
    }
  }
}
