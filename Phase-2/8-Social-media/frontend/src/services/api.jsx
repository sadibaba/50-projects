
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export const registerUser = async (userData) => {
  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    return { success: res.ok, ...data };
  } catch (error) {
    throw new Error(error.message, { cause: error });
  }
};

export const loginUser = async (credentials) => {
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    throw new Error(error.message,{ cause: error});
  }
};


