import { assert } from "chai";
import { assertSubset } from "../test-utils.js";
import { categoryService } from "./category-service.js";
import { maggie, museum, maggieCredentials, testCategories, testPlacemarks, park } from "../fixtures.js";

suite("Placemark API tests", () => {
  let user = null;
  let category = null;

  setup(async () => {
    categoryService.clearAuth();
    user = await categoryService.createUser(maggie);
    await categoryService.authenticate(maggieCredentials);
    await categoryService.deleteAllCategories();
    await categoryService.deleteAllPlacemarks();
    await categoryService.deleteAllUsers();
    user = await categoryService.createUser(maggie);
    await categoryService.authenticate(maggieCredentials);
    museum.userid = user._id;
    category = await categoryService.createCategory(museum);
  });

  teardown(async () => { });

  test("create placemark", async () => {
    const returnedPlacemark = await categoryService.createPlacemark(category._id, park);
    assertSubset(park, returnedPlacemark);
  });

  test("create Multiple placemarks", async () => {
    for (let i = 0; i < testPlacemarks.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await categoryService.createPlacemark(category._id, testPlacemarks[i]);
    }
    const returnedPlacemarks = await categoryService.getAllPlacemarks();
    assert.equal(returnedPlacemarks.length, testPlacemarks.length);
    for (let i = 0; i < returnedPlacemarks.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const placemark = await categoryService.getPlacemark(returnedPlacemarks[i]._id);
      assertSubset(placemark, returnedPlacemarks[i]);
    }
  });

  test("Delete PlacemarkApi", async () => {
    for (let i = 0; i < testPlacemarks.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await categoryService.createPlacemark(category._id, testPlacemarks[i]);
    }
    let returnedPlacemarks = await categoryService.getAllPlacemarks();
    assert.equal(returnedPlacemarks.length, testPlacemarks.length);
    for (let i = 0; i < returnedPlacemarks.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const placemark = await categoryService.deletePlacemark(returnedPlacemarks[i]._id);
    }
    returnedPlacemarks = await categoryService.getAllPlacemarks();
    assert.equal(returnedPlacemarks.length, 0);
  });

  test("denormalised category", async () => {
    for (let i = 0; i < testPlacemarks.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await categoryService.createPlacemark(category._id, testPlacemarks[i]);
    }
    const returnedCategory = await categoryService.getCategory(category._id);
    assert.equal(returnedCategory.placemarks.length, testPlacemarks.length);
    for (let i = 0; i < testPlacemarks.length; i += 1) {
      assertSubset(testPlacemarks[i], returnedCategory.placemarks[i]);
    }
  });
});
