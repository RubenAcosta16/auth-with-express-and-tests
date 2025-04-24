import { UserDelete } from "../../../../../src/lib/User/application/UserDelete";
import { InMemoryUserRepository } from "../../__mocks__/InMemoryUserRepository";
import { UserStub } from "../../domain/UserStub";

describe("UserDelete should", () => {
  test("delete a user", async () => {
    const user = UserStub.create();

    const repository = new InMemoryUserRepository([user]);
    const deleteUseCase = new UserDelete(repository);

    const usersBefore = await repository.findAll();

    expect(usersBefore).toHaveLength(1);

    await deleteUseCase.run(user.id.value);

    const usersAfter = await repository.findAll();

    expect(usersAfter).toHaveLength(0);
  });
});
