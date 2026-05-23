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
    GET: `${BASE_URL}/users`,
    PATCH: `${BASE_URL}/users`,
    DELETE: `${BASE_URL}/users`,
  },

  VENUE: {
    GET: `${BASE_URL}/venues`,
    POST: `${BASE_URL}/venues/add`,
    PATCH: (id) => `${BASE_URL}/venues/${id}`,
    PUT: (id) => `${BASE_URL}/venues/${id}`,
    DELETE: (id) => `${BASE_URL}/venues/${id}`,
  },
  BOOKING: {
    GET: `${BASE_URL}/booking`,
    PATCH: `${BASE_URL}/booking`,
  },
};