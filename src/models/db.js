import { userMongoStore } from "./mongo/user-mongo-store.js";
import { categoryMongoStore } from "./mongo/category-mongo-store.js";
import { placemarkMongoStore } from "./mongo/placemark-mongo-store.js";
import { connectMongo } from "./mongo/connect.js";
import { userFirebaseStore } from "./firebase/user-firebase-store.js";
import { categoryFirebaseStore } from "./firebase/category-firebase-store.js";
import { placemarkFirebaseStore } from "./firebase/placemark-firebase-store.js";

export const db = {
  userStore: null,
  categoryStore: null,
  placemarkStore: null,

  // init() {
  //   this.userStore = userMongoStore;
  //   this.categoryStore = categoryMongoStore;
  //   this.placemarkStore = placemarkMongoStore;
  //   connectMongo();
  // }
  init(storeType) {
    switch (storeType) {
      case "firebase":
        this.userStore = userFirebaseStore;
        this.categoryStore = categoryFirebaseStore;
        this.placemarkStore = placemarkFirebaseStore;
        break;
      case "mongo":
        this.userStore = userMongoStore;
        this.categoryStore = categoryMongoStore;
        this.placemarkStore = placemarkMongoStore;
        connectMongo();
        break;
      default:
        this.userStore = userMongoStore;
        this.categoryStore = categoryMongoStore;
        this.placemarkStore = placemarkMongoStore;
        connectMongo();
    }
  }
};
