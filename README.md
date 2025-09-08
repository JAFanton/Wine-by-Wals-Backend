# Wine By Wals – Backend

This is the **backend API** for the Wine By Wals website, built with the **MERN stack** (MongoDB, Express, Node.js) and JWT authentication.  
It handles user authentication, wine catalog management, cart functionality, and admin-only discount management.

------------------------------------------------------------------------------------------------------------------------------------

## Table of Contents

- [Technologies](#technologies)
- [Setup](#setup)
- [Environment Variables](#environment-variables)
- [Available Routes](#available-routes)
- [Testing](#testing)
- [Admin Access](#admin-access)

------------------------------------------------------------------------------------------------------------------------------------

## Technologies

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication (`express-jwt`)
- Bcrypt for password hashing

------------------------------------------------------------------------------------------------------------------------------------

## Setup

1. **Clone the repository**

git clone <repo-url>
cd Wine-by-Wals-Backend

2. **Install Dependencies**

npm install

3. **Run the server**

npm run dev

------------------------------------------------------------------------------------------------------------------------------------

## Environmental Variables

The backend requires several environment variables to run correctly. Create a .env file in the root of your project and define the following:

# Secret key used for signing JSON Web Tokens (JWT).
# This should be a long, random string to ensure token security.
TOKEN_SECRET=<your_jwt_secret>

# MongoDB connection string.
# Replace <username>, <password>, and <dbname> with your database credentials.
# Example: mongodb+srv://user:pass@cluster0.mongodb.net/wine-by-wals?retryWrites=true&w=majority
MONGODB_URI=<your_mongo_connection_string>

# Frontend URL to allow cross-origin requests.
# This tells the backend which frontend domain is allowed to make requests.
# Example: http://localhost:3000 for local development.
ORIGIN=http://localhost:3000

# Port that the backend server will listen on.
# Default is 5005 if not specified.
PORT=5005

# Optional: Node environment (development or production).
# This can be used to toggle environment-specific behavior in the server.
NODE_ENV=development

| Variable       | Purpose                                                                 |
| -------------- | ----------------------------------------------------------------------- |
| `TOKEN_SECRET` | Used to sign and verify JWT tokens for authentication and authorization |
| `MONGODB_URI`  | Connection string for MongoDB database                                  |
| `ORIGIN`       | Frontend URL allowed for cross-origin requests (CORS)                   |
| `PORT`         | Port on which the backend server listens                                |
| `NODE_ENV`     | Optional environment variable to distinguish development vs production  |

------------------------------------------------------------------------------------------------------------------------------------


## Available Routes


Authentication
| Method | Route          | Description                                 |
| ------ | -------------- | ------------------------------------------- |
| POST   | `/auth/signup` | Create a new user (role defaults to "user") |
| POST   | `/auth/login`  | Login and receive JWT                       |
| GET    | `/auth/verify` | Verify JWT token                            |

Wine Management
| Method | Route       | Description    | Access     |
| ------ | ----------- | -------------- | ---------- |
| GET    | `/wine`     | Get all wines  | Public     |
| POST   | `/wine`     | Add a new wine | Admin only |
| PUT    | `/wine/:id` | Update wine    | Admin only |
| DELETE | `/wine/:id` | Delete a wine  | Admin only |

Cart Management
| Method | Route            | Description                  | Access              |
| ------ | ---------------- | ---------------------------- | ------------------- |
| GET    | `/cart`          | Get current user’s cart      | Authenticated users |
| POST   | `/cart`          | Add wine / increase quantity | Authenticated users |
| PUT    | `/cart/:wineId`  | Update quantity              | Authenticated users |
| DELETE | `/cart/:wineId`  | Remove wine                  | Authenticated users |
| POST   | `/cart/discount` | Apply discount               | Admin only          |

Order Management
| Method | Route         | Description                               | Access              |
c
| GET    | `/orders`     | Get all orders for the current user       | Authenticated users |
| POST   | `/orders`     | Create a new order from the user’s cart   | Authenticated users |
| GET    | `/orders/:id` | Get details of a specific order           | Authenticated users |
| PUT    | `/orders/:id` | Update order status (e.g., shipped, paid) | Admin only          |
| DELETE | `/orders/:id` | Cancel or delete an order                 | Admin only          |


Index Health Check Route
| Method | Route         | Description                               | Access              |
| ------ | ------------- | ----------------------------------------- | ------------------- |
| GET    | `/`           | Health check route                        | ------------------- |

------------------------------------------------------------------------------------------------------------------------------------

## Testing

I used Postman to test all routes.

Ensure MongoDB is running and connected via MONGODB_URL which should be in your .env file.

Include the Authorization header with your JWT token for all protected routes:
Authorization: Bearer <authToken>

------------------------------------------------------------------------------------------------------------------------------------

## Admin Access

Only users with role: "admin" can:
- Create, update, delete wines 
- Apply discounts.

You can create an admin manually in MongoDB or via a dedicated create-admin route if implemented.

