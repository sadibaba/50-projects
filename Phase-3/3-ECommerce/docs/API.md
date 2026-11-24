# VoltNest API

Base URL: `http://localhost:3002/api`. Authentication uses the HttpOnly
`vn_token` cookie. Errors return `{ "error": "message" }`.

## Auth

### POST `/auth/register`

```json
{ "username": "saad", "email": "saad@example.com", "password": "password123", "name": "Saad" }
```

Returns `201` with the public user and sets the cookie.

### POST `/auth/login`

```json
{ "email": "customer@voltnest.dev", "password": "demo12345" }
```

### GET `/auth/me`

Returns `{ "user": null }` for guests or the current user.

### PATCH `/auth/profile`

Requires authentication. Accepts `name`, `phone` and `address`.

### POST `/auth/logout`

Clears the session cookie.

## Products

### GET `/products`

Query parameters: `q`, `category`, `brand`, `min`, `max`, `featured=1`,
`sort` (`new`, `price-asc`, `price-desc`, `rating`), `page`, `limit`.

```json
{
  "products": [
    {
      "_id": "...",
      "name": "NestBook Air 14",
      "slug": "nestbook-air-14",
      "category": "Laptops",
      "price": 1199,
      "compareAt": 1349,
      "images": ["https://..."],
      "stock": 14,
      "rating": 4.5,
      "reviewsCount": 2,
      "featured": true,
      "specs": [{ "label": "Memory", "value": "16 GB" }]
    }
  ],
  "page": 1,
  "total": 10,
  "hasMore": false
}
```

### GET `/products/[slug]`

Returns `{ product, reviews, related }`.

### GET `/categories`

Returns `[{ "name": "Laptops", "count": 2 }]`.

## Orders

### POST `/orders`

Requires authentication.

```json
{
  "items": [{ "productId": "...", "quantity": 1 }],
  "coupon": "WELCOME10",
  "paymentMethod": "card",
  "address": {
    "line1": "12 Gulberg Lane",
    "city": "Lahore",
    "postalCode": "54000",
    "country": "Pakistan"
  }
}
```

The server reloads every product, verifies stock, recalculates prices, applies
the coupon and creates the order. The client price is never trusted.

### GET `/orders`

Returns the current user's orders. Admins receive all orders.

### GET `/orders/[id]`

Owner or admin only.

## Reviews

### POST `/reviews`

Requires authentication.

```json
{ "productId": "...", "rating": 5, "text": "Excellent build quality." }
```

One review per customer per product. The product rating is recalculated.

## Wishlist

### GET `/wishlist`

Returns the saved products.

### PUT `/wishlist`

```json
{ "productId": "..." }
```

Toggles the product and returns `{ "saved": true }`.

## Coupons

### POST `/coupons/validate`

```json
{ "code": "WELCOME10", "subtotal": 500 }
```

Returns `{ "code", "percent", "discount" }` or an error when expired, invalid
or below the minimum order.

## Admin

All admin endpoints require a user with `role: "admin"`.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/admin/stats` | Revenue, counts, low stock, top sellers, recent orders |
| GET | `/admin/products` | All products |
| POST | `/admin/products` | Create a product |
| PUT | `/admin/products/[id]` | Update a product |
| DELETE | `/admin/products/[id]` | Delete a product |
| GET | `/admin/orders` | All orders |
| PATCH | `/admin/orders/[id]` | Set order status |
| POST | `/upload` | Upload a product image |

Product payload:

```json
{
  "name": "NestBook Air 14",
  "slug": "nestbook-air-14",
  "category": "Laptops",
  "brand": "VoltNest",
  "description": "A quiet laptop.",
  "price": 1199,
  "compareAt": 1349,
  "stock": 14,
  "featured": true,
  "images": ["https://images.unsplash.com/..."],
  "specs": [{ "label": "Memory", "value": "16 GB" }]
}
```

### POST `/upload`

`multipart/form-data` with field `image`. JPEG, PNG, WebP or GIF, maximum 8 MB.
Files are checked by MIME type and magic bytes.
