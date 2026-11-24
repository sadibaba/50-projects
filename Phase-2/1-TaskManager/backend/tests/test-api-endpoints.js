const BASE_URL = "http://localhost:5000/api";

let token = "";
let email = "";

const request = async (path, options = {}) => {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const body = await response.json().catch(() => ({}));
  return { status: response.status, body };
};

const timed = async (label, fn) => {
  const startedAt = Date.now();
  const result = await fn();
  console.log(`${label}: ${result.status} in ${Date.now() - startedAt}ms`);
  return result;
};

async function run() {
  email = `test_${Date.now()}@example.com`;

  const register = await timed("POST /users/register", () =>
    request("/users/register", {
      method: "POST",
      body: JSON.stringify({
        name: "Test User",
        email,
        password: "password123",
      }),
    })
  );
  token = register.body.token;

  await timed("POST /users/login", () =>
    request("/users/login", {
      method: "POST",
      body: JSON.stringify({ email, password: "password123" }),
    })
  );

  const auth = { Authorization: `Bearer ${token}` };

  const created = await timed("POST /tasks", () =>
    request("/tasks", {
      method: "POST",
      headers: auth,
      body: JSON.stringify({
        title: "API test task",
        description: "Created by tests/test-api-endpoints.js",
        priority: "medium",
      }),
    })
  );

  await timed("GET /tasks", () => request("/tasks", { headers: auth }));

  const taskId = created.body._id;

  if (taskId) {
    await timed("PUT /tasks/:id", () =>
      request(`/tasks/${taskId}`, {
        method: "PUT",
        headers: auth,
        body: JSON.stringify({ status: "completed" }),
      })
    );

    await timed("DELETE /tasks/:id", () =>
      request(`/tasks/${taskId}`, { method: "DELETE", headers: auth })
    );
  }
}

run().catch((error) => {
  console.error("API test failed:", error.message);
  process.exit(1);
});
