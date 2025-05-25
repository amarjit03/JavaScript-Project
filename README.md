# Project Title

## Introduction

This project is a Node.js and Express.js backend application designed to serve as the backend for a video sharing platform. Currently, it features core user authentication functionalities, including registration, login, and user session management. While models for video and subscription services are in place, these features are slated for full implementation in future development phases.

## Features

### Implemented

- User Registration: New users can register with username, email, full name, password, and upload an avatar and (optional) cover image. Images are uploaded to Cloudinary.
- User Login: Registered users can log in using email/username and password.
- JWT-based Authentication: Secure authentication using JSON Web Tokens (Access and Refresh tokens).
- Token Management: Access tokens are short-lived; Refresh tokens are used to obtain new access tokens. Tokens are stored in secure HTTP-only cookies.
- User Logout: Users can securely log out, invalidating their session.
- Password Hashing: User passwords are securely hashed using bcrypt before being stored.
- File Uploads: Handles multipart/form-data for image uploads (avatar, cover image) to Cloudinary.

### Planned / To Be Implemented

- Video Management:
    - Uploading video files and thumbnails (to Cloudinary).
    - Fetching video details.
    - Updating video information.
    - Deleting videos.
    - Listing videos (with pagination).
    - Tracking video views.
    - Publishing/unpublishing videos.
- Subscription Management:
    - Subscribing to a user/channel.
    - Unsubscribing from a user/channel.
    - Listing subscriptions and subscribers.
- User Profile Enhancements:
    - Updating user profile details (e.g., full name, avatar, cover image).
    - Changing password.
    - Accessing watch history.
    - Getting current user details.
- Comments and Likes (Future Scope): Functionality for users to comment on and like videos.
- Playlists (Future Scope): Ability for users to create and manage video playlists.

## Tech Stack

- **Backend Framework:** Express.js
- **Runtime Environment:** Node.js
- **Database:** MongoDB (with Mongoose as ODM)
- **Authentication:** JSON Web Tokens (JWT), bcrypt (for password hashing)
- **File Storage:** Cloudinary (for cloud-based media storage)
- **File Uploads:** Multer (for handling multipart/form-data)
- **Environment Variables:** dotenv
- **Development Tools:** Nodemon (for automatic server restarts), Prettier (for code formatting)
- **HTTP Cookie Management:** cookie-parser
- **Cross-Origin Resource Sharing:** cors
- **Asynchronous Operations:** mongoose-aggregate-paginate-v2 (for pagination)

## Project Structure

```
project-root/
├── public/
│   └── temp/           # Temporary storage for file uploads
├── src/
│   ├── app.js          # Express app configuration, middleware setup
│   ├── constants.js    # Project-wide constants
│   ├── index.js        # Application entry point, server startup, DB connection
│   ├── db/
│   │   └── index.js    # Database connection logic (MongoDB)
│   ├── models/         # Mongoose schemas and models
│   │   ├── user.model.js
│   │   ├── video.model.js
│   │   └── subscription.model.js
│   ├── controllers/    # Request handlers containing business logic
│   │   └── user.controller.js
│   ├── routes/         # API route definitions
│   │   └── user.routes.js
│   ├── middlewares/    # Custom middleware functions
│   │   ├── auth.middleware.js (JWT verification)
│   │   └── multer.middleware.js (File upload handling)
│   └── utils/          # Utility classes and helper functions
│       ├── ApiError.js
│       ├── ApiResponse.js
│       ├── asyncHandler.js
│       └── cloudinary.js
├── .env                # Environment variables (not committed)
├── .gitignore          # Specifies intentionally untracked files
├── package.json        # Project metadata and dependencies
└── README.md           # This file
```

**Directory Descriptions:**
- **`public/temp/`**: Temporarily stores files (like images and videos) during the upload process before they are moved to a cloud storage solution like Cloudinary.
- **`src/`**: Contains all the core source code of the application.
  - **`app.js`**: Initializes the Express application, sets up global middlewares (CORS, JSON parsing, cookie parsing, etc.), and mounts the main API routes.
  - **`constants.js`**: Holds any constant values used throughout the application (e.g., database name, common strings).
  - **`index.js`**: The main entry point of the application. It handles initializing the `dotenv` configuration, connecting to the database, and starting the Express server.
  - **`db/index.js`**: Contains the logic for establishing a connection to the MongoDB database using Mongoose.
  - **`models/`**: Defines the Mongoose schemas and models for the application's data structures (e.g., `User`, `Video`, `Subscription`). These models interact with the MongoDB database. (Note: actual filenames are `video.modle.js` and `suscriptions.model.js`)
  - **`controllers/`**: Houses the controller functions. These functions are responsible for handling incoming HTTP requests, processing business logic, interacting with models, and sending responses.
  - **`routes/`**: Contains the route definitions for various API endpoints. These files map HTTP methods and URL paths to specific controller functions.
  - **`middlewares/`**: Stores custom middleware functions used in the request-response cycle. Examples include authentication middleware (`verifyJwt`) and file upload handling middleware (`multer`).
  - **`utils/`**: A directory for utility classes and helper functions that provide common functionalities across the application, such as error handling (`ApiError`), standardized API responses (`ApiResponse`), asynchronous operation wrappers (`asyncHandler`), and Cloudinary integration (`cloudinary.js`).

