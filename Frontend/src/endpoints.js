const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const ENDPOINTS = {
  AUTHENTICATION: {
    LOGIN: `${BASE_URL}/authentication/login`,
    LOGOUT : `${BASE_URL}/authentication/logout`,
  },
  BOOKING : {
    POST : `${BASE_URL}/booking`,
  }
};