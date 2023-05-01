# Placemark

Placemark is a Node.js application that allows users to sign up, login, and manage their user settings. The application includes core unit tests, an admin account, Swagger API documentation, and integration with MongoDB Cloud Atlas for data storage.
![image](https://user-images.githubusercontent.com/29129335/226178445-93967401-26a3-4512-9357-21804f022daa.png)

## Prerequisites

Before you begin, you must have the following installed:

- Node.js
- MongoDB Cloud Atlas account
- Git (optional)

## Installation

1. Clone the repository using Git or download the source code as a ZIP file and extract it.
```
git clone https://github.com/Bullzai/placemark.git
```
2. Install dependencies using npm:
```
npm install
```

3. Create a `.env` file in the root directory of the project and set the following environment variables:
```
cookie_name=<cookie name>
cookie_password=<cookie password>
db=<Mongodb address with user and pass if using Cloud Atlas>
cloudinary_name=<Cloudinary username>
cloudinary_key=<Cloudinary API key>
cloudinary_secret=<Cloudinary secret>
apiKey=<Your web app's Firebase configuration>
authDomain=<Your web app's Firebase configuration>
databaseURL=<Your web app's Firebase configuration>
projectId=<Your web app's Firebase configuration>
storageBucket=<Your web app's Firebase configuration>
messagingSenderId=<Your web app's Firebase configuration>
appId=<Your web app's Firebase configuration>
measurementId=<Your web app's Firebase configuration>
```
You can get your Firebase web app's configuration inside your Firebase console

4. Start the server:
```
npm start
```

The application should now be running on http://localhost:3000

## Testing

To run the unit tests, use the following command:

```
npm test
```
Firebase Realtime Database is a free version, it has it's limitations.
If you run all suites, some tests might fail because of free account limitations.
All tests pass successfully when you run them suite by suite:

![image](https://user-images.githubusercontent.com/29129335/226178267-79e575e8-750a-42bc-a014-2be284aabc86.png)


## API Documentation

API documentation is available through Swagger at http://localhost:3000/documentation

## Admin Dashboard

To access the admin dashboard, user must have `admin: true` property and he will see Admin page in the main Menu. Tests: user-firebase-model-test and user-mongo-model-test automatically creates an admin - homer@simpson.com

## Firebase configuration

Add these rules into your Realtime Database project:
```
    "users" : {
      ".indexOn": "email"
    },
    "categories" : {
      ".indexOn": "userid"
    },
    "placemarks" : {
      ".indexOn": ["categoryid", "_id"]
    },
```

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
- [firebase](https://www.npmjs.com/package/firebase) - Firebase Realtime Database
