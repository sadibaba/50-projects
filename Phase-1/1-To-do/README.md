# To-do Dashboard

A personal dashboard that combines a three-column task board, a live clock, a
month calendar, project shortcuts, notes and a small media panel.

## Features

- Live analogue clock with hour, minute and second hands.
- Task board with three columns: To-do, In progress and Finished.
- Add tasks to any column, move tasks between columns with a click, and delete
  them through a context menu.
- Task counts per column.
- Tasks persist in `localStorage`.
- Dynamic calendar for the current month with date selection.
- Project, direction and note lists that can be extended from the interface.
- Local video and audio files in the `stuff` directory.
- Responsive layout: the sidebar stacks above the board on smaller screens.

## Tech stack

- HTML
- Tailwind CSS browser build
- Remix Icon
- Vanilla JavaScript
- `localStorage`

## Running

```bash
cd "1-To-do"
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## How it works

| Area | Implementation |
| --- | --- |
| Clock | `setInterval` updates hand rotations every second |
| Tasks | `tasks` object with `todo`, `progress` and `finished` arrays |
| Persistence | Tasks are serialised to `localStorage` on every render |
| Calendar | Generated for the current month at page load |
| Media | Native `<video>` and `<audio>` elements with local files |

## Known limitations

- Tasks, notes and projects are added through a small modal form.
- The profile name, tagline and banner images are demo content and must be
  edited in `index.html`.
- The calendar shows dates but does not store events yet.
- The media panel uses files from the `stuff` folder; keep that folder beside
  `index.html` when deploying.
- External background images require an internet connection.
- There is no backend or multi-device sync.

## Possible improvements

- Store calendar events and notes in `localStorage`.
- Add drag and drop to the task board.
- Replace the external background images with local assets.

## License

MIT
