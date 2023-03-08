import Boom from "@hapi/boom";
import { db } from "../models/db.js";

export const categoryApi = {
  find: {
    auth: false,
    handler: async function (request, h) {
    },
  },

  findOne: {
    auth: false,
    async handler(request) {
    },
  },

  create: {
    auth: false,
    handler: async function (request, h) {
    },
  },

  deleteOne: {
    auth: false,
    handler: async function (request, h) {
    },
  },

  deleteAll: {
    auth: false,
    handler: async function (request, h) {
    },
  },
};
