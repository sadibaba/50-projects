# VoltNest

VoltNest is a full-stack electronics store and owner dashboard built with
Next.js, TypeScript and MongoDB. It is a single application: the storefront,
account area, admin dashboard and API all live in the same Next.js project.

The design is intentionally editorial rather than marketplace-like: warm paper,
deep ink, electric lime and a small curated catalogue. The goal is a store that
feels considered, not endless.

**Author and owner:** Saad

## Highlights

### Storefront

- Editorial landing page with featured products and new arrivals.
- Shop with category filters, price range, search, sorting and pagination.
- Product detail with image gallery, specs, stock, rating and related products.
- Persistent cart stored on the device and validated again by the server.
- Coupon codes with minimum-order rules.
- Checkout with shipping address and card-demo or cash-on-delivery payment.
- Server-side order validation: prices, stock and totals are recalculated in the
  API rather than trusted from the browser.
- Wishlist for signed-in customers.
- Customer account with profile, saved address and order history.
- Order confirmation page with a delivery progress timeline.
- Product reviews with one review per customer per product.
- Low-stock indicators and responsive mobile navigation.

### Owner dashboard

- Revenue, order, product and customer counts.
- Low-stock list and top-selling products.
- Product create, edit and delete.
- Order status workflow: processing, packed, shipped, delivered, cancelled.
- CSV export of orders.
- Product image upload with file validation.
- Admin-only API routes, enforced on the server.

### Extra details

- Demo coupon codes: `SETUP15` (15% over $400) and `WELCOME10` (10% over $100).
- Free delivery over $199.
- Two-year warranty, 30-day returns and delivery notes in the product page.
- Accessible labels, focus states and mobile-friendly layouts.
- No third-party analytics or ad scripts.

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 App Router |
| Language | TypeScript |
| UI | React 19 and custom CSS |
| API | Next.js Route Handlers under `app/api` |
| Database | MongoDB with Mongoose |
| Auth | JWT in an HttpOnly cookie |
| Passwords | bcrypt, 12 rounds |
| Images | Unsplash for the seeded catalogue, local uploads for admin |
| Notifications | react-hot-toast |
| Tests | Node test runner through `tsx` |

## Getting started

### Requirements

- Node.js 20.9 or newer
- MongoDB 6 or newer
- npm 9 or newer

### Install

```bash
cd Phase-3/3-ECommerce
cp .env.example .env.local
npm install
```

Set `MONGO_URI`, `JWT_SECRET` and `NEXT_PUBLIC_APP_URL` in `.env.local`.

### Seed

```bash
npm run seed
```

The seed is idempotent and exits early if products already exist.

### Run

```bash
npm run dev
```

Open `http://localhost:3002`.

### Demo accounts

```text
Customer: customer@voltnest.dev / demo12345
Admin:    admin@voltnest.dev    / admin12345
```

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `MONGO_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Token signing secret |
| `NEXT_PUBLIC_APP_URL` | Recommended | Origin allowed by the same-origin check |
| `NODE_ENV` | No | Enables secure cookies in production |

## Routes

| Page | Purpose |
| --- | --- |
| `/` | Landing and featured products |
| `/shop` | Catalogue with filters and search |
| `/product/[slug]` | Product detail and reviews |
| `/cart` | Cart, coupon and totals |
| `/checkout` | Address and payment |
| `/order/[id]` | Order confirmation and tracking |
| `/account` | Profile, address and order history |
| `/wishlist` | Saved products |
| `/admin` | Owner dashboard, products and orders |
| `/login`, `/register` | Authentication |

## API overview

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| GET | `/api/health` | No | Health check |
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Log in |
| POST | `/api/auth/logout` | No | Clear session |
| GET | `/api/auth/me` | Optional | Current user |
| PATCH | `/api/auth/profile` | Yes | Update name, phone and address |
| GET | `/api/products` | No | Search, filter and paginate products |
| GET | `/api/products/[slug]` | No | Product, reviews and related items |
| GET | `/api/categories` | No | Category counts |
| POST | `/api/orders` | Yes | Validate and place an order |
| GET | `/api/orders` | Yes | Own orders, or all orders for admins |
| GET | `/api/orders/[id]` | Yes | Order detail |
| POST | `/api/reviews` | Yes | Add or update a review |
| GET/PUT | `/api/wishlist` | Yes | Read or toggle saved products |
| POST | `/api/coupons/validate` | No | Validate a coupon |
| GET | `/api/admin/stats` | Admin | Dashboard metrics |
| GET/POST | `/api/admin/products` | Admin | List or create products |
| PUT/DELETE | `/api/admin/products/[id]` | Admin | Edit or delete a product |
| GET | `/api/admin/orders` | Admin | All orders |
| PATCH | `/api/admin/orders/[id]` | Admin | Update order status |
| POST | `/api/upload` | Admin | Upload a product image |

Detailed request and response examples are in [docs/API.md](docs/API.md).

## Verification

- `npx tsc --noEmit`: pass.
- `npm run build`: pass.
- `npm test`: validation tests pass.
- API checks against MongoDB: products, login, wishlist, coupon, checkout,
  order history and admin stats.
- Storefront and dashboard pages return HTTP 200 in production mode.

## Known limitations

- Card payments are simulated. No real payment provider is connected.
- Product image uploads use local disk; production should use object storage.
- Rate limiting is in memory and is not shared across instances.
- Search uses regular expressions; a larger catalogue should use a search index.
- There is no email verification, password reset or transactional email.
- There is no content moderation or product question/answer system.
- Coupons are validated server-side but have no per-customer usage limit.
- Order cancellation does not automatically restore stock.

## Roadmap

- Stripe checkout and webhooks.
- Object storage and image resizing.
- Email receipts and shipping notifications.
- Per-customer coupon limits and expiry notifications.
- Product variants and a compare tray.
- PWA install and offline wishlist.

## License

MIT. Copyright (c) 2026 Saad.

## Documentation

- [API reference](docs/API.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Security](docs/SECURITY.md)
- [Testing](docs/TESTING.md)
- [Product notes](docs/PRODUCT.md)
