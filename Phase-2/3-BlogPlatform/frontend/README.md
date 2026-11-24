# Blog Platform Frontend

React 19 client for the Blog Platform. See the [project README](../README.md) for
the architecture, API reference and backend setup.

## Commands

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
npm run lint
```

## Configuration

The API client defaults to `http://localhost:5000/api` and the image helper
defaults to `http://localhost:5000`. Both are defined in
`src/api/api.js`. Change them there, or set `VITE_API_URL` if the client is
updated to read it.

## Routes

| Route | Purpose |
| --- | --- |
| `/auth` | Signup and login |
| `/home` | Landing page |
| `/posts` | Post list, search and category filter |
| `/blog/:id` | Post detail, comments and likes |
| `/account` | Profile and avatar |
| `/dashboard` | Personal publishing statistics |
| `/about`, `/contact`, `/details` | Information pages |
| `/terms`, `/privacy`, `/cookies` | Legal pages |
| `/disclaimer`, `/acceptable-use`, `/dmca`, `/refund` | Legal pages |
