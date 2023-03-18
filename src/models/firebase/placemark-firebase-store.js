import { getDatabase, ref, set, push, get, child, update, remove, query, orderByChild, equalTo } from "firebase/database";
import database from "./firebase-config.js";
import { imageStore } from "../image-store.js";

const placemarksRef = ref(database, "placemarks");

export const placemarkFirebaseStore = {
  async getAllPlacemarks() {
    const snapshot = await get(placemarksRef);
    const placemarks = [];
    snapshot.forEach((childSnapshot) => {
      const childKey = childSnapshot.key;
      const childData = childSnapshot.val();
      placemarks.push({ _id: childKey, ...childData });
    });
    return placemarks;
  },

  async addPlacemark(categoryId, placemark) {
    placemark.categoryid = categoryId;
    const newPlacemarkRef = push(placemarksRef);
    await set(newPlacemarkRef, placemark);
    const newPlacemarkSnapshot = await get(newPlacemarkRef);
    const newPlacemark = newPlacemarkSnapshot.val();
    return { _id: newPlacemarkRef.key, ...newPlacemark };
  },

  async getPlacemarksByCategoryId(id) {
    const categoryIdQuery = query(placemarksRef, orderByChild("categoryid"), equalTo(id));
    const snapshot = await get(categoryIdQuery);
    const placemarks = [];
    snapshot.forEach((childSnapshot) => {
      const childKey = childSnapshot.key;
      const childData = childSnapshot.val();
      placemarks.push({ _id: childKey, ...childData });
    });
    return placemarks;
  },

  async getPlacemarkById(id) {
    const placemarkRef = child(placemarksRef, id);
    const snapshot = await get(placemarkRef);
    if (snapshot.exists()) {
      return { _id: id, ...snapshot.val() };
    }
    return null;
  },

  async deletePlacemark(id) {
    try {
      const placemarkRef = child(placemarksRef, id);
      const snapshot = await get(placemarkRef);
      if (snapshot.exists()) {
        const placemark = snapshot.val();
        if (placemark.image !== "undefined") {
          const url = placemark.image;
          // Extract the public ID from the URL
          const publicId = url.match(/\/([^/]+)\.\w{3,4}(?=\.|$)/)[1];
          await imageStore.deleteImage(publicId);
        }
      }
    } catch (error) {
      console.log("did not have an image");
    }
    const placemarkRef = child(placemarksRef, id);
    await remove(placemarkRef);
  },

  async deleteAllPlacemarks() {
    await set(placemarksRef, {});
  },

  async updatePlacemark(placemark, updatedPlacemark) {
    const placemarkRef = child(placemarksRef, placemark._id);
    await update(placemarkRef, updatedPlacemark);
  },

  async updatePlacemarkImg(updatedPlacemark) {
    const placemarkRef = child(placemarksRef, updatedPlacemark._id);
    await update(placemarkRef, { image: updatedPlacemark.image });
  },

  async deletePlacemarkImg(updatedPlacemark) {
    const placemarkRef = child(placemarksRef, updatedPlacemark._id);
    await update(placemarkRef, { image: null });
  },

}