import { assert } from "chai";
import { categoryService } from "./category-service.js";
import { assertSubset } from "../test-utils.js";
import { maggie, maggieCredentials, museum, testCategories } from "../fixtures.js";

suite("Category API tests", () => {

  let user = null;

  setup(async () => {
    categoryService.clearAuth();
    user = await categoryService.createUser(maggie);
    await categoryService.authenticate(maggieCredentials);
    await categoryService.deleteAllCategories();
    await categoryService.deleteAllUsers();
    user = await categoryService.createUser(maggie);
    await categoryService.authenticate(maggieCredentials);
    museum.userid = user._id;
  });

  teardown(async () => { });

  test("create category", async () => {
    const returnedCategory = await categoryService.createCategory(museum);
    assert.isNotNull(returnedCategory);
    assertSubset(museum, returnedCategory);
  });

  test("delete a category", async () => {
    const category = await categoryService.createCategory(museum);
    const response = await categoryService.deleteCategory(category._id);
    assert.equal(response.status, 204);
    try {
      const returnedCategory = await categoryService.getCategory(category.id);
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No Category with this id", "Incorrect Response Message");
    }
  });

  test("create multiple categories", async () => {
    for (let i = 0; i < testCategories.length; i += 1) {
      testCategories[i].userid = user._id;
      // eslint-disable-next-line no-await-in-loop
      await categoryService.createCategory(testCategories[i]);
    }
    let returnedLists = await categoryService.getAllCategories();
    assert.equal(returnedLists.length, testCategories.length);
    await categoryService.deleteAllCategories();
    returnedLists = await categoryService.getAllCategories();
    assert.equal(returnedLists.length, 0);
  });

  test("remove non-existant category", async () => {
    try {
      const response = await categoryService.deleteCategory("not an id");
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No Category with this id", "Incorrect Response Message");
    }
  });
});
