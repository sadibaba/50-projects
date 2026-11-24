# Social Media Chat Architecture

## Purpose

The project demonstrates a real-time messaging module with presence and typing
indicators. It shares the authentication and persistence ideas of the Chat App
but uses a different socket event model and an in-memory presence map.

## What this project is and is not

It is a working one-to-one chat application.

It is not a complete social network. The original folder name suggests a broader
product, but posts, feeds, follows and likes were never implemented. The
documentation states that explicitly so the scope is not overstated.

## Request and socket flow

```text
Client connects
├── fetch /api/auth/me
├── fetch /api/auth/users
├── fetch /api/messages/chat-users
└── socket connect with auth.token
        ├── server verifies JWT
        ├── onlineUsers.set(userId, socketId)
        └── broadcast online-users

Send message
├── socket.emit("private-message", { receiverId, message })
├── server validates and saves Message
├── if recipient online: io.to(receiverSocket).emit("new-message", populated)
└── socket.emit("message-sent", populated)

Typing
├── socket.emit("typing", { receiverId, isTyping })
└── if recipient online: io.to(receiverSocket).emit("user-typing", ...)
```

## Backend layers

| Layer | Responsibility |
| --- | --- |
| `routes/auth.routes.js` | Register, login, current user, user list |
| `routes/message.routes.js` | Chat users, history, send |
| `middlewares/auth.middleware.js` | Bearer token verification |
| `services/auth.service.js` | Validation, hashing and token creation |
| `controllers/message.controller.js` | Validation, persistence, populated responses |
| `sockets/socket.js` | JWT handshake, presence, messages, typing |
| `utils/http.js` | `ApiError` and `asyncHandler` |

## Presence model

`onlineUsers` is a `Map<userId, socketId>` held in the Node process. It is
updated on connection and disconnect and broadcast as an array.

Consequences:

- Presence resets when the server restarts.
- Multiple instances would each have a partial view.
- A user with multiple tabs overwrites their socket id with the newest
  connection.

For production, presence belongs in a shared store and should support multiple
connections per user.

## Frontend structure

`Home.jsx` owns the current user, the user list, the selected conversation and
the online-user list. It opens the socket once on mount and cleans it up on
unmount. `Chat.jsx` loads history through `getMessage`, listens for
`new-message`, `user-typing` and `message-sent`, and emits typing and private
message events.

The socket URL and API base URL are configurable through Vite environment
variables.

## Security

- Passwords are hashed with bcrypt.
- Tokens are required for HTTP and socket connections.
- The socket derives the sender from the verified token.
- Receiver ids are validated as ObjectIds.
- Self-messaging is rejected.
- Message text is trimmed and capped at 4000 characters.
- CORS origins are configurable.

## Trade-offs

- Presence is process-local.
- Message reads are not marked as read, even though the field exists.
- There is no pagination or search.
- The frontend uses fetch and has limited error handling.
- There are no automated tests.
- The project name is broader than the implemented scope; this document is the
  source of truth for what exists.

## Failure handling

| Failure | Behaviour |
| --- | --- |
| Invalid HTTP token | `401` |
| Invalid socket token | Connection rejected |
| Missing receiver or message | `400` |
| Invalid receiver id | `400` |
| Receiver not found | `404` |
| Self-message | `400` |
| Socket message error | `message-error` event |
| MongoDB unavailable at startup | Process exits |
