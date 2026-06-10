# TiffinTrack Backend Foundation

This is the backend foundation for **TiffinTrack**, a food-tech marketplace for home-cooked tiffin services. It is built using Node.js, Express, TypeScript, and MongoDB.

---

## Technical Stack
- **Runtime**: Node.js (v18+)
- **Language**: TypeScript
- **Framework**: Express.js
- **Database ORM**: Mongoose (MongoDB)
- **Validation**: Zod (Schema-based request parser)
- **Security**: Helmet, CORS, Express-Rate-Limit, BCrypt
- **Authentication**: JWT (JSON Web Tokens) with cookie storage and Bearer authentication

---

## Directory Structure

```text
backend/
├── src/
│   ├── config/
│   │     └── database.ts             # Mongoose connection & graceful shutdown handlers
│   ├── constants/
│   │     └── roles.ts                # Static user role definitions
│   ├── controllers/
│   │     └── auth.controller.ts      # Auth route placeholders (register, login, logout, me)
│   ├── middleware/
│   │     ├── auth.middleware.ts      # Authentication & role-authorization gate middleware
│   │     ├── error.middleware.ts     # Global Express error-formatting middleware
│   │     └── validate.middleware.ts  # Generic Zod request schema validation middleware
│   ├── models/
│   │     └── User.ts                 # Mongoose User schema with pre-save bcrypt hashing
│   ├── routes/
│   │     ├── index.ts                # API Version router (V1 wrapper)
│   │     └── auth.routes.ts          # Auth endpoint routes
│   ├── utils/
│   │     ├── ApiError.ts             # Custom operational error extending Error
│   │     ├── asyncHandler.ts         # Utility wrapper to catch async route errors
│   │     └── jwt.ts                  # JWT token sign and verify helpers
│   ├── validations/
│   │     └── auth.validation.ts      # Zod validation schemas for register and login
│   ├── app.ts                        # Express application configuration (cors, helmet, rate-limiter, health checks)
│   └── server.ts                     # Entry server listener hooking database and port configurations
├── .env.example                      # Sample configuration parameters
├── package.json                      # Node scripts and dependency declarations
├── tsconfig.json                     # TypeScript compilation options
└── README.md                         # Setup and architecture documentation
```

---

## Getting Started

### Prerequisites
- Node.js installed on your machine
- MongoDB instance running locally or a remote MongoDB URI

### Configuration
1. Clone the project and navigate to the `backend` folder.
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Set your environment variables in `.env` (such as `MONGODB_URI`, `PORT`, `JWT_SECRET`, etc.).

### Installation
Install project dependencies:
```bash
npm install
```

### Running the Project

#### Development Mode (Auto-restart)
To run the server in development mode with hot-reloading:
```bash
npm run dev
```

#### Build for Production
To compile the TypeScript files to JavaScript (`/dist` folder):
```bash
npm run build
```

#### Production Mode
To run the built JavaScript files:
```bash
npm run start
```

---

## API Documentation

### Base & Health
- **`GET /api/health`**
  - Check the running status of the server.
  - Response:
    ```json
    {
      "success": true,
      "message": "TiffinTrack API is running",
      "timestamp": "2026-06-10T12:00:00.000Z"
    }
    ```

---

### Authentication Routes (`/api/v1/auth`)

#### 1. Register User
- **`POST /register`**
  - Payload:
    ```json
    {
      "name": "John Doe",
      "email": "john@example.com",
      "password": "password123",
      "role": "customer" // Or 'vendor', 'admin'
    }
    ```
  - Response (sets HTTP-only `token` cookie):
    ```json
    {
      "success": true,
      "message": "User registered successfully",
      "data": {
        "user": {
          "id": "60a8f8d...",
          "name": "John Doe",
          "email": "john@example.com",
          "role": "customer",
          "isActive": true,
          "createdAt": "2026-06-10T12:00:00.000Z"
        },
        "token": "eyJhbGci..."
      }
    }
    ```

#### 2. User Login
- **`POST /login`**
  - Payload:
    ```json
    {
      "email": "john@example.com",
      "password": "password123"
    }
    ```
  - Response (sets HTTP-only `token` cookie):
    ```json
    {
      "success": true,
      "message": "Logged in successfully",
      "data": {
        "user": {
          "id": "60a8f8d...",
          "name": "John Doe",
          "email": "john@example.com",
          "role": "customer",
          "isActive": true
        },
        "token": "eyJhbGci..."
      }
    }
    ```

#### 3. User Logout
- **`POST /logout`**
  - Payload: None
  - Response (clears `token` cookie):
    ```json
    {
      "success": true,
      "message": "Logged out successfully"
    }
    ```

#### 4. Current User Profile
- **`GET /me`**
  - Requires: Bearer Token in `Authorization` header or Cookie `token`
  - Response:
    ```json
    {
      "success": true,
      "data": {
        "user": {
          "id": "60a8f8d...",
          "name": "John Doe",
          "email": "john@example.com",
          "role": "customer",
          "isActive": true
        }
      }
    }
    ```
