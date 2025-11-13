# MERN Stack Blog: "Starfleet Daily"

This project is a full-stack MERN (MongoDB, Express.js, React.js, Node.js) blog application built as part of the MERN Stack Integration assignment. The application allows users to register, log in, create blog posts (including image uploads), and view posts from other users.

## Features Implemented

* **Full-Stack MERN Architecture**: Client (React/Vite) and Server (Express/Node.js) separation.
* **Database**: MongoDB (via Mongoose) for storing users, posts, categories, and comments.
* **RESTful API**: A complete API for managing posts, categories, users, and comments.
* **User Authentication**: Full JWT (JSON Web Token) authentication for user registration and login.
* **Protected Routes**: Server-side middleware (`protect`) ensures only authenticated users can create, update, or delete posts and comments.
* **Cloud Image Uploads**: Seamless integration with **Vercel Blob** for persistent, cloud-based image uploads.
* **Dynamic Front-End**: React components for a full SPA experience, including:
    * Homepage with post list, pagination, search, and category filtering.
    * Single Post detail page.
    * "Create Post" form with image upload.
    * Login & Register pages.
* **Global State Management**: React Context API (`AuthContext`) manages user login state across the entire application.
* **Comments System**: Authenticated users can post comments on articles.
* **Deployment**: Fully configured for serverless deployment on Vercel.

## API Endpoints

### Auth (`/api/auth`)

* `POST /register`: Register a new user.
* `POST /login`: Log in an existing user and receive a JWT.

### Posts (`/api/posts`)

* `GET /`: Get all posts. Supports query params: `?page=`, `?keyword=`, `?category=`.
* `GET /:id`: Get a single post by its ID.
* `POST /`: Create a new post. (Requires auth). Handles `multipart/form-data` for text and image upload.
* `PUT /:id`: Update a post's text content. (Requires auth).
* `DELETE /:id`: Delete a post. (Requires auth).

### Categories (`/api/categories`)

* `GET /`: Get all categories.
* `POST /`: Create a new category. (Requires auth, though currently unprotected).

### Comments (`/api/posts/:postId/comments`)

* `GET /`: Get all comments for a specific post.
* `POST /`: Create a new comment for a specific post. (Requires auth).

## Environment Variables

### Server (`server/config/config.env`)

```
NODE_ENV=development
PORT=5000
MONGO_URI="your_mongodb_connection_string"
JWT_SECRET="your_jwt_secret_key"
```

### Vercel Deployment

The following variables must be set in the Vercel Project Settings:

* `MONGO_URI`: The MongoDB connection string.
* `JWT_SECRET`: The JWT secret key for authentication.
* `BLOB_READ_WRITE_TOKEN`: The Vercel Blob store token.

### Client (`client/.env`)

```
VITE_API_BASE_URL=http://localhost:5000/api
```

## Setup & Local Development

1.  **Clone Repository:**
    ```bash
    git clone <your-repo-url>
    cd <repo-name>
    ```

2.  **Install Server Dependencies:**
    ```bash
    cd server
    npm install
    ```

3.  **Install Client Dependencies:**
    ```bash
    cd ../client
    npm install
    ```

4.  **Set Environment Variables:**
    * Create `server/config/config.env` and add your `MONGO_URI` and `JWT_SECRET`.
    * Create `client/.env` and add `VITE_API_BASE_URL=http://localhost:5000/api`.

5.  **Start Both Servers:**
    * In one terminal (from `server` folder): `npm run dev`
    * In a second terminal (from `client` folder): `npm run dev`

6.  Open `http://localhost:5173` (or the port shown in your Vite terminal) in your browser.