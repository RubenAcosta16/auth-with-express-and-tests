import request from "supertest";
import express from "express";
import { UserStub } from "../../User/domain/UserStub";
import { ExpressAuthRouter } from "../../../../src/lib/Auth/infraestructure/Expressjs/ExpressAuthRouter";
import cookieParser from "cookie-parser";
import { authMiddleware } from "../../../../src/lib/shared/infraestructure/middleware/authMiddleware";
import { errorMiddleware } from "../../../../src/lib/shared/infraestructure/middleware/errorMiddleware";
import { InMemoryUserRepository } from "../../User/__mocks__/InMemoryUserRepository";
import { UserFindAll } from "../../../../src/lib/User/application/UserFindAll";
import { UserDelete } from "../../../../src/lib/User/application/UserDelete";

let app: express.Application;

describe("ExpressAuthRouter should", () => {
  const userAdmin = UserStub.createAdmin();
  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use(cookieParser());
    app.use(
      (
        err: Error,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        errorMiddleware(err, req, res, next);
      }
    );
    app.use("/api/v1/auth", ExpressAuthRouter);
  });

  it("register a user", async () => {
    const response = await request(app).post("/api/v1/auth/register").send({
      name: userAdmin.name.value,
      email: userAdmin.email.value,
      password: userAdmin.id.value,
      role: userAdmin.role.value,
    });

    expect(response.status).toBe(200);
  });

  it("login a user", async () => {
    const response = await request(app).post("/api/v1/auth/login").send({
      email: userAdmin.email.value,
      password: userAdmin.id.value,
    });

    expect(response.status).toBe(200);
    expect(response.body.token).not.toBeNull();

    expect(response.headers["set-cookie"]).toBeDefined();
    const cookies = (response.headers["set-cookie"] || []) as string[];
    const accessTokenCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("access_token=")
    );
    expect(accessTokenCookie).toBeDefined();
  });
});

describe("ExpressAuthRouter should", () => {
  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use(cookieParser());
    app.use(
      (
        err: Error,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        errorMiddleware(err, req, res, next);
      }
    );
    app.use("/api/v1/auth", ExpressAuthRouter);
  });

  it("access to protected route", async () => {
    const userAdmin = UserStub.createAdmin();

    await request(app).post("/api/v1/auth/register").send({
      name: userAdmin.name.value,
      email: userAdmin.email.value,
      password: userAdmin.id.value,
      role: userAdmin.role.value,
    });

    const loginResponse = await request(app).post("/api/v1/auth/login").send({
      email: userAdmin.email.value,
      password: userAdmin.id.value,
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.headers["set-cookie"]).toBeDefined();

    const cookies = Array.isArray(loginResponse.headers["set-cookie"])
      ? loginResponse.headers["set-cookie"]
      : ([loginResponse.headers["set-cookie"]].filter(Boolean) as string[]);
    const accessTokenCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("access_token=")
    );
    expect(accessTokenCookie).toBeDefined();

    const protectedResponse = await request(app)
      .get("/api/v1/auth/protected")
      .set("Cookie", accessTokenCookie);

    expect(protectedResponse.status).toBe(200);
    expect(protectedResponse.body.data).toBeDefined();
    expect(protectedResponse.body.data.email).toBe(userAdmin.email.value);
  });

  it("access to admin route", async () => {
    const userAdmin = {
      email: "john.doe@example.com",
      password: "12345678",
    };

    const loginResponse = await request(app).post("/api/v1/auth/login").send({
      email: userAdmin.email,
      password: userAdmin.password,
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.headers["set-cookie"]).toBeDefined();

    const cookies = Array.isArray(loginResponse.headers["set-cookie"])
      ? loginResponse.headers["set-cookie"]
      : ([loginResponse.headers["set-cookie"]].filter(Boolean) as string[]);
    const accessTokenCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("access_token=")
    );
    expect(accessTokenCookie).toBeDefined();

    const protectedResponse = await request(app)
      .get("/api/v1/auth/admin")
      .set("Cookie", accessTokenCookie);

    expect(protectedResponse.status).toBe(200);
    expect(protectedResponse.body.data).toBeDefined();
    expect(protectedResponse.body.data.email).toBe(userAdmin.email);
  });
});

describe("ExpressAuthRouter not should", () => {
  const user = UserStub.createAdmin();
  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use(cookieParser());
    app.use(authMiddleware);
    app.use(
      (
        err: Error,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        errorMiddleware(err, req, res, next);
      }
    );
    app.use("/api/v1/auth", ExpressAuthRouter);
  });

  it(" register the same user", async () => {
    await request(app).post("/api/v1/auth/register").send({
      name: user.name.value,
      email: user.email.value,
      password: user.id.value,
      role: user.role.value,
    });

    const response2 = await request(app).post("/api/v1/auth/register").send({
      name: user.name.value,
      email: user.email.value,
      password: user.id.value,
      role: user.role.value,
    });

    expect(response2.status).toBe(400);
  });

  it(" register user with bad props", async () => {
    const user = UserStub.createAdmin();

    const response = await request(app).post("/api/v1/auth/register").send({
      name: user.name.value,
      email: "aaaa@c",
      password: user.id.value,
      role: user.role.value,
    });

    const response2 = await request(app).post("/api/v1/auth/register").send({
      name: user.name.value,
      email: user.email.value,
      password: "1234567",
      role: user.role.value,
    });

    const response3 = await request(app).post("/api/v1/auth/register").send({
      name: user.name.value,
      email: user.email.value,
      password: user.password.value,
      role: "6rfgt7hyju",
    });

    expect(response.status).toBe(400);
    expect(response2.status).toBe(400);
    expect(response3.status).toBe(400);
  });
});

describe("UserGetAll should", () => {
  test("return all users", async () => {
    const repository = new InMemoryUserRepository();
    const useCaseGetAll = new UserFindAll(repository);
    const useCaseDelete = new UserDelete(repository);

    const users = await useCaseGetAll.run();
    users.forEach((user) => {
      useCaseDelete.run(user.id.value);
    });

    const postUsers = await useCaseGetAll.run();

    expect(postUsers).toHaveLength(0);
  });
});
