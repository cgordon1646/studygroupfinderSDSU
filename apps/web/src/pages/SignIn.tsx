import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignIn.css";
import "./Global.css";
import sdsuLogo from "../assets/SDSULogo.jpg";
import { signIn } from "../auth/session";

function SignIn() {
  const router = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      await signIn(email, password);
      router("/classes");
    } catch (err) {
      const raw =
        err instanceof Error
          ? err.message
          : "Sign in failed. Please try again.";
      setErrorMessage(
        raw.includes("Failed to fetch")
          ? "Cannot reach the server. Start the API (see apps/api/README) and try again."
          : raw ||
              "Invalid email or password. Try the demo account test@sdsu.edu / test123.",
      );
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
          <button type="button" className="nav-btn" onClick={() => router("/classes")}>
            Classes
          </button>
          <button type="button" className="nav-btn" onClick={() => router("/signup")}>
            Create Account
          </button>
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
            <button
              type="button"
              className="form-footer-link"
              onClick={() => router("/signup")}
            >
              Create Account
            </button>
          </p>
        </form>
      </main>
    </div>
  );
}

export default SignIn;
