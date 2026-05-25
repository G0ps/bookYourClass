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

  const handleUnauthorizedAccess = async(navigate) => {
    
    await logout(navigate);
    localStorage.clear();
    sessionStorage.clear();

    window.history.replaceState(null, "", "/");

    navigate("/", { replace: true });
  };

export default {
  logout,
  handleUnauthorizedAccess,
};