## Setup and Installation

### Prerequisites

- **Node.js:** Version 18.x or later is recommended. You can download it from [nodejs.org](https://nodejs.org/).
- **npm:** Node Package Manager, comes bundled with Node.js.
- **MongoDB:** A running MongoDB instance is required. This can be a local installation or a cloud-hosted solution like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
- **Cloudinary Account:** You'll need a Cloudinary account for storing uploaded media files. Sign up at [cloudinary.com](https://cloudinary.com/) and note your Cloud Name, API Key, and API Secret.

### Cloning the Repository

1.  Open your terminal or command prompt.
2.  Clone the repository using Git:
    ```bash
    git clone <repository_url>
    ```
    (Replace `<repository_url>` with the actual URL of the Git repository)
3.  Navigate into the project directory:
    ```bash
    cd <project_directory>
    ```
    (Replace `<project_directory>` with the name of the folder created by `git clone`)

### Installing Dependencies

Once you are in the project directory, install the necessary Node.js packages using npm:

```bash
npm install
```
This command will download and install all the dependencies listed in the `package.json` file.

### Environment Variables

This project uses environment variables to manage sensitive information and configuration settings. You need to create a `.env` file in the root directory of the project.

1.  Create a new file named `.env` in the project's root folder.
2.  Copy the following template into your `.env` file and replace the placeholder values with your actual credentials and settings:

    ```env
    # Server Configuration
    PORT=8000                        # Port on which the application will run
    MONGODB_URI="your_mongodb_connection_string" # Connection string for your MongoDB instance
    CROS_ORIGIN="http://localhost:3000" # Frontend URL for CORS. Use '*' for permissive CORS during development.

    # JWT Token Configuration
    ACCESS_TOKEN_SECRET="your_access_token_secret"     # Secret key for signing access tokens
    ACCESS_TOKEN_EXPIRE="1d"                           # Expiry time for access tokens (e.g., 1d, 1h, 30m)
    REFRESH_TOKEN_SECRET="your_refresh_token_secret"   # Secret key for signing refresh tokens
    REFRESH_TOKEN_EXPIRE="10d"                         # Expiry time for refresh tokens

    # Cloudinary Configuration
    CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name" # Your Cloudinary cloud name
    CLOUDINARY_API_KEY="your_cloudinary_api_key"       # Your Cloudinary API key
    CLOUDINARY_API_SECRET="your_cloudinary_api_secret" # Your Cloudinary API secret
    ```

**Explanation of Environment Variables:**

-   `PORT`: The port number where the backend server will listen for requests.
-   `MONGODB_URI`: The connection string for your MongoDB database. This typically includes the database address, port, and database name.
-   `CROS_ORIGIN`: Specifies the origin(s) allowed to access the API. For development, you might use your frontend's local address (e.g., `http://localhost:3000`) or `*` to allow all origins (less secure, use with caution).
-   `ACCESS_TOKEN_SECRET`: A secret string used to sign and verify JWT access tokens. Keep this secure.
-   `ACCESS_TOKEN_EXPIRE`: Defines how long an access token remains valid (e.g., "1d" for one day, "15m" for fifteen minutes).
-   `REFRESH_TOKEN_SECRET`: A secret string used to sign and verify JWT refresh tokens. This should be different from the access token secret and also kept secure.
-   `REFRESH_TOKEN_EXPIRE`: Defines how long a refresh token remains valid. This is typically longer than the access token's expiry.
-   `CLOUDINARY_CLOUD_NAME`: Your unique cloud name from your Cloudinary account.
-   `CLOUDINARY_API_KEY`: Your API key from Cloudinary.
-   `CLOUDINARY_API_SECRET`: Your API secret from Cloudinary. Keep this highly confidential.

### Running the Application

After setting up your environment variables, you can start the application using the following npm script:

```bash
npm run dev
```

This command typically uses `nodemon`, a utility that monitors for any changes in your source code and automatically restarts the server. This is very useful during development.

Upon successful startup, you should see a message in your console similar to:

```
🚀 Server running on port: 8000
MongoDB connected !! DB HOST: <your_mongodb_host_details>
```
(The exact MongoDB connection message might vary based on the application's logging.)

Your backend server is now running and ready to accept API requests on the specified `PORT`.

## API Endpoints

All API endpoints are prefixed with `/api/v1`.

### User Endpoints (`/users`)

1.  **Register User**
    *   **Endpoint:** `POST /users/register`
    *   **Description:** Registers a new user in the system.
    *   **Request Body Type:** `multipart/form-data` (due to file uploads)
    *   **Request Body Fields:**
        *   `fullname` (String, required)
        *   `username` (String, required, unique)
        *   `email` (String, required, unique)
        *   `password` (String, required)
        *   `avatar` (File, required, image)
        *   `coverImage` (File, optional, image)
    *   **Response (Success - 201 Created):**
        ```json
        {
            "statusCode": 201,
            "data": {
                "_id": "userId",
                "fullname": "Test User",
                "username": "testuser",
                "email": "test@example.com",
                "avatar": "cloudinary_url_for_avatar",
                "coverImage": "cloudinary_url_for_cover_image",
                "createdAt": "timestamp",
                "updatedAt": "timestamp"
            },
            "message": "User registered successfully",
            "success": true
        }
        ```
    *   **Response (Error):** Standard `ApiError` format (e.g., 400 for validation errors, 409 for existing user).

2.  **Login User**
    *   **Endpoint:** `POST /users/login`
    *   **Description:** Logs in an existing user.
    *   **Request Body Type:** `application/json`
    *   **Request Body Fields:**
        *   `email` OR `username` (String, required)
        *   `password` (String, required)
    *   **Response (Success - 200 OK):**
        *   Sets `accessToken` and `refreshToken` in HTTP-only cookies.
        ```json
        {
            "statusCode": 200,
            "data": {
                "user": {
                    "_id": "userId",
                    "fullname": "Test User",
                    "username": "testuser",
                    "email": "test@example.com",
                    "avatar": "cloudinary_url_for_avatar"
                    // ... other user fields
                },
                "accessToken": "jwt_access_token",
                "refreshToken": "jwt_refresh_token"
            },
            "message": "User Logged In Successfully",
            "success": true
        }
        ```
    *   **Response (Error):** Standard `ApiError` format (e.g., 400 for missing fields, 404 for user not found, 401 for incorrect password).

3.  **Logout User**
    *   **Endpoint:** `POST /users/logout`
    *   **Description:** Logs out the currently authenticated user. Requires authentication.
    *   **Authentication:** Requires `accessToken` (sent via cookie or Authorization header).
    *   **Response (Success - 200 OK):**
        *   Clears `accessToken` and `refreshToken` cookies.
        ```json
        {
            "statusCode": 200,
            "data": {},
            "message": "User logged Out",
            "success": true
        }
        ```
    *   **Response (Error):** Standard `ApiError` format (e.g., 401 for unauthorized).

4.  **Refresh Access Token**
    *   **Endpoint:** `POST /users/refresh-token`
    *   **Description:** Issues a new access token using a valid refresh token.
    *   **Request Body Type:** `application/json` OR expects `refreshToken` from cookie.
    *   **Request Body Fields (if not using cookie):**
        *   `refreshToken` (String, required)
    *   **Response (Success - 200 OK):**
        *   Sets new `accessToken` and `refreshToken` in HTTP-only cookies.
        ```json
        {
            "statusCode": 200,
            "data": {
                "accessToken": "new_jwt_access_token",
                "refreshToken": "new_jwt_refresh_token"
            },
            "message": "Access token refreshed",
            "success": true
        }
        ```
    *   **Response (Error):** Standard `ApiError` format (e.g., 401 for invalid or missing refresh token).

*Note: Other user-related endpoints like updating account details, avatar, cover image, fetching user channel profiles, and watch history are also implemented but are not detailed here for brevity. Refer to the route definitions in `src/routes/user.routes.js` for a complete list.*

### Video Endpoints (`/videos`)

*   (To Be Implemented) - Endpoints for video uploading, streaming, listing, updating, deleting, etc.

### Subscription Endpoints (`/subscriptions`)

*   (To Be Implemented) - Endpoints for managing user subscriptions to channels.

## Error Handling

- Explain how errors are handled in the API (e.g., standard error response format, status codes).

## Utilities

- Describe any utility functions or helper modules available in the project.
- Example: `asyncHandler.js` for wrapping asynchronous route handlers.

## Areas for Improvement & Future Scope

This section outlines known issues, planned corrections, and potential future enhancements for the project.

### Bug Fixes & Code Corrections

1.  **`ApiError.js` Constructor Bug:**
    *   **File:** `src/utils/ApiError.js`
    *   **Issue:** The line `this.errors = this.errors;` in the constructor is incorrect.
    *   **Correction:** Change to `this.errors = errors;` to correctly assign the `errors` parameter to the instance property.

2.  **`ApiResponse.js` Constructor Bug:**
    *   **File:** `src/utils/ApiResponse.js`
    *   **Issue:** The line `this.statusCode = statusCode < 400;` incorrectly assigns a boolean to `this.statusCode`.
    *   **Correction:** This line should be `this.success = statusCode < 400;`. Ensure `this.statusCode = statusCode;` is also present to correctly assign the HTTP status code.

3.  **Model Filename Typos:**
    *   `src/models/video.modle.js` needs to be renamed to `src/models/video.model.js`.
    *   `src/models/suscriptions.model.js` needs to be renamed to `src/models/subscription.model.js`.
    *   **Action Required:** Rename these files and update all import statements across the project that refer to them.

4.  **`Video Model` Schema Typos:**
    *   **File:** `src/models/video.modle.js` (after renaming to `video.model.js`)
    *   **Corrections Needed:**
        *   `videoFile: { ..., requried:true }` should be `required:true`.
        *   `thumbnail: { ..., requried:true }` should be `required:true`.
        *   `title: { ..., requried:true }` should be `required:true`.
        *   `description: { ..., requried:true }` should be `required:true`.
        *   `duration: { ..., requried:true }` should be `required:true`.
        *   `isPublished: { ..., default:True }` should be `default:true` (boolean `true` should be lowercase).
        *   `owner: { types:Schema.type.ObjectId, ... }` should be `type:Schema.Types.ObjectId, ...`.

### Missing Routes

*   **Password Change and Current User Routes:**
    *   The `user.controller.js` includes `changeCurrentPassword` and `getCurrentUser` functions. However, these are not currently mapped to any API routes.
    *   **Suggestion:**
        *   Add a route `PATCH /users/change-password` in `src/routes/user.routes.js` for the `changeCurrentPassword` controller.
        *   Add a route `GET /users/current-user` in `src/routes/user.routes.js` for the `getCurrentUser` controller.
        *   Ensure both routes are protected by the `verifyJwt` authentication middleware.

### Future Features & Enhancements

*   **Implement Full Video Management:**
    *   Develop controllers and routes for:
        *   Uploading video files and thumbnails (to Cloudinary).
        *   Fetching detailed information for a specific video.
        *   Updating video metadata (title, description, thumbnail, etc.).
        *   Deleting videos.
        *   Listing all videos with pagination and filtering options.
        *   Tracking and incrementing video view counts.
        *   Toggling the publish status of videos.
*   **Implement Full Subscription Management:**
    *   Develop controllers and routes for:
        *   Allowing users to subscribe/unsubscribe to channels (other users).
        *   Listing all subscribers for a specific channel.
        *   Listing all channels a specific user is subscribed to.
*   **Comprehensive API Documentation:**
    *   Integrate a tool like Swagger or OpenAPI specification to generate interactive and detailed API documentation. This will aid frontend developers and API consumers.
*   **Testing Suite:**
    *   Implement a robust testing strategy:
        *   **Unit Tests:** For individual functions, models, and utility classes (e.g., testing model validations, utility function outputs).
        *   **Integration Tests:** For API endpoints to ensure controllers, services, and models work correctly together (e.g., testing the full user registration flow).
*   **Advanced User Profile Features:**
    *   Implement functionality for users to view and manage their watch history.
    *   Allow users to update their profile information (e.g., full name, avatar, cover image) after registration.
*   **Content Interaction Features:**
    *   **Comments:** Allow users to add comments to videos and reply to existing comments.
    *   **Likes/Dislikes:** Implement a system for users to like or dislike videos.
*   **Playlists:**
    *   Enable users to create custom playlists, add videos to playlists, and manage their playlists.
*   **Search and Discovery:**
    *   Implement a search functionality allowing users to find videos based on keywords, titles, descriptions, or tags.
    *   Allow searching for users/channels.
*   **Admin Panel/Dashboard:**
    *   A dedicated interface for administrators to manage users (view, ban, delete), oversee content (moderate, remove), and view platform analytics.
