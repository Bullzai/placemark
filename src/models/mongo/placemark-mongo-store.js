import { Placemark } from "./placemark.js";
import { imageStore } from "../image-store.js";

export const placemarkMongoStore = {
  async getAllPlacemarks() {
    const placemarks = await Placemark.find().lean();
    return placemarks;
  },

  async addPlacemark(categoryId, placemark) {
    placemark.categoryid = categoryId;
    const newPlacemark = new Placemark(placemark);
    const placemarkObj = await newPlacemark.save();
    return this.getPlacemarkById(placemarkObj._id);
  },

  async getPlacemarksByCategoryId(id) {
    const placemarks = await Placemark.find({ categoryid: id }).lean();
    return placemarks;
  },

  async getPlacemarkById(id) {
    if (id) {
      const placemark = await Placemark.findOne({ _id: id }).lean();
      return placemark;
    }
    return null;
  },

  async deletePlacemark(id) {
    try {
      try {
        const placemark = await Placemark.findOne({ _id: id }).lean();
        if (placemark.image !== "undefined") {
          const url = placemark.image;
          // Public id is just the name of the file stored in cloudinary, extract the name using regEx
          const publicId = url.match(/\/([^/]+)\.\w{3,4}(?=\.|$)/)[1];
          await imageStore.deleteImage(publicId);
        }
      } catch (error) {
        console.log("did not have an image");
      }
      await Placemark.deleteOne({ _id: id });
    } catch (error) {
      console.log("bad id");
    }
  },

  async deleteAllPlacemarks() {
    await Placemark.deleteMany({});
  },

  async updatePlacemark(placemark, updatedPlacemark) {
    const placemarkObject = await Placemark.findOne({ _id: placemark._id });
    placemarkObject.title = updatedPlacemark.title;
    placemarkObject.description = updatedPlacemark.description;
    placemarkObject.latitude = updatedPlacemark.latitude;
    placemarkObject.longitude = updatedPlacemark.longitude;
    await placemarkObject.save();
  },

  async updatePlacemarkImg(updatedPlacemark) {
    const placemark = await Placemark.findOne({ _id: updatedPlacemark._id });
    placemark.image = updatedPlacemark.image;
    await placemark.save();
  },

  async deletePlacemarkImg(updatedPlacemark) {
    const placemark = await Placemark.findOne({ _id: updatedPlacemark._id });
    await Placemark.updateOne({ _id: placemark._id }, { $unset: { image: "" } });
  },
};
