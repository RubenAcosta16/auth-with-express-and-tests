import { AuthLogin } from "../Auth/application/AuthLogin";
import { AuthRegister } from "../Auth/application/AuthRegister";
import { AuthTokenInfraestrucutre } from "../Auth/infraestructure/AuthTokenInfraestrucutre";
import { UserCreate } from "../User/application/UserCreate";
import { UserDelete } from "../User/application/UserDelete";
import { UserFindAll } from "../User/application/UserFindAll";
import { UserFindById } from "../User/application/UserfindById";
import { UserUpdate } from "../User/application/UserUpdate";
import { InMemoryUserRepository } from "../User/infrastructure/db/InMemoryUserRepository";

const userRepository = new InMemoryUserRepository();
const authRepository = new AuthTokenInfraestrucutre();
// const userRepository = new PostgresUserRepository("url");

export const ServiceContainer = {
  user: {
    getAll: new UserFindAll(userRepository),
    getOneById: new UserFindById(userRepository),
    create: new UserCreate(userRepository),
    edit: new UserUpdate(userRepository),
    delete: new UserDelete(userRepository),
  },
  auth: {
    login: new AuthLogin(userRepository, authRepository),
    register: new AuthRegister(userRepository, authRepository),
  },
};
