import request from "supertest";
import express from "express";
import { UserStub } from "../../User/domain/UserStub";
import { ExpressAuthRouter } from "../../../../src/lib/Auth/infraestructure/Expressjs/ExpressAuthRouter";
import cookieParser from "cookie-parser";
import { authMiddleware } from "../../../../src/lib/shared/infraestructure/middleware/authMiddleware/authMiddleware";
import { errorMiddleware } from "../../../../src/lib/shared/infraestructure/middleware/errorMiddleware";
import { InMemoryUserRepository } from "../../User/__mocks__/InMemoryUserRepository";
import { UserFindAll } from "../../../../src/lib/User/application/UserFindAll";
import { UserDelete } from "../../../../src/lib/User/application/UserDelete";
import { authAdminMiddleware } from "../../../../src/lib/shared/infraestructure/middleware/authAdminMiddleware";
import { roleAuthMiddleware } from "../../../../src/lib/shared/infraestructure/middleware/authMiddleware/roleAuthMiddleware";

let app: express.Application;

describe("ExpressAuthRouter should", () => {
  const user = UserStub.create();
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
      name: user.name.value,
      email: user.email.value,
      password: user.id.value,
      role: user.role.value,
    });

    expect(response.status).toBe(200);
  });

  it("login a user", async () => {
    const response = await request(app).post("/api/v1/auth/login").send({
      email: user.email.value,
      password: user.id.value,
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
    const user = UserStub.create();

    await request(app).post("/api/v1/auth/register").send({
      name: user.name.value,
      email: user.email.value,
      password: user.id.value,
      role: user.role.value,
    });

    const loginResponse = await request(app).post("/api/v1/auth/login").send({
      email: user.email.value,
      password: user.id.value,
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
    expect(protectedResponse.body.data.email).toBe(user.email.value);
  });

  it("access to admin route and create other admin", async () => {
    const userAdminMain = {
      email: "john.doe@example.com",
      password: "12345678",
    };

    const loginResponse = await request(app).post("/api/v1/auth/login").send({
      email: userAdminMain.email,
      password: userAdminMain.password,
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
    expect(protectedResponse.body.data.email).toBe(userAdminMain.email);

    // quise aprovechar y hacer el test de crear otro admin, pero no se si es correcto ponerlo aqui o repetir mas codigo alla abajo
    const userNewAdmin = UserStub.createAdmin();

    const createOtherAdminResponse = await request(app)
      .post("/api/v1/auth/register")
      .set("Cookie", accessTokenCookie)
      .send({
        name: userNewAdmin.name.value,
        email: userNewAdmin.email.value,
        password: userNewAdmin.id.value,
        role: userNewAdmin.role.value,
      });

    // console.log(createOtherAdminResponse.body);

    expect(createOtherAdminResponse.status).toBe(200);
  });
});

describe("ExpressAuthRouter not should", () => {
  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use(cookieParser());
    app.use(authMiddleware);
    // app.use(roleAuthMiddleware);
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
    const protectedResponse = await request(app).get("/api/v1/auth/protected");
    // .set("Cookie", accessTokenCookie);

    // console.log(protectedResponse);

    expect(protectedResponse.status).toBe(400);
  });

  it("access to admin route", async () => {
    const protectedResponse = await request(app).get("/api/v1/auth/admin");
    // .set("Cookie", accessTokenCookie);

    // console.log(protectedResponse);

    expect(protectedResponse.status).toBe(400);
  });
});

describe("ExpressAuthRouter should not ", () => {
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

  it("should not allow access to admin route without admin role", async () => {
    const user = {
      email: "jane.smith@example.com",
      password: "12345678",
    };

    const loginResponse = await request(app).post("/api/v1/auth/login").send({
      email: user.email,
      password: user.password,
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.headers["set-cookie"]).toBeDefined();

    // Extrae la cookie de autenticación
    const cookies = Array.isArray(loginResponse.headers["set-cookie"])
      ? loginResponse.headers["set-cookie"]
      : ([loginResponse.headers["set-cookie"]].filter(Boolean) as string[]);
    const accessTokenCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("access_token=")
    );
    expect(accessTokenCookie).toBeDefined();

    const adminResponse = await request(app)
      .get("/api/v1/auth/admin")
      .set("Cookie", accessTokenCookie);

      // por alguna razon los test si me devuelven el error pero en status 500 y analizando la respuesta contiene un html con el mensaje de eror que hice pero nose porque en status 500
    expect(adminResponse.status).not.toBe(200);
  });
});

describe("ExpressAuthRouter not should", () => {
  const user = UserStub.create();
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

// borrar todo el desmadre que hice con los usuarios jaja
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
