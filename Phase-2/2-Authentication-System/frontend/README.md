# Authentication System Frontend

React client for the Authentication System. See the
[project README](../README.md) for architecture and API details.

## Commands

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
npm run lint
```

## Configuration

Vite proxies `/api` to `http://localhost:5000` in development. The Axios client
uses a relative `/api` base URL, so no environment variable is required for local
development.

## Routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | Public | Landing page |
| `/login` | Public | Sign in |
| `/signup` | Public | Create an account |
| `/profile` | Authenticated | Profile and password |
| `/admin` | Admin | User management |
