# Social Media Chat Frontend

React client for the Social Media Chat project. See the
[project README](../README.md) for the API reference and backend setup.

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
| `VITE_API_BASE_URL` | `http://localhost:3000/api` | REST base URL |
| `VITE_SOCKET_URL` | `http://localhost:3000` | Socket.IO base URL |

## Routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/login` | Public | Sign in |
| `/register` | Public | Create an account |
| `/home` | Authenticated | Dashboard, users, profile and chat |

## Main components

- `components/Home.jsx` owns the socket lifecycle, presence list and selected
  user.
- `components/Chat.jsx` renders the conversation and sends messages.
- `services/api.jsx` is a fetch-based API client.
- `services/socket.js` creates and disconnects the Socket.IO client.
