import { aboutController } from "./controllers/about-controller.js";
import { accountsController } from "./controllers/accounts-controller.js";
import { dashboardController } from "./controllers/dashboard-controller.js";
import { categoryController } from "./controllers/category-controller.js";
import { placemarkController } from "./controllers/placemark-controller.js";

export const webRoutes = [
  { method: "GET", path: "/", config: accountsController.index },
  { method: "GET", path: "/signup", config: accountsController.showSignup },
  { method: "GET", path: "/login", config: accountsController.showLogin },
  { method: "GET", path: "/logout", config: accountsController.logout },
  { method: "POST", path: "/register", config: accountsController.signup },
  { method: "POST", path: "/authenticate", config: accountsController.login },
  { method: "GET", path: "/profile", config: accountsController.showProfile },
  { method: "POST", path: "/profile/editprofile", config: accountsController.editProfile },
  { method: "GET", path: "/admin", config: accountsController.adminPanel },
  { method: "GET", path: "/admin/deleteuser/{id}", config: accountsController.deleteUser },
  { method: "GET", path: "/admin/deletecategory/{id}", config: accountsController.deleteCategory },
  { method: "GET", path: "/admin/deleteplacemark/{id}", config: accountsController.deletePlacemark },

  { method: "GET", path: "/about", config: aboutController.index },

  { method: "GET", path: "/dashboard", config: dashboardController.index },
  { method: "POST", path: "/dashboard/addcategory", config: dashboardController.addCategory },
  { method: "GET", path: "/dashboard/deletecategory/{id}", config: dashboardController.deleteCategory },

  { method: "GET", path: "/category/{id}", config: categoryController.index },
  { method: "POST", path: "/category/{id}/addplacemark", config: categoryController.addPlacemark },
  { method: "GET", path: "/category/{id}/deleteplacemark/{placemarkid}", config: categoryController.deletePlacemark },

  { method: "GET", path: "/category/{id}/editplacemark/{placemarkid}", config: placemarkController.index },
  { method: "POST", path: "/category/{id}/updateplacemark/{placemarkid}", config: placemarkController.update },
  { method: "POST", path: "/category/uploadimage/{placemarkid}", config: placemarkController.uploadImage },
  { method: "GET", path: "/category/deleteimage/{placemarkid}", config: placemarkController.deleteImage },

  { method: "GET", path: "/{param*}", handler: { directory: { path: "./public" } }, options: { auth: false } }
];
