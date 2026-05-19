// src/api/endpoints.js

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
  },

  USER: {
    PROFILE: "/user/profile",
    UPDATE: "/user/update",
  },

  PRODUCTS: {
    GET_ALL: "/products",
    GET_BY_ID: (id) => `/products/${id}`,
  },
};