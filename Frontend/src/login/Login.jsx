import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./Login.module.css";
import { ENDPOINTS } from "../endpoints";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const safeRedirect = (role) => {
    console.log("safe redirect role : " , role)
    if (!role || role === "null" || role === "undefined") {
      localStorage.removeItem("role");
      navigate("/");
      return;
    }

    localStorage.setItem("role", role);
    navigate(`/${role}`);
  };

  const handleResponse = (data) => {
    if (data?.status === "success" && data.role) {
      safeRedirect(data.role);
    } else {
      localStorage.removeItem("role");
      navigate("/");
    }
  };

  // AUTO LOGIN
  useEffect(() => {
    const autoLogin = async () => {
      try {
        const response = await fetch(
          ENDPOINTS.AUTHENTICATION.LOGIN,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
          }
        );

        const data = await response.json();
        console.log("data received auto log in : " , data);

        handleResponse(data);
      } catch (error) {
        console.log(error);
        localStorage.removeItem("role");
        navigate("/");
      }
    };

    autoLogin();
  }, [navigate]);

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        ENDPOINTS.AUTHENTICATION.LOGIN,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      console.log("data received : " , data);

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      handleResponse(data);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.loginCard} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Login</h1>

        <div className={styles.inputGroup}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {message && <p className={styles.message}>{message}</p>}
      </form>
    </div>
  );
}