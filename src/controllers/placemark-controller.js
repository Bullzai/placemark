import { PlacemarkSpec } from "../models/joi-schemas.js";
import { db } from "../models/db.js";
import { imageStore } from "../models/image-store.js";

export const placemarkController = {
  index: {
    handler: async function (request, h) {
      const category = await db.categoryStore.getCategoryById(request.params.id);
      const placemark = await db.placemarkStore.getPlacemarkById(request.params.placemarkid);
      const loggedInUser = request.auth.credentials;

      const viewData = {
        title: "Edit Placemark",
        category: category,
        placemark: placemark,
        user: loggedInUser,
      };
      return h.view("placemark-view", viewData);
    },
  },

  update: {
    validate: {
      payload: PlacemarkSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("placemark-view", { title: "Edit placemark error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const placemark = await db.placemarkStore.getPlacemarkById(request.params.placemarkid);
      const newPlacemark = {
        title: request.payload.title,
        description: request.payload.description,
        latitude: request.payload.latitude,
        longitude: request.payload.longitude,
      };
      await db.placemarkStore.updatePlacemark(placemark, newPlacemark);
      return h.redirect(`/category/${request.params.id}`);
    },
  },

  uploadImage: {
    handler: async function (request, h) {
      try {
        const placemark = await db.placemarkStore.getPlacemarkById(request.params.placemarkid);
        const file = request.payload.imagefile;
        if (Object.keys(file).length > 0) {
          const url = await imageStore.uploadImage(request.payload.imagefile);
          placemark.image = url;
          await db.placemarkStore.updatePlacemarkImg(placemark);
        }
        return h.redirect(`/category/${placemark.categoryid}`);
      } catch (err) {
        console.log(err);
        return h.redirect(`/category/${placemark.categoryid}`);
      }
    },
    payload: {
      multipart: true,
      output: "data",
      maxBytes: 209715200,
      parse: true,
    },
  },

  deleteImage: {
    handler: async function (request, h) {
      try {
        const placemark = await db.placemarkStore.getPlacemarkById(request.params.placemarkid);
        const url = placemark.image;
        // Public id is just the name of the file stored in cloudinary, extract the name using regEx
        const publicId = url.match(/\/([^/]+)\.\w{3,4}(?=\.|$)/)[1];
        await imageStore.deleteImage(publicId);
        await db.placemarkStore.deletePlacemarkImg(placemark);
        return h.redirect(`/category/${placemark.categoryid}`);
      } catch (err) {
        console.log(err);
        return h.redirect(`/category/${placemark.categoryid}`);
      }
    },
  }
};
