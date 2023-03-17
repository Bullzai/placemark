# Placemark

Placemark is a Node.js application that allows users to sign up, login, and manage their user settings. The application includes core unit tests, an admin account, Swagger API documentation, and integration with MongoDB Cloud Atlas for data storage.

## Prerequisites

Before you begin, you must have the following installed:

- Node.js
- MongoDB Cloud Atlas account
- Git (optional)

## Installation

1. Clone the repository using Git or download the source code as a ZIP file and extract it.
```
git clone https://github.com/<username>/placemark.git
```
2. Install dependencies using npm:
```
npm install
```

3. Create a `.env` file in the root directory of the project and set the following environment variables:
```
cookie_name=<cookie name>
cookie_password=<cookie password>
db=<Mongodb address with user and pass if useing Cloud Atlas>
cloudinary_name=<Cloudinary username>
cloudinary_key=<Cloudinary API key>
cloudinary_secret=<Cloudinary secret>
```

4. Start the server:
```
npm start
```

The application should now be running on http://localhost:<port number>.

## Testing

To run the unit tests, use the following command:

```
npm test
```


## API Documentation

API documentation is available through Swagger at http://localhost:<port number>/documentation.

## Admin Dashboard

To access the admin dashboard, user must have `admin: true` property and he will see Admin page in the main Menu.

## Dependencies

- [@hapi/boom](https://www.npmjs.com/package/@hapi/boom) - HTTP-friendly error objects
- [@hapi/cookie](https://www.npmjs.com/package/@hapi/cookie) - Cookie parsing and serialization
- [@hapi/hapi](https://www.npmjs.com/package/@hapi/hapi) - Web framework
- [@hapi/inert](https://www.npmjs.com/package/@hapi/inert) - Static file and directory handling
- [@hapi/vision](https://www.npmjs.com/package/@hapi/vision) - Template rendering
- [cloudinary](https://www.npmjs.com/package/cloudinary) - Image and video management in the cloud
- [dotenv](https://www.npmjs.com/package/dotenv) - Environment variable management
- [handlebars](https://www.npmjs.com/package/handlebars) - Templating engine
- [hapi-auth-jwt2](https://www.npmjs.com/package/hapi-auth-jwt2) - JWT authentication scheme
- [hapi-swagger](https://www.npmjs.com/package/hapi-swagger) - API documentation generator
- [joi](https://www.npmjs.com/package/joi) - Object schema validation
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) - JSON web token implementation
- [mongoose](https://www.npmjs.com/package/mongoose) - MongoDB object modeling
- [uuid](https://www.npmjs.com/package/uuid) - UUID generation
