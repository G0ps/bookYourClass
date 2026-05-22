import { useState } from "react";
import styles from "./Register.module.css";

const Register = () => {
  // ---------------- SIGNUP STATE ----------------

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "student",
    password: "",
  });

  // ---------------- HANDLERS ----------------

  const handleSignupChange = (e) => {
    setSignupData({
      ...signupData,
      [e.target.name]: e.target.value,
    });
  };

  // ---------------- SUBMIT ----------------

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    console.log("Signup Data :", signupData);

    try {
      // API CALL HERE
    } catch (error) {
      console.log(error);
    }
  };

  // ---------------- GOOGLE AUTH ----------------
  return (
    <div className={styles.RegisterWrapper}>
      <div className={styles.RegisterContainer}>
        <div className={styles.formPage}>
          <form
            className={styles.form}
            onSubmit={handleSignupSubmit}
          >
            <h2>Create Account</h2>

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={signupData.name}
              onChange={handleSignupChange}
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={signupData.email}
              onChange={handleSignupChange}
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={signupData.phone}
              onChange={handleSignupChange}
            />

            {/* ROLE DROPDOWN */}

            <select
              name="role"
              value={signupData.role}
              onChange={handleSignupChange}
              className={styles.selectField}
            >
              <option value="student">
                Student
              </option>

              <option value="staff">
                Staff
              </option>
            </select>

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={signupData.password}
              onChange={handleSignupChange}
            />

            <button
              type="submit"
              className={styles.submitButton}
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;