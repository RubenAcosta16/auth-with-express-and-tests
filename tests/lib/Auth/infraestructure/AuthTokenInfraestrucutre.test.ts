import { AuthTokenInfraestrucutre } from "../../../../src/lib/Auth/infraestructure/AuthTokenInfraestrucutre";

import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import { UserStub } from "../../User/domain/UserStub";

jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("AuthTokenInfraestrucutre", () => {
  const authTokenInfra = new AuthTokenInfraestrucutre();

  const mockUser = UserStub.create();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should hash a password", async () => {
    const plainPassword = "password123";
    const hashedPassword = "hashed-password";

    (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

    const result = await authTokenInfra.hashPassword(plainPassword);

    expect(bcrypt.hash).toHaveBeenCalledWith(plainPassword, expect.any(Number));
    expect(result).toBe(hashedPassword);
  });

  it("should generate a unique ID", () => {
    const id = authTokenInfra.generateId();

    expect(id).toBeDefined();
    expect(typeof id).toBe("string");
  });

  it("should generate a JWT token for a user", async () => {
    const token = "mocked-token";

    (jwt.sign as jest.Mock).mockReturnValue(token);

    const result = await authTokenInfra.generateToken(mockUser);

    expect(jwt.sign).toHaveBeenCalledWith(
      {
        id: mockUser.id.value,
        name: mockUser.name.value,
        email: mockUser.email.value,
        role: mockUser.role.value,
      },
      expect.any(String),
      { expiresIn: expect.any(String) }
    );
    expect(result).toBe(token);
  });

  it("should verify a password", async () => {
    const plainPassword = "password123";
    const hashedPassword = "hashed-password";

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await authTokenInfra.verifyPassword(
      plainPassword,
      hashedPassword
    );

    expect(bcrypt.compare).toHaveBeenCalledWith(plainPassword, hashedPassword);
    expect(result).toBe(true);
  });

  it("should fail to verify an incorrect password", async () => {
    const plainPassword = "password123";
    const hashedPassword = "hashed-password";

    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const result = await authTokenInfra.verifyPassword(
      plainPassword,
      hashedPassword
    );

    expect(bcrypt.compare).toHaveBeenCalledWith(plainPassword, hashedPassword);
    expect(result).toBe(false);
  });
});
