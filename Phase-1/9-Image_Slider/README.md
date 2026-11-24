# Image Gallery

A searchable image gallery with a large preview, thumbnails and keyboard
navigation.

## Features

- Large image preview with title and location caption.
- Thumbnail strip with the active image highlighted.
- Previous and next buttons.
- Left and right arrow key navigation.
- Search filters thumbnails by title, location or description.
- Empty-state message when no images match.
- Responsive layout with a horizontally scrollable thumbnail strip.

## Tech stack

- HTML
- Tailwind CSS browser build
- Vanilla JavaScript
- Unsplash images

## Running

```bash
cd "9-Image_Slider"
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Preview, caption, search and thumbnails |
| `index.js` | Selection, navigation, filtering and keyboard handling |

## How the search works

Each thumbnail stores `data-title`, `data-location` and `data-alt`. The search
input lowercases the query and compares it with those values. Matching
thumbnails remain visible; the others are hidden with the `hidden` attribute.

## Known limitations

- Images are loaded from Unsplash URLs and require a connection.
- There is no upload or local image support.
- The image list is fixed in the HTML.
- Captions are short by design; there is no detail view.

## License

MIT
