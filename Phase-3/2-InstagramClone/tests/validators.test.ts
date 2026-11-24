import test from "node:test";
import assert from "node:assert/strict";
import { validateUsername, validateEmail, validatePassword, cleanText, isSafeImageUrl, isObjectId } from "../lib/validators";

test("username validation accepts safe handles", () => {
  assert.equal(validateUsername("maya.khan").valid, true);
  assert.equal(validateUsername("noah_99").valid, true);
});

test("username validation rejects unsafe handles", () => {
  assert.equal(validateUsername("ab").valid, false);
  assert.equal(validateUsername("bad name").valid, false);
  assert.equal(validateUsername(".hidden").valid, false);
  assert.equal(validateUsername("two..dots").valid, false);
});

test("email validation", () => {
  assert.equal(validateEmail("demo@lumen.local").valid, true);
  assert.equal(validateEmail("not-an-email").valid, false);
});

test("password validation", () => {
  assert.equal(validatePassword("short").valid, false);
  assert.equal(validatePassword("long-enough-password").valid, true);
});

test("cleanText strips null bytes and trims", () => {
  assert.equal(cleanText("  hello\u0000 world  "), "hello world");
});

test("image url validation", () => {
  assert.equal(isSafeImageUrl("/uploads/abc123.jpg"), true);
  assert.equal(isSafeImageUrl("https://picsum.photos/seed/a/700/900"), true);
  assert.equal(isSafeImageUrl("javascript:alert(1)"), false);
  assert.equal(isSafeImageUrl("http://insecure.example/a.jpg"), false);
  assert.equal(isSafeImageUrl("/uploads/../secret"), false);
});

test("object id validation", () => {
  assert.equal(isObjectId("507f1f77bcf86cd799439011"), true);
  assert.equal(isObjectId("not-an-id"), false);
});
