# Architecture

## One deployable application

```text
Browser
  ├── App Router pages (storefront, account, admin)
  ├── AuthContext and CartContext
  └── typed services/ API client
          │
          ▼
Next.js server
  ├── Route Handlers under app/api
  ├── lib/auth.ts        JWT, cookies, admin checks
  ├── lib/validators.ts  input and money rules
  ├── lib/cart.ts        local cart model
  └── models/            Mongoose schemas
          │
          ▼
MongoDB
```

There is no separate Express server. The API and UI share one TypeScript
project and one deployment.

## Main flows

### Browse

`GET /api/products` applies search, category, price and sort filters. Product
detail loads the product, reviews and related items in parallel.

### Cart

The cart lives in `localStorage` through `CartContext`, so a guest can build a
cart without an account. The UI uses it for counts and totals.

### Checkout

`POST /api/orders` is the authority:

1. requires a signed-in user,
2. reloads products from MongoDB,
3. verifies stock,
4. recalculates line totals, discount, shipping and total,
5. validates the coupon,
6. creates the order,
7. decrements stock.

This prevents a browser from changing a price or total.

### Admin

Admin pages call `/api/admin/*`. Every admin route calls `requireAdmin`, which
checks both the session and the `role` field. Hiding the dashboard link in the UI
is not the security boundary.

## Data model

```text
User 1 ─── n Order
User n ─── n Product (wishlist)
Product 1 ─── n Review
Order 1 ─── n OrderItem (embedded snapshot)
Coupon (standalone)
```

Product data is snapshotted into order items so an order keeps the name, price
and image that were purchased even if the catalogue changes later.

## Uploads

Admin image uploads run in the Node runtime, are signature-checked and written
to `public/uploads` with a random filename. Production should replace this with
object storage.

## UI system

The visual language uses CSS custom properties in `app/globals.css`: warm paper,
ink text, lime highlights and cobalt links. Headings use a serif stack while the
interface uses a system sans-serif stack. Components are intentionally small and
reusable: navbar, footer, product card, cart page, admin tables and modal forms.
