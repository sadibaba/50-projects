# Task Manager Frontend

React 19 client for the Task Manager. See the [project README](../README.md) for
the full architecture, API reference and setup instructions.

## Commands

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run preview  # preview the production build
npm run lint
```

## Configuration

The API base URL defaults to `http://localhost:5000/api`. Override it with
`VITE_API_URL` in a `.env` file.

## Main routes

| Route | Purpose |
| --- | --- |
| `/login` | Sign in |
| `/register` | Create an account |
| `/forgot` | Request a password reset |
| `/reset-password/:token` | Set a new password |
| `/` | Planner board (requires a session) |
| `/profile` | Account, security, preferences and data export |
