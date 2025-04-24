import { AuthLogin } from "../../../../src/lib/Auth/application/AuthLogin";
import { AuthRepository } from "../../../../src/lib/Auth/domain/AuthRepository";
import { UserRepository } from "../../../../src/lib/User/domain/UserRepository";
import { AuthInvalidCredentialsError } from "../../../../src/lib/Auth/domain/errors";
import { UserNotFoundError } from "../../../../src/lib/User/domain/errors";
import { User } from "../../../../src/lib/User/domain/User";
import { UserId } from "../../../../src/lib/User/domain/Props/UserId";
import { UserName } from "../../../../src/lib/User/domain/Props/UserName";
import { UserEmail } from "../../../../src/lib/User/domain/Props/UserEmail";
import { UserPassword } from "../../../../src/lib/User/domain/Props/UserPassword";
import { UserRole } from "../../../../src/lib/User/domain/Props/UserRole";

describe("AuthLogin", () => {
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockAuthRepository: jest.Mocked<AuthRepository>;
  let authLogin: AuthLogin;

  const mockUser = new User(
    new UserId("123"),
    new UserName("John Doe"),
    new UserEmail("john.doe@example.com"),
    new UserPassword("hashed-password"),
    new UserRole("User")
  );

  beforeEach(() => {
    mockUserRepository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
    };

    mockAuthRepository = {
      hashPassword: jest.fn(),
      verifyPassword: jest.fn(),
      generateToken: jest.fn(),
      generateId: jest.fn(),
    };

    authLogin = new AuthLogin(mockUserRepository, mockAuthRepository);
  });

  it("should return a token for valid credentials", async () => {
    mockUserRepository.findByEmail.mockResolvedValue(mockUser);
    mockAuthRepository.verifyPassword.mockResolvedValue(true);
    mockAuthRepository.generateToken.mockResolvedValue("mocked-token");

    const result = await authLogin.run(mockUser.email.value, "valid-password");

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
      new UserEmail(mockUser.email.value)
    );
    expect(mockAuthRepository.verifyPassword).toHaveBeenCalledWith(
      "valid-password",
      mockUser.password.value
    );
    expect(mockAuthRepository.generateToken).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual({ token: "mocked-token" });
  });

  it("should throw a UserNotFoundError if the user is not found", async () => {
    mockUserRepository.findByEmail.mockRejectedValue(
      new UserNotFoundError("User Not Found")
    );

    await expect(
      authLogin.run("nonexistent@example.com", "password")
    ).rejects.toThrow(UserNotFoundError);

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
      new UserEmail("nonexistent@example.com")
    );
    expect(mockAuthRepository.verifyPassword).not.toHaveBeenCalled();
    expect(mockAuthRepository.generateToken).not.toHaveBeenCalled();
  });

  it("should throw an AuthInvalidCredentialsError if the password is invalid", async () => {
    mockUserRepository.findByEmail.mockResolvedValue(mockUser);
    mockAuthRepository.verifyPassword.mockResolvedValue(false);

    await expect(
      authLogin.run(mockUser.email.value, "invalid-password")
    ).rejects.toThrow(AuthInvalidCredentialsError);

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
      new UserEmail(mockUser.email.value)
    );
    expect(mockAuthRepository.verifyPassword).toHaveBeenCalledWith(
      "invalid-password",
      mockUser.password.value
    );
    expect(mockAuthRepository.generateToken).not.toHaveBeenCalled();
  });
});