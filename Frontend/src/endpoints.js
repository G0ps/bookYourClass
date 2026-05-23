const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const ENDPOINTS = {
  AUTHENTICATION: {
    LOGIN: `${BASE_URL}/authentication/login`,
    LOGOUT: `${BASE_URL}/authentication/logout`,
  },

  BOOKING: {
    POST: `${BASE_URL}/booking`,
  },

  USER: {
    GET: `${BASE_URL}/user`,
    PATCH: `${BASE_URL}/user`,
    DELETE: `${BASE_URL}/user`,
  },

  VENUE: {
    GET: `${BASE_URL}/venue`,
    POST: `${BASE_URL}/venue/add`,
    PATCH: (id) => `${BASE_URL}/venue/${id}`,
    PUT: (id) => `${BASE_URL}/venue/${id}`,
    DELETE: (id) => `${BASE_URL}/venue/${id}`,
  },
  BOOKING: {
    GET: `${BASE_URL}/booking`,
    PATCH: `${BASE_URL}/booking`,
  },
};