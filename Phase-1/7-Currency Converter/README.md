# Currency Converter

A currency converter with live exchange rates from the free open.er-api.com
service.

## Features

- Amount input with decimal support.
- Fourteen common currencies, including USD, PKR, EUR, GBP, INR and AED.
- Convert button, Enter key support and automatic conversion when the currency
  changes.
- Swap button that reverses the source and target currencies.
- Live rate line and converted result.
- Error and loading feedback.
- Responsive single-column layout.

## Tech stack

- HTML
- Tailwind CSS browser build
- Remix Icon
- Vanilla JavaScript
- open.er-api.com

## Running

```bash
cd "7-Currency Converter"
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## API

```text
https://open.er-api.com/v6/latest/<base currency>
```

The response contains a `rates` object used for conversion. No key is required
for the free endpoint.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Converter form and result card |
| `index.js` | Currency list, rate fetching, conversion and swapping |

## Known limitations

- Rates are refreshed only when the base currency changes or the page reloads;
  there is no scheduled refresh.
- The currency list is fixed in the source.
- The service provides daily rates, not intraday trading rates.
- There is no offline cache.

## License

MIT
