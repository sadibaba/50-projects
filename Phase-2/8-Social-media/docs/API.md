# Social Media Chat API Reference

Base URL: `http://localhost:3000/api`

Protected endpoints use:

```http
Authorization: Bearer <token>
```

Errors use:

```json
{ "error": "Human-readable explanation" }
```

## Health

### GET `/health`

```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```

## Authentication

### POST `/auth/register`

```json
{
  "username": "ayesha",
  "email": "ayesha@example.com",
  "password": "a-strong-password"
}
```

Response `201`:

```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "<jwt>",
  "user": {
    "id": "66f1...",
    "username": "ayesha",
    "email": "ayesha@example.com"
  }
}
```

Validation: username and email are unique, email must be valid and password must
be at least eight characters.

### POST `/auth/login`

```json
{
  "email": "ayesha@example.com",
  "password": "a-strong-password"
}
```

Response `200`:

```json
{
  "success": true,
  "message": "Login successful",
  "token": "<jwt>",
  "user": {
    "id": "66f1...",
    "username": "ayesha",
    "email": "ayesha@example.com"
  }
}
```

### GET `/auth/me`

Authentication required.

```json
{
  "_id": "66f1...",
  "username": "ayesha",
  "email": "ayesha@example.com",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

### GET `/auth/users`

Authentication required. Returns every user except the current one.

```json
[
  {
    "_id": "66f2...",
    "username": "bilal",
    "email": "bilal@example.com",
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
]
```

## Messages

### GET `/messages/chat-users`

Authentication required. Returns one entry per user the current account has
exchanged messages with, newest conversation first.

```json
[
  {
    "_id": "66f2...",
    "username": "bilal",
    "email": "bilal@example.com",
    "lastMessage": "See you tomorrow",
    "lastMessageTime": "2026-01-02T10:00:00.000Z"
  }
]
```

### GET `/messages/:userId/messages`

Authentication required. Returns the conversation in chronological order with
sender and receiver populated.

```json
[
  {
    "_id": "66f3...",
    "sender": {
      "_id": "66f1...",
      "username": "ayesha",
      "email": "ayesha@example.com"
    },
    "receiver": {
      "_id": "66f2...",
      "username": "bilal",
      "email": "bilal@example.com"
    },
    "message": "Hello",
    "read": false,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
]
```

### POST `/messages`

Authentication required.

```json
{
  "receiverId": "66f2...",
  "message": "Hello"
}
```

The sender is taken from the token. The receiver must exist and cannot be the
sender.

Response `201`: the populated message.

## Socket.IO

Connection:

```js
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  auth: { token },
});
```

### Send a private message

```js
socket.emit("private-message", {
  receiverId: "66f2...",
  message: "Hello",
});
```

The message is persisted, then:

- the recipient receives `new-message` if online,
- the sender receives `message-sent`.

### Typing state

```js
socket.emit("typing", { receiverId: "66f2...", isTyping: true });
```

The recipient receives:

```js
socket.on("user-typing", ({ userId, isTyping }) => {
  // update the indicator
});
```

### Presence

```js
socket.on("online-users", (userIds) => {
  // array of online user ids
});
```

The list is broadcast on connect and disconnect.

## cURL examples

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"tester","email":"tester@example.com","password":"password123"}'

# Login and capture a token
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"tester@example.com","password":"password123"}' \
  | node -pe "JSON.parse(require('fs').readFileSync(0)).token")

# Users
curl http://localhost:3000/api/auth/users \
  -H "Authorization: Bearer $TOKEN"

# Send a message
curl -X POST http://localhost:3000/api/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"receiverId":"<other user id>","message":"Hello"}'
```
