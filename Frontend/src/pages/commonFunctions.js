// commonFunctions.js

import { ENDPOINTS } from "../endpoints";

const logout = async (
  navigate
) => {

  try {

    await fetch(
      ENDPOINTS.AUTHENTICATION.LOGOUT,
      {
        method: "POST",
        credentials: "include",
      }
    );

    localStorage.clear();
    sessionStorage.clear();

    navigate("/", {
      replace: true,
    });

  } catch (err) {

    console.log(err);
  }
};

export default {
  logout,
};