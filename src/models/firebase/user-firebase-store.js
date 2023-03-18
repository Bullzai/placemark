import { ref, push, remove, update, child, orderByChild, equalTo, get, set } from "firebase/database";
import database from "./firebase-config.js";

const usersRef = ref(database, "users");

export const userFirebaseStore = {
  async getAllUsers() {
    const snapshot = await get(usersRef);
    return snapshot.val();
  },

  async getUserById(id) {
    const snapshot = await get(child(usersRef, id));
    return snapshot.val();
  },

  async addUser(user) {
    const newUserRef = push(usersRef);
    await set(newUserRef, user);
    return { id: newUserRef.key, ...user };
  },

  async getUserByEmail(email) {
    const snapshot = await get(orderByChild(usersRef, "email").equalTo(email));
    const result = snapshot.val();
    return result ? Object.values(result)[0] : null;
  },

  async deleteUserById(id) {
    await remove(child(usersRef, id));
  },

  async deleteAll() {
    await remove(usersRef);
  },

  async editUser(user) {
    const userId = user._id;
    delete user._id;
    await update(child(usersRef, userId), user);
  },
};
