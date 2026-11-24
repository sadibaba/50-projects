# Chat App API Reference

Base URL: `http://localhost:5000/api`

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
  "message": "User registered successfully",
  "token": "<jwt>",
  "user": {
    "id": "66f1...",
    "username": "ayesha",
    "email": "ayesha@example.com"
  }
}
```

Validation: username and email must be unique, email must be valid and password
must be at least eight characters.

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
  "token": "<jwt>",
  "user": {
    "id": "66f1...",
    "username": "ayesha",
    "email": "ayesha@example.com"
  }
}
```

## Users

### GET `/users`

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

### GET `/users/search?q=`

Authentication required. Case-insensitive match on username or email, limited to
25 results.

```json
[
  {
    "_id": "66f2...",
    "username": "bilal",
    "email": "bilal@example.com"
  }
]
```

## Messages

### GET `/messages?receiver=<userId>`

Authentication required. Returns the conversation between the current user and
the receiver, oldest first.

```json
[
  {
    "_id": "66f3...",
    "sender": "66f1...",
    "receiver": "66f2...",
    "text": "Hello",
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
]
```

The sender is always derived from the token, not from a query parameter.

Errors:

| Status | Meaning |
| --- | --- |
| `400` | Missing or invalid receiver id |
| `401` | Missing or invalid token |

### POST `/messages`

Authentication required.

```json
{
  "receiver": "66f2...",
  "text": "Hello"
}
```

Rules:

- `receiver` and `text` are required.
- `receiver` must be a valid user id and cannot be the sender.
- Text is trimmed and limited to 4000 characters.

Response `201`:

```json
{
  "_id": "66f3...",
  "sender": "66f1...",
  "receiver": "66f2...",
  "text": "Hello",
  "createdAt": "2026-01-01T00:00:00.000Z"
}
```

## Socket.IO

Connection:

```js
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  auth: { token },
});
```

The server rejects a connection without a valid token.

### Join a conversation

```js
socket.emit("joinRoom", { receiverId: "66f2..." });
```

### Broadcast a saved message

```js
socket.emit("sendMessage", savedMessage);
```

The server verifies that `savedMessage.sender` matches the authenticated socket
user. It emits `receiveMessage` to the conversation room and to the recipient's
personal room.

### Receive a message

```js
socket.on("receiveMessage", (message) => {
  // update the conversation
});
```

## cURL examples

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"tester","email":"tester@example.com","password":"password123"}'

# Login and capture a token
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"tester@example.com","password":"password123"}' \
  | node -pe "JSON.parse(require('fs').readFileSync(0)).token")

# List users
curl http://localhost:5000/api/users \
  -H "Authorization: Bearer $TOKEN"

# Send a message
curl -X POST http://localhost:5000/api/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"receiver":"<other user id>","text":"Hello"}'
```
