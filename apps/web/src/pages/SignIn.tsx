import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignIn.css";
import "./Global.css";
import sdsuLogo from "../assets/SDSULogo.jpg";

function SignIn() {
  const router = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Test account validation
    if (email === "test@sdsu.edu" && password === "test123") {
      // Store authentication in localStorage
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userName", "Test User");
      localStorage.setItem("userMajor", "Computer Science");
      localStorage.setItem("userYear", "Junior");
      router("/classes");
    } else {
      setErrorMessage("Invalid email or password. Please try test@sdsu.edu / test123");
    }
  };

  const routeSignin = () => {
    router("/signin");
  };

  return (
    <div className="signin-container">
      <header className="navbar">
        <div
          className="logo"
          onClick={() => router("/")}
          style={{ cursor: "pointer" }}
        >
          <img src={sdsuLogo} alt="Logo" className="logo-img" />
          <span>Study Group Finder</span>
        </div>
        <nav className="nav-links">
          <button className="nav-btn">Classes</button>
          <button className="nav-btn">Dashboard</button>
          <button className="nav-btn primary" onClick={routeSignin}>
            SIGN IN
          </button>
          <button
            className="nav-prof-btn"
            onClick={() => window.location.reload()}
          >
            <img src="/profileIcon.svg" alt="Profile" className="prof-icon" />
          </button>
        </nav>
      </header>

      <main className="signin-content">
        <form className="signin-form" onSubmit={handleSignIn}>
          <h2>Sign In</h2>
          {errorMessage && <p style={{ color: "red", fontSize: "0.9rem", marginBottom: "1rem" }}>{errorMessage}</p>}
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="signin-btn">
            SIGN IN
          </button>
          <p className="form-footer">
            Don't have an account?{" "}
            <span onClick={() => router("/")}>Create Account</span>
          </p>
        </form>
      </main>
    </div>
  );
}

export default SignIn;
