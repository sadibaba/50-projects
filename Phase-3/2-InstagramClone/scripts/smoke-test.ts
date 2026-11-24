const BASE = process.env.BASE_URL || "http://localhost:3001";
let cookie = "";

async function call(path: string, options: RequestInit = {}) {
  const response = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(cookie ? { cookie } : {}),
      ...(options.headers || {}),
    },
  });
  const setCookie = response.headers.get("set-cookie");
  if (setCookie) cookie = setCookie.split(";")[0];
  const body = await response.json().catch(() => ({}));
  return { status: response.status, body };
}

async function main() {
  const health = await call("/api/health");
  console.log("health", health.status);

  const register = await call("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({
      username: `smoke_${Date.now()}`,
      email: `smoke_${Date.now()}@lumen.local`,
      password: "password123",
    }),
  });
  console.log("register", register.status);
  if (register.status !== 201) throw new Error("registration failed");

  const feed = await call("/api/posts?scope=explore&limit=3");
  console.log("feed", feed.status, Array.isArray(feed.body.posts) ? feed.body.posts.length : 0);

  const created = await call("/api/posts", {
    method: "POST",
    body: JSON.stringify({
      imageUrl: "https://picsum.photos/seed/smoke/700/900",
      caption: "Smoke test post",
      altText: "A smoke test image",
      tags: ["test"],
    }),
  });
  console.log("create post", created.status);
  if (created.status !== 201) throw new Error("post creation failed");

  const like = await call(`/api/posts/${created.body._id}/like`, { method: "PUT" });
  console.log("like", like.status, like.body.liked);

  const comment = await call(`/api/posts/${created.body._id}/comments`, {
    method: "POST",
    body: JSON.stringify({ text: "Smoke comment" }),
  });
  console.log("comment", comment.status);

  const search = await call("/api/search?q=smoke");
  console.log("search", search.status, search.body.posts?.length || 0);

  const logout = await call("/api/auth/logout", { method: "POST" });
  console.log("logout", logout.status);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
