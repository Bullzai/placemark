import { EventEmitter } from "events";
import { assert } from "chai";
import { categoryService } from "./category-service.js";
import { assertSubset } from "../test-utils.js";
import { maggie, museum, testCategories } from "../fixtures.js";

EventEmitter.setMaxListeners(25);

suite("Category API tests", () => {

  setup(async () => {
  });

  teardown(async () => { });

  test("create category", async () => {
  });

  test("delete a category", async () => {
  });

  test("create multiple categorys", async () => {
  });

  test("remove non-existant category", async () => {
  });
});
