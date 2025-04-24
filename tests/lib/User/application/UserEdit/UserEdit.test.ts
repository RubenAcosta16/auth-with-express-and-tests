import { UserUpdate } from "../../../../../src/lib/User/application/UserUpdate";
import { InMemoryUserRepository } from "../../__mocks__/InMemoryUserRepository";
import { UserStub } from "../../domain/UserStub";

describe("UserEdit should", () => {
  test("edit a user", async () => {
    const user = UserStub.create();

    const repository = new InMemoryUserRepository([user]);
    const editUseCase = new UserUpdate(repository);
 
    const usersBefore = await repository.findAll();

    expect(usersBefore).toHaveLength(1);


    await editUseCase.run(
      user.id.value,
      user.name.value,
      user.email.value,
      user.password.value,
      user.role.value
    );

    const usersAfter = await repository.findAll();

    expect(usersAfter).toHaveLength(1);

    const editedUser = usersAfter[0];

    expect(editedUser.id.value).toBe(user.id.value);
    expect(editedUser.name.value).toBe(user.name.value);
    expect(editedUser.email.value).toBe(user.email.value);

    // delete user
  });
});
