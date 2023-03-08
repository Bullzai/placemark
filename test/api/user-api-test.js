import { assert } from "chai";
import { categoryService } from "./category-service.js";
import { assertSubset } from "../test-utils.js";
import { maggie } from "../fixtures.js";

suite("User API tests", () => {
  setup(async () => {
  });
  teardown(async () => {
  });

  test("create a user", async () => {
    const newUser = await categoryService.createUser(maggie);
    assertSubset(maggie, newUser);
    assert.isDefined(newUser._id);
  });

  test("get a user - fail", async () => {
    try {
      const returnedUser = await categoryService.getUser("1234");
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No User with this id");
    }
  });

  test("get a user - deleted user", async () => {
    await categoryService.deleteAllUsers();
    try {
      const returnedUser = await categoryService.getUser(testUsers[0]._id);
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No User with this id");
    }
  });

  test("get a user - bad id", async () => {
    try {
      const returnedUser = await categoryService.getUser("1234");
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No User with this id");
      assert.equal(error.response.data.statusCode, 503);
    }
  });

  test("get a user - deleted user", async () => {
    await categoryService.deleteAllUsers();
    try {
      const returnedUser = await categoryService.getUser(testUsers[0]._id);
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No User with this id");
      assert.equal(error.response.data.statusCode, 404);
    }
  });

});
