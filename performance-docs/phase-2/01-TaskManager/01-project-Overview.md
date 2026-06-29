## Project Overview: Task Manager API

### What Was Built
A **RESTful Task Management API** built with **Node.js**, **Express**, and **MongoDB**. This is a production-ready backend service that allows users to:

**Key Features:**
- **User Authentication**: Register/Login with JWT-based authentication
- **Task CRUD Operations**: Create, Read, Update, and Delete tasks
- **User-Specific Data**: Each user can only access their own tasks
- **Task Properties**: Title (required), Description, Status (pending/completed), Deadline
- **Secure Endpoints**: Protected routes with authentication middleware

### Architecture Overview

```
├── Models (MongoDB Schemas)
│   ├── User (name, email, password)
│   └── Task (title, description, status, deadline, user reference)
│
├── Controllers (Business Logic)
│   ├── User Controller (register, login)
│   └── Task Controller (CRUD operations)
│
├── Services (Database Operations)
│   ├── User Service
│   └── Task Service
│
├── Routes (API Endpoints)
│   ├── /api/users/register (POST)
│   ├── /api/users/login (POST)
│   ├── /api/tasks (POST, GET)
│   └── /api/tasks/:id (PUT, DELETE)
│
└── Middleware
    ├── auth.js (JWT verification)
    └── taskAuth.js (Task ownership check)
```

### Technology Stack
- **Runtime**: Node.js with ES Modules
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs for password hashing
- **Environment**: dotenv for configuration
- **HTTP Server**: Native Node.js HTTP module

### Security Features
- Passwords hashed with bcrypt
- JWT tokens for session management
- Route protection via auth middleware
- Task ownership validation
- CORS enabled

### API Endpoints
| Method | Endpoint              | Description |
|--------|----------             |-------------|
| POST   | `/api/users/register` | Register new user |
| POST   | `/api/users/login`    | Login user |
| POST   | `/api/tasks`          | Create new task |
| GET    | `/api/tasks`          | Get all user tasks |
| PUT    | `/api/tasks/:id`      | Update task |
| DELETE | `/api/tasks/:id`      | Delete task |

### Current Status
A fully functional backend API ready for testing and deployment. The code follows MVC pattern with clean separation of concerns, making it maintainable and scalable.

---
