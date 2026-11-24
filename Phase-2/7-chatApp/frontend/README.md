# Chat App Frontend

React client for the Chat App. See the [project README](../README.md) for the API
reference and backend setup.

## Commands

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
npm run lint
```

## Configuration

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_API_URL` | `http://localhost:5000/api` | REST base URL |
| `VITE_SOCKET_URL` | `http://localhost:5000` | Socket.IO base URL |

## Routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/login` | Public | Sign in |
| `/register` | Public | Create an account |
| `/chat` | Authenticated | User list and conversation |

## Main components

- `components/Chat.jsx` owns the selected user, messages, socket connection and
  optimistic send flow.
- `services/messageService.js` wraps the conversation and send endpoints.
- `services/authService.js` stores the token and the current user.
