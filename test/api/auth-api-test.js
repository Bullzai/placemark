import { assert } from "chai";
import { categoryService } from "./category-service.js";
import { decodeToken } from "../../src/api/jwt-utils.js";
import { maggie, maggieCredentials } from "../fixtures.js";

suite("Authentication API tests", async () => {
  setup(async () => {
    categoryService.clearAuth();
    await categoryService.createUser(maggie);
    await categoryService.authenticate(maggieCredentials);
    await categoryService.deleteAllUsers();
  });

  test("authenticate", async () => {
    const returnedUser = await categoryService.createUser(maggie);
    const response = await categoryService.authenticate(maggieCredentials);
    assert(response.success);
    assert.isDefined(response.token);
  });

  test("verify Token", async () => {
    const returnedUser = await categoryService.createUser(maggie);
    const response = await categoryService.authenticate(maggieCredentials);

    const userInfo = decodeToken(response.token);
    assert.equal(userInfo.email, returnedUser.email);
    assert.equal(userInfo.userId, returnedUser._id);
  });

  test("check Unauthorized", async () => {
    categoryService.clearAuth();
    try {
      await categoryService.deleteAllUsers();
      assert.fail("Route not protected");
    } catch (error) {
      assert.equal(error.response.data.statusCode, 401);
    }
  });
});
