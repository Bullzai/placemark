import { getDatabase, ref, set, push, get, child, update, remove, query, orderByChild, equalTo } from "firebase/database";
import database from "./firebase-config.js";
import { placemarkFirebaseStore } from "./placemark-firebase-store.js"; // Make sure to create this file, see below

const categoriesRef = ref(database, "categories");

export const categoryFirebaseStore = {
  async getAllCategories() {
    const snapshot = await get(categoriesRef);
    const categories = [];
    snapshot.forEach((childSnapshot) => {
      const childKey = childSnapshot.key;
      const childData = childSnapshot.val();
      categories.push({ _id: childKey, ...childData });
    });
    return categories;
  },

  async addCategory(category) {
    // category.userid = userid;
    const newCategoryRef = push(categoriesRef);
    await set(newCategoryRef, category);
    const newCategorySnapshot = await get(newCategoryRef);
    const newCategory = newCategorySnapshot.val();
    return { _id: newCategoryRef.key, ...newCategory };
  },

  async getCategoryById(id) {
    const categoryRef = child(categoriesRef, id);
    const snapshot = await get(categoryRef);
    if (snapshot.exists()) {
      const finalCategoryList = snapshot.val();
      finalCategoryList.placemarks = await placemarkFirebaseStore.getPlacemarksByCategoryId(id);
      return { _id: id, ...finalCategoryList };
    }
    return null;
  },

  async getUserCategories(userid) {
    const userIdQuery = query(categoriesRef, orderByChild("userid"), equalTo(userid));
    const snapshot = await get(userIdQuery);
    const categories = [];
    snapshot.forEach((childSnapshot) => {
      const childKey = childSnapshot.key;
      const childData = childSnapshot.val();
      categories.push({ _id: childKey, ...childData });
    });
    return categories;
  },

  async deleteCategoryById(id) {
    await remove(child(categoriesRef, id));

    const placemarks = await placemarkFirebaseStore.getPlacemarksByCategoryId(id);
    // eslint-disable-next-line no-restricted-syntax
    for (const placemark of placemarks) {
      // eslint-disable-next-line no-await-in-loop
      await placemarkFirebaseStore.deletePlacemark(placemark._id);
    }
  },

  async deleteAllCategories() {
    await set(categoriesRef, {});
  },
};