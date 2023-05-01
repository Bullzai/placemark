import { ref, set, push, get, child, update, remove, query, orderByChild, equalTo } from "firebase/database";
import database from "./firebase-config.js";

const usersRef = ref(database, "users");

export const userFirebaseStore = {
  async getAllUsers() {
    const snapshot = await get(usersRef);
    const users = [];
    snapshot.forEach((childSnapshot) => {
      const childKey = childSnapshot.key;
      const childData = childSnapshot.val();
      users.push({ _id: childKey, ...childData });
    });
    return users;
  },

  async getUserById(id) {
    if (id) {
      const userRef = child(usersRef, id);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        return { _id: id, ...snapshot.val() };
      }
      return null;
    }
    return null;
  },

  async addUser(user) {
    // Thanks to https://stackoverflow.com/questions/56298481/how-to-fix-object-null-prototype-title-product
    const fixedUser = JSON.parse(JSON.stringify(user))
    const newUserRef = push(usersRef);
    await set(newUserRef, fixedUser);
    const newUserSnapshot = await get(newUserRef);
    const newUser = newUserSnapshot.val();
    return { _id: newUserRef.key, ...newUser };
  },

  async getUserByEmail(email) {
    const emailQuery = query(usersRef, orderByChild("email"), equalTo(email));
    const snapshot = await get(emailQuery);
    const result = [];
    snapshot.forEach((childSnapshot) => {
      const childKey = childSnapshot.key;
      const childData = childSnapshot.val();
      result.push({ _id: childKey, ...childData });
    });
    // Check if the result array has any elements, if so - return result[0], otherwise return null
    return result.length ? result[0] : null;
  },

  async deleteUserById(id) {
    await remove(child(usersRef, id));
  },

  async deleteAll() {
    await set(usersRef, {});
  },

  async editUser(user) {
    // Thanks to https://stackoverflow.com/questions/56298481/how-to-fix-object-null-prototype-title-product
    const fixedUser = JSON.parse(JSON.stringify(user))
    const userId = fixedUser._id;
    // Don't update the _id.
    delete fixedUser._id;

    // Update the user
    const userRef = child(usersRef, userId);

    await update(userRef, fixedUser);
  },
};