import helmet from "helmet";

const hapiHelmet = {
  name: "hapi-helmet",
  register: async function (server, options) {
    server.ext("onPreResponse", (request, h) => {
      const { req, res } = request.raw;
      helmet(options)(req, res, () => { });
      return h.continue;
    });
  },
};

export default hapiHelmet;