import test from "node:test";
import assert from "node:assert/strict";
import { validateEmail, validatePassword, validateSlug, validateUsername, parsePrice, isSafeImageUrl, normalizeCoupon } from "../lib/validators";

test("username rules", () => {
  assert.equal(validateUsername("saad_99").valid, true);
  assert.equal(validateUsername("a").valid, false);
  assert.equal(validateUsername("bad name").valid, false);
});
test("email and password rules", () => {
  assert.equal(validateEmail("saad@voltnest.dev").valid, true);
  assert.equal(validateEmail("nope").valid, false);
  assert.equal(validatePassword("short").valid, false);
  assert.equal(validatePassword("long-enough").valid, true);
});
test("slug and price rules", () => {
  assert.equal(validateSlug("nestbook-air-14").valid, true);
  assert.equal(validateSlug("Bad Slug").valid, false);
  assert.equal(parsePrice("19.999"), 20);
  assert.equal(parsePrice("-2"), -1);
});
test("image URL and coupon normalization", () => {
  assert.equal(isSafeImageUrl("/uploads/a.jpg"), true);
  assert.equal(isSafeImageUrl("http://unsafe.example/a.jpg"), false);
  assert.equal(normalizeCoupon(" setup15! "), "SETUP15");
});
