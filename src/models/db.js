import { userMongoStore } from "./mongo/user-mongo-store.js";
import { categoryMongoStore } from "./mongo/category-mongo-store.js";
import { trackMongoStore } from "./mongo/track-mongo-store.js";
import { connectMongo } from "./mongo/connect.js";

export const db = {
  userStore: null,
  categoryStore: null,
  trackStore: null,

  init(storeType) {
    this.userStore = userMongoStore;
    this.categoryStore = categoryMongoStore;
    this.trackStore = trackMongoStore;
  }
};
