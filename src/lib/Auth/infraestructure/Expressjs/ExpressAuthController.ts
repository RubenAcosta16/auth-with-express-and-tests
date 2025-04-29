import { NextFunction, Request, Response } from "express";
// import { ServiceContainer } from "../../Shared/infrastructure/ServiceContainer";
// import { UserNotFoundError } from "../domain/UserNotFoundError";
import { ServiceContainer } from "../../../shared/ServiceContainer";
import { AuthInvalidCredentialsError } from "../../domain/errors";
// import { roles } from "../../../User/UserTypes";
import { login, register } from "./ExpressAuthProps";
import { UserRole } from "../../../User/domain/Props/UserRole";
// import { roles } from "../../UserTypes";

export class ExpressAuthController {
  register = async (req: Request, res: Response, next: NextFunction) => {
    let userAuthenticatedRole: UserRole = new UserRole("User");
    if (req.user) {
      userAuthenticatedRole = req.user.role;
    }

    const { name, password, email, role }: register = req.body;

    try {
      await ServiceContainer.auth.register.run(
        name,
        email,
        password,
        role,
        userAuthenticatedRole
      );

      res.status(200).send();
    } catch (error) {
      next(error);
    }
  };

  // registerAdmin = async (req: Request, res: Response, next: NextFunction) => {
  //   const { name, password, email }: register = req.body;

  //   try {
  //     await ServiceContainer.auth.register.run(
  //       name,
  //       email,
  //       password,
  //       roles.Admin
  //     );

  //     res.status(200).send();
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  login = async (req: Request, res: Response, next: NextFunction) => {
    const { password, email }: login = req.body;

    try {
      const token = await ServiceContainer.auth.login.run(email, password);

      res
        .status(200)
        .cookie("access_token", token.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 1000 * 60 * 60,
        })
        .json({
          token: token.token,
        });
    } catch (error) {
      next(error);
    }
  };

  protectedRoute = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AuthInvalidCredentialsError(
          "Access denied: User not authenticated"
        );
      }

      res.status(200).json({
        data: {
          id: req.user.id,
          username: req.user.name,
          email: req.user.email,
          role: req.user.role,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  adminRoute = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AuthInvalidCredentialsError(
          "Access denied: User not authenticated"
        );
      }

      res.status(200).json({
        data: {
          id: req.user.id,
          username: req.user.name,
          email: req.user.email,
          role: req.user.role,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  logout = (req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie("access_token").json({ message: "Logout successful" });
    } catch (error) {
      next(error);
    }
  };
}
