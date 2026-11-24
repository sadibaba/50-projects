# Notes App Frontend

React client for the Notes App. See the [project README](../README.md) for the
API reference and backend setup.

## Commands

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
npm run lint
```

## Configuration

The API base URL defaults to `http://localhost:5000/api`. Override it with
`VITE_API_URL` in a `.env` file.

## Routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/login` | Public | Sign in |
| `/register` | Public | Create an account |
| `/dashboard` | Authenticated | Counts, recent notes and tags |
| `/notes` | Authenticated | Note list, filter and editor |
| `/profile` | Authenticated | Profile, password and account deletion |

## State

`AuthContext` owns the user and token. `NoteContext` owns notes, tags and the
selected tag filter. Both are provided at the application root.
