# Testing

## Commands

```bash
npx tsc --noEmit
npm run build
npm test
npm run smoke
```

`npm run smoke` expects MongoDB and the app on port 3002. It logs in as the
seeded customer, places a cash-on-delivery order, toggles a wishlist item and
signs out.

## Covered by unit tests

- username, email and password validation,
- slug rules,
- price parsing and rounding,
- safe image URLs,
- coupon normalization.

## Manual checklist

### Storefront

- Open `/` and `/shop` as a guest.
- Filter by category, search, price and sort.
- Open a product, change the image and add it to the cart.
- Change quantity in the cart and apply `WELCOME10`.
- Place an order as the demo customer.
- Open the order from `/account` and check the timeline.
- Save and remove a wishlist item.
- Submit a review and confirm the product rating updates.

### Admin

- Log in as `admin@voltnest.dev`.
- Confirm revenue, counts and low-stock cards.
- Create a product, edit it and delete it.
- Change an order from processing to shipped.
- Export orders to CSV.
- Confirm a customer account cannot open `/admin` or call an admin API.

### Responsive

- At 390 px, confirm the mobile bottom navigation.
- Check the product, cart and checkout layouts do not overflow.
- Confirm admin tables scroll horizontally on small screens.

## Demo data

- 10 products across 7 categories.
- 2 seeded orders.
- 4 product reviews.
- Coupons `SETUP15` and `WELCOME10`.
