const BASE_URL = import.meta.env.VITE_BACKEND_URL_BASE;
const TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 10000;

/*
 * Generic API handler
 */

const apiRequest = async (
  endpoint,
  {
    method = "GET",
    body = null,
    headers = {},
    token = null,
  } = {}
) => {
  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, TIMEOUT);

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,

      headers: {
        "Content-Type": "application/json",
        ...(token && {
          Authorization: `Bearer ${token}`,
        }),
        ...headers,
      },

      body: body ? JSON.stringify(body) : null,

      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "API Request Failed");
    }

    return data;
  } catch (error) {
    console.error("API ERROR:", error.message);

    throw error;
  }
};

/*
 * HTTP Methods
 */

export const GET = (endpoint, options = {}) =>
  apiRequest(endpoint, {
    method: "GET",
    ...options,
  });

export const POST = (endpoint, body, options = {}) =>
  apiRequest(endpoint, {
    method: "POST",
    body,
    ...options,
  });

export const PUT = (endpoint, body, options = {}) =>
  apiRequest(endpoint, {
    method: "PUT",
    body,
    ...options,
  });

export const PATCH = (endpoint, body, options = {}) =>
  apiRequest(endpoint, {
    method: "PATCH",
    body,
    ...options,
  });

export const DELETE = (endpoint, options = {}) =>
  apiRequest(endpoint, {
    method: "DELETE",
    ...options,
  });