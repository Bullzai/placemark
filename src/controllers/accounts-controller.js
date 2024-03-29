import bcrypt from "bcrypt";
import { UserSpec, UserCredentialsSpec, UserEditSpec, AdminSpec } from "../models/joi-schemas.js";
import { db } from "../models/db.js";

const saltRounds = 10;  // "cost factor" than controls the time taken to calculate the hash

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
      user.password = await bcrypt.hash(user.password, saltRounds); // hash & salt the password
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
      const passwordsMatch = await bcrypt.compare(password, user.password);
      if (!user || !passwordsMatch) {
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

  deletePlacemark: {
    handler: async function (request, h) {
      await db.placemarkStore.deletePlacemark(request.params.id)
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

  google: {
    auth: "google",
    // eslint-disable-next-line consistent-return
    handler: async function (request, h) {
      if (!request.auth.isAuthenticated) {
        return h.view("signup-view", { title: "Sign up error", errors: "Not logged in..." }).takeover().code(400);
      }
      // Check if the user logged in via Google
      const creds = request.auth.credentials;
      if (creds.provider === "google") {
        // Use the email address to check if the user is already registered
        let user = await db.userStore.getUserByEmail(creds.profile.email);

        // If the user is not registered, create a new user account
        if (!user) {
          user = await db.userStore.addUser({
            firstName: creds.profile.name.given_name,
            lastName: creds.profile.name.family_name,
            email: creds.profile.email,
            // // Set a default password for Google users (leter on we can generate a random one)
            password: "google_password",
          });
        }

        // Log in the user
        request.cookieAuth.set({ id: user._id });
        return h.redirect("/dashboard");
      }
    },
  },

  github: {
    auth: "github",
    // eslint-disable-next-line consistent-return
    handler: async function (request, h) {
      if (!request.auth.isAuthenticated) {
        return h.view("signup-view", { title: "Sign up error", errors: "Not logged in..." }).takeover().code(400);
      }
      // Check if the user logged in via Google
      const creds = request.auth.credentials;
      if (creds.provider === "github") {
        let gitEmail = "";
        // Check if email is public and not null
        if (creds.profile.email != null) {
          gitEmail = creds.profile.email;
        } else {
          gitEmail = `${creds.profile.username}@github`;
        }
        let user = await db.userStore.getUserByEmail(gitEmail);

        // If the user is not registered, create a new user account
        if (!user) {
          user = await db.userStore.addUser({
            firstName: creds.profile.displayName.split(" ")[0],
            lastName: creds.profile.displayName.split(" ")[1],
            email: gitEmail,
            // // Set a default password for Google users (leter on we can generate a random one)
            password: "github_password",
          });
        }

        // Log in the user
        request.cookieAuth.set({ id: user._id });
        return h.redirect("/dashboard");
      }
    },
  },
};