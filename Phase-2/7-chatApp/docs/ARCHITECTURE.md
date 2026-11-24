# Chat App Architecture

## Purpose

The chat app demonstrates authenticated real-time messaging. It combines a REST
API for persistence with Socket.IO for delivery and keeps sender identity tied to
the verified token on both paths.

## Message flow

```text
Sender client
├── Optimistic message appears in the list
├── POST /api/messages { receiver, text }
│      ├── authMiddleware extracts sender from JWT
│      ├── validates receiver and text
│      ├── saves the message
│      └── returns the saved document
└── socket.emit("sendMessage", savedMessage)
       └── Socket.IO server verifies sender
            ├── emits to the conversation room
            └── emits to the recipient's personal room

Recipient client
└── socket.on("receiveMessage")
       └── appends the message when the conversation is open
```

The REST call is the source of truth. The socket event only carries the saved
document; it does not write to the database on its own.

## Socket authentication

The client connects with:

```js
io("http://localhost:5000", { auth: { token } });
```

The server verifies the token in an `io.use` middleware and stores the user id on
the socket. A connection without a valid token is rejected.

Two rooms are used:

| Room | Joined when | Purpose |
| --- | --- | --- |
| `user:<id>` | On connection | Deliver messages even when the conversation is closed |
| `<idA>_<idB>` | On `joinRoom` | Conversation-scoped broadcast |

The broadcast uses `socket.to(room)` so the sender does not receive a duplicate
of the message it already rendered optimistically.

## Backend layers

| Layer | Responsibility |
| --- | --- |
| `routes/authRoutes.js` | Registration and login |
| `routes/userRoutes.js` | User list and search |
| `routes/messageRoutes.js` | Conversation history and send |
| `middlewares/authMiddleware.js` | Bearer token verification |
| `middlewares/errorHandler.js` | Error and 404 responses |
| `controllers/` | Validation and persistence |
| `models/` | User and Message schemas |
| `server.js` | HTTP server, Socket.IO, authentication and rooms |

## Frontend services

| Service | Responsibility |
| --- | --- |
| `services/api.js` | Axios instance, auth header, 401 redirect |
| `services/authService.js` | Login, register, session storage |
| `services/userService.js` | User list and search |
| `services/messageService.js` | Conversation history and send |
| `components/Chat.jsx` | User list, conversation, socket lifecycle |

`Chat.jsx` opens a socket when the current user is known and closes it on
unmount. It reconnects when the selected conversation changes so the listener
closure always matches the open conversation.

## Database indexes

| Collection | Index | Reason |
| --- | --- | --- |
| users | `{ username: 1 }` unique | Registration and lookup |
| users | `{ email: 1 }` unique | Login |
| messages | `{ sender: 1, receiver: 1 }` from query | Conversation lookup |

The message query uses an `$or` over both directions. For a large dataset, a
compound index on `(sender, receiver, createdAt)` would be the next optimisation.

## Trade-offs

- No pagination; a conversation loads in full.
- No read receipts or typing indicators.
- No group chat or attachments.
- The socket does not persist messages; the REST request does. This keeps one
  write path but means a failed REST call removes the optimistic message.
- Every registered user is discoverable.
- No automated tests.

## Failure handling

| Failure | Behaviour |
| --- | --- |
| Invalid token on HTTP | `401` |
| Invalid token on socket | Connection rejected |
| Invalid receiver | `400` |
| Sender mismatch on socket | Event ignored |
| Message send failure | Optimistic message removed |
| MongoDB unavailable at startup | Process exits |
