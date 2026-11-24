# Video Game Quiz

A ten-question multiple-choice quiz that fetches video-game questions from the
Open Trivia Database.

## Features

- Ten questions per round.
- Shuffled answers for every question.
- Immediate feedback with the correct answer highlighted.
- Running score and progress bar.
- Next-question flow and a final score screen.
- Play-again action.
- Loading, error and retry states.
- Responsive layout for mobile and desktop.

## Tech stack

- HTML
- Tailwind CSS browser build
- Vanilla JavaScript
- OpenTDB API

## Running

```bash
cd "3-Quiz-web"
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## API

The app requests:

```text
https://opentdb.com/api.php?amount=10&category=15&type=multiple
```

HTML entities in questions and answers are decoded before display.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Quiz shell, progress and controls |
| `index.js` | Fetching, shuffling, scoring and rendering |
| `img/bg.jpg` | Background image |

## Known limitations

- The quiz depends on OpenTDB availability and its rate limits.
- There is no category or difficulty selector.
- Scores are not saved between sessions.
- The background image is local; the rest of the styling comes from the CDN.

## License

MIT
