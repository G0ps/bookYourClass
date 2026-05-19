import { useRef, useState } from "react";
import styles from "./Authentication.module.css";

const Authentication = () => {
  const [activeForm, setActiveForm] = useState("signup");

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // ---------------- SIGNUP STATE ----------------

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  // ---------------- SIGNIN STATE ----------------

  const [signinData, setSigninData] = useState({
    identifier: "",
    password: "",
  });

  // ---------------- HANDLERS ----------------

  const handleSignupChange = (e) => {
    setSignupData({
      ...signupData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSigninChange = (e) => {
    setSigninData({
      ...signinData,
      [e.target.name]: e.target.value,
    });
  };

  // ---------------- SUBMIT ----------------

  const handleSignupSubmit = (e) => {
    e.preventDefault();

    console.log("Signup Data :", signupData);

    // API LOGIC HERE LATER
  };

  const handleSigninSubmit = (e) => {
    e.preventDefault();

    console.log("Signin Data :", signinData);

    // API LOGIC HERE LATER
  };

  // ---------------- GOOGLE AUTH ----------------

  const handleGoogleAuth = (type) => {
    console.log(`${type} with Google clicked`);
  };

  // ---------------- SWIPE ----------------

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;

    const swipeDistance =
      touchStartX.current - touchEndX.current;

    // LEFT SWIPE
    if (swipeDistance > 50) {
      setActiveForm("signin");
    }

    // RIGHT SWIPE
    if (swipeDistance < -50) {
      setActiveForm("signup");
    }
  };

  return (
    <div className={styles.authenticationWrapper}>
      <div
        className={styles.authenticationContainer}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* NAVBAR */}

        <div className={styles.navbar}>
          <div
            className={`${styles.slider} ${
              activeForm === "signin"
                ? styles.moveRight
                : ""
            }`}
          />

          <button
            className={`${styles.navButton} ${
              activeForm === "signup"
                ? styles.activeText
                : ""
            }`}
            onClick={() => setActiveForm("signup")}
          >
            Sign Up
          </button>

          <button
            className={`${styles.navButton} ${
              activeForm === "signin"
                ? styles.activeText
                : ""
            }`}
            onClick={() => setActiveForm("signin")}
          >
            Sign In
          </button>
        </div>

        {/* FORM SLIDER */}

        <div className={styles.formsWrapper}>
          <div
            className={`${styles.formsSlider} ${
              activeForm === "signin"
                ? styles.slideLeft
                : ""
            }`}
          >
            {/* SIGNUP */}

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

                <button
                  type="button"
                  className={styles.googleButton}
                  onClick={() =>
                    handleGoogleAuth("Signup")
                  }
                >
                  Continue with Google
                </button>
              </form>
            </div>

            {/* SIGNIN */}

            <div className={styles.formPage}>
              <form
                className={styles.form}
                onSubmit={handleSigninSubmit}
              >
                <h2>Welcome Back</h2>

                <input
                  type="text"
                  name="identifier"
                  placeholder="Email or Phone Number"
                  value={signinData.identifier}
                  onChange={handleSigninChange}
                />

                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={signinData.password}
                  onChange={handleSigninChange}
                />

                <button
                  type="submit"
                  className={styles.submitButton}
                >
                  Login
                </button>

                <button
                  type="button"
                  className={styles.googleButton}
                  onClick={() =>
                    handleGoogleAuth("Signin")
                  }
                >
                  Continue with Google
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authentication;