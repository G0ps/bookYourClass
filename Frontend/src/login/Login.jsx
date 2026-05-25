// Login.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import { ENDPOINTS } from "../endpoints";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const safeRedirect = (role) => {
    if (!role || role === "null" || role === "undefined") {
      localStorage.removeItem("role");
      return;
    }
    localStorage.setItem("role", role);
    const targetPath = `/${role}`;
    if (window.location.pathname !== targetPath) {
      navigate(targetPath, { replace: true });
    }
  };

  const handleResponse = (data) => {
    if (data?.status === "success" && data.role) {
      safeRedirect(data.role);
    } else {
      localStorage.removeItem("role");
    }
  };

  useEffect(() => {
    if (window.location.pathname !== "/") return;
    const autoLogin = async () => {
      try {
        const response = await fetch(ENDPOINTS.AUTHENTICATION.LOGIN, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });
        const data = await response.json();
        console.log("data received auto log in : ", data);
        handleResponse(data);
      } catch (error) {
        console.log(error);
        localStorage.removeItem("role");
      }
    };
    autoLogin();
  }, []);

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
      const response = await fetch(ENDPOINTS.AUTHENTICATION.LOGIN, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log("data received : ", data);
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
      <div className={styles.backgroundGlow}></div>
      <form className={styles.loginCard} onSubmit={handleSubmit}>
        <div className={styles.headerGroup}>
          <h1 className={styles.title}>Book Your<span>Class</span></h1>
          <p className={styles.subtitle}>Enter your details to access the venue network</p>
        </div>

        <div className={styles.inputGroup}>
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="name@company.com"
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
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? (
            <span className={styles.spinner}></span>
          ) : (
            "Sign In to Network"
          )}
        </button>

        {message && (
          <p className={styles.message}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}