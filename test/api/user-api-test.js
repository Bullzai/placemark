import { assert } from "chai";
import { categoryService } from "./category-service.js";
import { assertSubset } from "../test-utils.js";
import { maggie, maggieCredentials, testUsers } from "../fixtures.js";
import { db } from "../../src/models/db.js";

const users = new Array(testUsers.length);

suite("User API tests", () => {
  setup(async () => {
    categoryService.clearAuth();
    await categoryService.createUser(maggie);
    await categoryService.authenticate(maggieCredentials);
    await categoryService.deleteAllUsers();
    for (let i = 0; i < testUsers.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      users[0] = await categoryService.createUser(testUsers[i]);
    }
    await categoryService.createUser(maggie);
    await categoryService.authenticate(maggieCredentials);
  });
  teardown(async () => { });

  test("create a user", async () => {
    const newUser = await categoryService.createUser(maggie);
    assertSubset(maggie, newUser);
    assert.isDefined(newUser._id);
  });

  test("delete all users", async () => {
    let returnedUsers = await categoryService.getAllUsers();
    assert.equal(returnedUsers.length, 4);
    await categoryService.deleteAllUsers();
    await categoryService.createUser(maggie);
    await categoryService.authenticate(maggieCredentials);
    returnedUsers = await categoryService.getAllUsers();
    assert.equal(returnedUsers.length, 1);
  });

  test("get a user", async () => {
    const returnedUser = await categoryService.getUser(users[0]._id);
    assert.deepEqual(users[0], returnedUser);
  });

  test("get a user - bad id", async () => {
    try {
      const returnedUser = await categoryService.getUser("1234");
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No User with this id");
      // assert.equal(error.response.data.statusCode, 503);
    }
  });

  test("get a user - deleted user", async () => {
    await categoryService.deleteAllUsers();
    await categoryService.createUser(maggie);
    await categoryService.authenticate(maggieCredentials);
    try {
      const returnedUser = await categoryService.getUser(users[0]._id);
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No User with this id");
      assert.equal(error.response.data.statusCode, 404);
    }
  });
});