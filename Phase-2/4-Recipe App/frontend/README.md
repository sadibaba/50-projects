# Recipe App Frontend

React client for the Recipe App. See the [project README](../README.md) for the
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

## Main routes

| Route | Purpose |
| --- | --- |
| `/` | Search, filters and recipe grid |
| `/recipe` | Selected recipe detail |

The favourites bar appears above the content when at least one favourite exists.
The storage-mode label below the navigation reports whether favourites are being
read from MongoDB or from the browser cache.
