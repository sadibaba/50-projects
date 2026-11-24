# Chat App

A one-to-one chat application with JWT authentication, message history in
MongoDB and real-time delivery through Socket.IO.

## Overview

The client lists registered users, opens a conversation and renders the message
history. Sending a message follows a two-step flow: the message is persisted
through the REST API, then the saved message is broadcast over Socket.IO to the
recipient.

The socket connection is authenticated with the same JWT used by the REST API.
The server derives the sender from the verified token, so a client cannot post a
message as another user.

## Implemented features

### Authentication

- Registration with username, email and password validation.
- Login with bcrypt password verification.
- Seven-day JWT sessions.
- Protected REST routes.
- Protected React routes.
- Socket handshake authentication with the same token.

### Messaging

- List all other users.
- Search users by username or email.
- Conversation history between two users.
- Send a message and see it immediately through an optimistic update.
- Replace the optimistic message with the saved database record.
- Real-time delivery to the recipient's personal Socket.IO room.
- Message history persists across page reloads.
- Input validation and a 4000-character message limit.
- Sender identity comes from the verified token.

### Backend

- Health endpoint with database state.
- Consistent JSON error shape.
- CORS allowlist for HTTP and Socket.IO.
- Graceful shutdown.
- Static frontend serving is not included; the client and API run separately.

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite, React Router, Axios, Socket.IO client |
| Backend | Node.js, Express 5 |
| Database | MongoDB with Mongoose |
| Authentication | JSON Web Tokens, bcrypt |
| Real-time | Socket.IO |
| Tooling | nodemon, ESLint |

## Architecture

```text
React client (5173)
├── Auth pages
├── Chat page
│   ├── user list and search
│   ├── conversation history
│   ├── optimistic send
│   └── Socket.IO client
└── Axios client with Bearer token
        │
        ├── HTTP ──────► Express API (5000)
        │                 ├── /api/auth
        │                 ├── /api/users
        │                 ├── /api/messages
        │                 └── MongoDB: users, messages
        │
        └── WebSocket ─► Socket.IO server
                          ├── JWT handshake
                          ├── user room
                          ├── joinRoom
                          └── sendMessage broadcast
```

## Project structure

```text
7-chatApp/
├── backend/
│   ├── config/db.js          MongoDB connection
│   ├── controllers/          auth, user, message
│   ├── middlewares/          auth, errors, logger
│   ├── models/               User, Message
│   ├── routes/               auth, users, messages
│   ├── utils/http.js         ApiError and asyncHandler
│   ├── app.js                Express application
│   └── server.js             HTTP server and Socket.IO
├── frontend/
│   ├── src/services/         api, authService, userService, messageService
│   ├── src/components/       Login, Register, Chat
│   └── src/App.jsx
└── docs/
    ├── API.md
    └── ARCHITECTURE.md
```

## Getting started

### Prerequisites

- Node.js 18 or newer
- MongoDB 6 or newer
- npm 9 or newer

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

The API and Socket.IO server start on `http://localhost:5000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The client starts on `http://localhost:5173`.

### Environment variables

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `PORT` | No | `5000` | API and Socket.IO port |
| `NODE_ENV` | No | `development` | Runtime mode |
| `MONGO_URI` | Yes | - | MongoDB connection string |
| `JWT_SECRET` | Yes | - | Token signing secret |
| `CORS_ORIGINS` | No | `http://localhost:5173` | Allowed HTTP and Socket.IO origins |
| `VITE_API_URL` | No | `http://localhost:5000/api` | REST base URL |
| `VITE_SOCKET_URL` | No | `http://localhost:5000` | Socket.IO base URL |

## API summary

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | No | Create an account |
| POST | `/api/auth/login` | No | Obtain a JWT |
| GET | `/api/users` | Bearer | List other users |
| GET | `/api/users/search?q=` | Bearer | Search users |
| GET | `/api/messages?receiver=` | Bearer | Conversation history |
| POST | `/api/messages` | Bearer | Send and persist a message |
| GET | `/api/health` | No | Health check |

### Socket.IO events

| Direction | Event | Payload |
| --- | --- | --- |
| Client to server | `joinRoom` | `{ receiverId }` |
| Client to server | `sendMessage` | Saved message `{ sender, receiver, text, ... }` |
| Server to client | `receiveMessage` | Saved message |

The socket handshake requires `auth: { token }`. The server ignores a
`sendMessage` event whose `sender` does not match the authenticated socket user.

Full examples: [docs/API.md](docs/API.md).

## Data model

### User

| Field | Type | Notes |
| --- | --- | --- |
| `username` | String | Required, unique |
| `email` | String | Required, unique, lowercase |
| `password` | String | bcrypt hash |
| `createdAt` | Date | Timestamp |

### Message

| Field | Type | Notes |
| --- | --- | --- |
| `sender` | ObjectId | Authenticated sender |
| `receiver` | ObjectId | Recipient |
| `text` | String | Required, maximum 4000 characters |
| `createdAt` | Date | Sort key |

## Scripts

| Location | Command | Purpose |
| --- | --- | --- |
| backend | `npm start` | Start the API and socket server |
| backend | `npm run dev` | Start with nodemon |
| frontend | `npm run dev` | Development server |
| frontend | `npm run build` | Production build |
| frontend | `npm run preview` | Preview the build |
| frontend | `npm run lint` | ESLint |

## Verification

```bash
cd backend
node --check server.js

cd ../frontend
npm run build
```

Manual checks:

1. Register two accounts in two browsers.
2. Search for the other user and open the conversation.
3. Send a message and confirm it appears in both windows.
4. Refresh the receiver's page and confirm the history remains.
5. Sign out and confirm that `/chat` redirects to `/login`.
6. Open the browser console and confirm that the socket connects with the token.

## Known limitations

- Messages are persisted by the REST request before the socket broadcast. If the
  REST request fails, the optimistic message is removed and nothing is broadcast.
- There is no typing indicator, read receipt or online presence in this project.
  Presence and typing are implemented in `8-Social-media`.
- There is no group chat.
- There is no attachment support.
- Conversation history is not paginated.
- The user list exposes every registered account; there is no contact request
  flow.
- There are no automated tests.

## Roadmap

- Add read receipts and typing indicators.
- Add message pagination and infinite scrolling.
- Add group conversations.
- Add file and image attachments.
- Add socket-level rate limiting.
- Add automated tests for the API and socket events.

## License

MIT
