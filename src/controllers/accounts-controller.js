import { UserSpec, UserCredentialsSpec, UserEditSpec, AdminSpec } from "../models/joi-schemas.js";
import { db } from "../models/db.js";

export const accountsController = {
  index: {
    auth: false,
    handler: function (request, h) {
      return h.view("main", { title: "Welcome to Placemark" });
    },
  },
  showSignup: {
    auth: false,
    handler: function (request, h) {
      return h.view("signup-view", { title: "Sign up for Placemark" });
    },
  },
  signup: {
    auth: false,
    validate: {
      payload: UserSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("signup-view", { title: "Sign up error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const user = request.payload;
      await db.userStore.addUser(user);
      return h.redirect("/");
    },
  },
  showLogin: {
    auth: false,
    handler: function (request, h) {
      return h.view("login-view", { title: "Login to Placemark" });
    },
  },
  login: {
    auth: false,
    validate: {
      payload: UserCredentialsSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("login-view", { title: "Log in error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const { email, password } = request.payload;
      const user = await db.userStore.getUserByEmail(email);
      if (!user || user.password !== password) {
        return h.redirect("/");
      }
      request.cookieAuth.set({ id: user._id });
      return h.redirect("/dashboard");
    },
  },
  logout: {
    handler: function (request, h) {
      request.cookieAuth.clear();
      return h.redirect("/");
    },
  },
  showProfile: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const viewData = {
        title: "Profile information",
        user: loggedInUser,
      };
      return h.view("profile", viewData);
    },
  },
  editProfile: {
    validate: {
      payload: UserEditSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("profile", { title: "Invalid values", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const user = request.payload;
      // Iterate over the form and remove fields from the object that are empty
      Object.keys(user).forEach(element => {
        if (user[element] === "") {
          delete user[element];
        }
      });

      user._id = request.auth.credentials._id;
      await db.userStore.editUser(user);
      return h.redirect("/profile");
    },
  },

  adminPanel: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const users = await db.userStore.getAllUsers();
      const placemarks = await db.placemarkStore.getAllPlacemarks();
      const categories = await db.categoryStore.getAllCategories();
      const viewData = {
        title: "Admin Panel",
        user: loggedInUser,
        users: users,
        placemarks: placemarks,
        categories: categories,
      };
      if (loggedInUser.admin) {
        return h.view("admin-view", viewData);
      }
      return h.redirect("/dashboard");
    },
  },

  deleteUser: {
    handler: async function (request, h) {
      await db.userStore.deleteUserById(request.params.id)
      return h.redirect("/admin");
    },
  },

  deleteCategory: {
    handler: async function (request, h) {
      await db.categoryStore.deleteCategoryById(request.params.id)
      return h.redirect("/admin");
    },
  },

  async validate(request, session) {
    const user = await db.userStore.getUserById(session.id);
    if (!user) {
      return { isValid: false };
    }
    return { isValid: true, credentials: user };
  },
};