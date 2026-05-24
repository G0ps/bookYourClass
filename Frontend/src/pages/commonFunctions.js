const handleLogout = async () => {
    try {
      await fetch(ENDPOINTS.AUTHENTICATION.LOGOUT, {
        method: "POST",
        credentials: "include",
      }).then(data => {
        localStorage.clear();
        sessionStorage.clear();

        window.history.replaceState(null, "", "/");

        navigate("/", { replace: true });
        return;
      });
    } catch (err) {
      console.log(err);
    }
  };

  export default {handleLogout}