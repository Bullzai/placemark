// import { ref, push, remove, update, child, orderByChild, equalTo, get, set } from "firebase/database";
import { getDatabase, ref, set, push, get, child, update, remove, query, orderByChild, equalTo } from "firebase/database";
import { Query } from "mongoose";
import database from "./firebase-config.js";

const usersRef = ref(database, "users");

// function writeUserData(name, email) {
//   // const db = getDatabase();ref(database, "users/" + userId)
//   const newUserRef = push(usersRef);
//   set(newUserRef, {
//     username: name,
//     email: email,
//   });
// }

// writeUserData("vid", "vava@gmail.com");

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
    const userRef = child(usersRef, id);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      return { _id: id, ...snapshot.val() };
    }
    return null;
  },

  async getUserByEmail(email) {
    const emailQuery = query(usersRef, orderByChild("email"), equalTo(email));

    // Snippet from Firebase docs that actually will tell you what rule you need to add.
    // get(query(usersRef, orderByChild("email"), equalTo(email))).then((snapshot) => {
    //   if (snapshot.exists()) {
    //     console.log(snapshot.val());
    //   } else {
    //     console.log("No data available");
    //   }
    // }).catch((error) => {
    //   console.error(error);
    // });

    const snapshot = await get(emailQuery);

    if (snapshot.exists()) {
      const userKey = Object.keys(snapshot.val())[0];
      const userData = snapshot.val()[userKey];
      return { _id: userKey, ...userData };
    }
    return null;
  },

  async addUser(user) {
    const obj = JSON.parse(JSON.stringify(user));
    const newUserRef = push(usersRef);
    await set(newUserRef, obj);
    const newUserSnapshot = await get(newUserRef);
    const newUser = newUserSnapshot.val();
    return { _id: newUserRef.key, ...newUser };
  },

  async editUser(user) {
    const userRef = child(usersRef, user._id);
    await update(userRef, user);
  },

  async deleteUserById(id) {
    const userRef = child(usersRef, id);
    await remove(userRef);
  },
};