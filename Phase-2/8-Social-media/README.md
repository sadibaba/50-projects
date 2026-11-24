# Social Media Chat

A real-time chat application with online presence, typing indicators and message
history. The project folder is named `8-Social-media`; the implemented scope is
the messaging module of a social application, not a full social network.

## Scope

This project implements:

- account creation and login,
- a user directory,
- one-to-one conversations,
- real-time message delivery,
- online presence,
- typing indicators,
- persisted message history.

It does **not** implement posts, a feed, follows, likes or comments. Those
features were part of the broader social-media idea but were never built, so they
are not presented as complete. See the roadmap.

## Overview

The backend runs an Express API and a Socket.IO server on port `3000`. The client
connects with the JWT it received at login. Messages are persisted by the socket
handler and by the REST endpoint, and the recipient receives them in real time
when online.

## Implemented features

### Accounts

- Registration with username, email and password validation.
- Login with bcrypt password verification.
- Seven-day JWT sessions.
- Protected routes and a protected home route.
- Socket handshake authenticated with the same JWT.
- Current-user endpoint that includes the account creation date.

### Messaging

- User directory with every other registered account.
- Recent chat list built from existing conversations.
- Conversation history endpoint.
- Real-time private messages through Socket.IO.
- Messages persisted in MongoDB with sender, receiver, text and timestamp.
- Online presence broadcast to all connected clients.
- Typing indicator events.
- Sender identity derived from the verified socket token.
- Message validation and a 4000-character limit.

### UI

- Login and registration screens.
- Dashboard with total users, online users and active chats.
- Users tab with online indicators.
- Profile tab with the real member-since date.
- Chat modal with message history, send form and typing state.
- Responsive layout.

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite, Tailwind CSS, React Router, Socket.IO client |
| Backend | Node.js, Express 5 |
| Database | MongoDB with Mongoose |
| Authentication | JSON Web Tokens, bcryptjs |
| Real-time | Socket.IO |
| Tooling | nodemon, ESLint |

## Architecture

```text
React client (5173)
├── Login / Register
├── Home
│   ├── dashboard statistics
│   ├── user directory and presence
│   ├── profile tab
│   └── Chat modal
└── fetch API client + Socket.IO client
        │
        ├── HTTP (3000) ──► Express API
        │                    ├── /api/auth
        │                    ├── /api/messages
        │                    └── MongoDB: users, messages
        │
        └── Socket.IO ────► Socket server
                             ├── JWT handshake
                             ├── online-users
                             ├── private-message
                             ├── typing
                             └── message-sent / new-message
```

## Project structure

```text
8-Social-media/
├── backend/
│   ├── controllers/          auth and message handlers
│   ├── db/mongo.db.js        MongoDB connection
│   ├── middlewares/          auth, CORS
│   ├── models/               User, Message
│   ├── routes/               auth and message routes
│   ├── services/             authentication service
│   ├── sockets/socket.js     Socket.IO server
│   ├── utils/http.js         ApiError and asyncHandler
│   ├── app.js
│   └── server.js
├── frontend/
│   ├── src/services/         fetch API client and socket client
│   ├── src/components/       Login, Register, Home, Chat
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

The API and Socket.IO server start on `http://localhost:3000`.

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
| `PORT` | No | `3000` | API and Socket.IO port |
| `NODE_ENV` | No | `development` | Runtime mode |
| `MONGO_URI` | No | - | MongoDB connection string (`DATABASE_URL` is also accepted) |
| `JWT_SECRET` | Yes | - | Token signing secret |
| `CORS_ORIGINS` | No | `http://localhost:5173` | Allowed HTTP and Socket.IO origins |
| `VITE_API_BASE_URL` | No | `http://localhost:3000/api` | API base URL |
| `VITE_SOCKET_URL` | No | `http://localhost:3000` | Socket.IO base URL |

## API summary

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | No | Create an account |
| POST | `/api/auth/login` | No | Obtain a JWT |
| GET | `/api/auth/me` | Bearer | Current user |
| GET | `/api/auth/users` | Bearer | Other users |
| GET | `/api/messages/chat-users` | Bearer | Recent conversations |
| GET | `/api/messages/:userId/messages` | Bearer | Conversation history |
| POST | `/api/messages` | Bearer | Send a message |
| GET | `/api/health` | No | Health check |

### Socket.IO events

| Direction | Event | Payload |
| --- | --- | --- |
| Client to server | `private-message` | `{ receiverId, message }` |
| Client to server | `typing` | `{ receiverId, isTyping }` |
| Server to client | `online-users` | Array of user ids |
| Server to client | `new-message` | Populated message |
| Server to client | `message-sent` | Populated message for the sender |
| Server to client | `user-typing` | `{ userId, isTyping }` |
| Server to client | `message-error` | `{ error }` |

Full examples: [docs/API.md](docs/API.md).

## Data model

### User

| Field | Type | Notes |
| --- | --- | --- |
| `username` | String | Required, unique |
| `email` | String | Required, unique, lowercase |
| `password` | String | bcrypt hash |
| `createdAt`, `updatedAt` | Date | Timestamps |

### Message

| Field | Type | Notes |
| --- | --- | --- |
| `sender` | ObjectId | Authenticated sender |
| `receiver` | ObjectId | Recipient |
| `message` | String | Required |
| `read` | Boolean | Reserved for read receipts; not currently updated |
| `createdAt`, `updatedAt` | Date | Timestamps |

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
2. Confirm that both appear online in the dashboard.
3. Open a chat and send a message; confirm real-time delivery.
4. Confirm that the typing indicator appears in the other window.
5. Refresh and confirm that the history is loaded from MongoDB.
6. Confirm that the profile tab shows the real account creation date.

## Known limitations

- This is a chat module, not a full social network. Posts, feed, follows and
  likes are not implemented.
- The `read` field exists but read receipts are not implemented.
- There is no group chat, attachment upload or message pagination.
- Presence is stored in memory and is lost on server restart.
- The user directory exposes every registered account.
- The frontend uses the fetch API rather than Axios; error handling is minimal.
- There are no automated tests.

## Roadmap

- Add posts, a feed, follows and likes to complete the social scope.
- Add read receipts and unread counts.
- Add group conversations.
- Add attachments and message pagination.
- Move presence to a shared store such as Redis for multi-instance deployments.
- Replace the fetch client with a typed API layer and consistent error handling.
- Add automated API and socket tests.

## License

MIT
