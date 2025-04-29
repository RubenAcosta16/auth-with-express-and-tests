import { AuthRegister } from "../../../../src/lib/Auth/application/AuthRegister";
import { AuthRepository } from "../../../../src/lib/Auth/domain/AuthRepository";
import { UserEmail } from "../../../../src/lib/User/domain/Props/UserEmail";
import { UserId } from "../../../../src/lib/User/domain/Props/UserId";
import { UserName } from "../../../../src/lib/User/domain/Props/UserName";
import { UserPassword } from "../../../../src/lib/User/domain/Props/UserPassword";
import { UserRole } from "../../../../src/lib/User/domain/Props/UserRole";
import { UserRepository } from "../../../../src/lib/User/domain/UserRepository";
import { AuthInvalidCredentialsError } from "../../../../src/lib/Auth/domain/errors";
import { roles } from "../../../../src/lib/User/UserTypes";

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
    const userAuthenticatedRole = new UserRole(roles.Admin);

    await authRegister.run(name, email, password, role, userAuthenticatedRole);

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

    const userAuthenticatedRole = new UserRole(roles.Admin);

    await expect(
      authRegister.run(
        "Jane Doe",
        "jane@example.com",
        "password123",
        "User",
        userAuthenticatedRole
      )
    ).rejects.toThrow("User creation failed");
  });

  it("should throw an error if email already exists", async () => {
    userRepository.findByEmail = jest
      .fn()
      .mockResolvedValue(new UserEmail("john@example.com"));

    const userAuthenticatedRole = new UserRole(roles.Admin);

    await expect(
      authRegister.run( 
        "Jane Doe",
        "john@example.com",
        "password123",
        "User",
        userAuthenticatedRole
      )
    ).rejects.toThrow("Email already exists");
  });

  it("should throw an error if a non-admin tries to create an admin", async () => {
    const name = "Admin User";
    const email = "admin@example.com";
    const password = "password123";
    const role = roles.Admin;
    const userAuthenticatedRole = new UserRole(roles.User); // Usuario no administrador

    await expect(
      authRegister.run(name, email, password, role, userAuthenticatedRole)
    ).rejects.toThrow(AuthInvalidCredentialsError);

    expect(authRepository.generateId).not.toHaveBeenCalled();
    expect(authRepository.hashPassword).not.toHaveBeenCalled();
    expect(userRepository.create).not.toHaveBeenCalled();
  });
});