export class AuthInvalidCredentialsError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, AuthInvalidCredentialsError.prototype);
  }
}

// import { createErrorFactory } from "../../shared/errorFactory";

// export const AuthInvalidCredentialsError = createErrorFactory("AuthInvalidCredentialsError");

