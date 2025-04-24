import { AuthRegister } from "../../../../src/lib/Auth/application/AuthRegister";
import { AuthRepository } from "../../../../src/lib/Auth/domain/AuthRepository";
import { UserEmail } from "../../../../src/lib/User/domain/Props/UserEmail";
import { UserId } from "../../../../src/lib/User/domain/Props/UserId";
import { UserName } from "../../../../src/lib/User/domain/Props/UserName";
import { UserPassword } from "../../../../src/lib/User/domain/Props/UserPassword";
import { UserRole } from "../../../../src/lib/User/domain/Props/UserRole";
import { UserRepository } from "../../../../src/lib/User/domain/UserRepository";

describe("AuthRegister", () => {
  let userRepository: UserRepository;
  let authRepository: AuthRepository;
  let authRegister: AuthRegister;

  beforeEach(() => {
    userRepository = {
      create: jest.fn().mockResolvedValue(undefined),
      findByEmail: jest.fn().mockResolvedValue(null),
      findById: jest.fn().mockResolvedValue(null),
    } as unknown as UserRepository;

    authRepository = {
      generateId: jest.fn().mockReturnValue("123"),
      hashPassword: jest.fn().mockResolvedValue("hashedPassword"),
    } as unknown as AuthRepository;

    authRegister = new AuthRegister(userRepository, authRepository);
  });

  it("should create a new user with hashed password", async () => {
    const name = "John Doe";
    const email = "john@example.com";
    const password = "password123";
    const role = "User";

    await authRegister.run(name, email, password, role);

    expect(authRepository.generateId).toHaveBeenCalled();
    expect(authRepository.hashPassword).toHaveBeenCalledWith(password);
    expect(userRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        id: new UserId("123"),
        name: new UserName(name),
        email: new UserEmail(email),
        password: new UserPassword("hashedPassword"),
        role: new UserRole(role),
      })
    );
  });

  it("should throw an error if user creation fails", async () => {
    userRepository.create = jest
      .fn()
      .mockRejectedValue(new Error("User creation failed"));

    await expect(
      authRegister.run("Jane Doe", "jane@example.com", "password123", "User")
    ).rejects.toThrow("User creation failed");
  });

  it("should throw an error if email already exists", async () => {
    userRepository.findByEmail = jest
      .fn()
      .mockResolvedValue(new UserEmail("john@example.com"));

    await expect(
      authRegister.run("Jane Doe", "john@example.com", "password123", "User")
    ).rejects.toThrow("Email already exists");
  });
});
