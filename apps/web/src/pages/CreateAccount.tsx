import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateAccount.css";
import "./Global.css";
import sdsuLogo from "../assets/SDSULogo.jpg";
import { normalizeAccountEmail, signUp } from "../auth/session";

const SDSU_EMAIL_RE =
  /^[a-zA-Z0-9._%+-]+@sdsu\.edu$/i;
const RED_ID_RE = /^\d{9}$/;
const GRAD_YEAR_RE = /^\d{4}$/;
const PASSWORD_MIN_LEN = 8;

function validateSdsuEmail(raw: string): string | null {
  const trimmed = raw.trim().toLowerCase();
  if (!trimmed || !SDSU_EMAIL_RE.test(trimmed)) {
    return "Enter a valid @sdsu.edu email address.";
  }
  return null;
}

function CreateAccount() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [redId, setRedId] = useState("");
  const [major, setMajor] = useState("");
  const [gradYear, setGradYear] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const routeSignin = () => navigate("/signin");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const fn = firstName.trim();
    const ln = lastName.trim();
    if (!fn || !ln) {
      setErrorMessage("Please enter your first and last name.");
      return;
    }

    const emailErr = validateSdsuEmail(email);
    if (emailErr) {
      setErrorMessage(emailErr);
      return;
    }
    const emailNorm = normalizeAccountEmail(email);

    const ridDigits = redId.trim();
    if (!RED_ID_RE.test(ridDigits)) {
      setErrorMessage("Red ID must be exactly 9 digits.");
      return;
    }

    const majorValue = major.trim();
    if (!majorValue) {
      setErrorMessage("Please enter your major.");
      return;
    }

    const gradYearValue = gradYear.trim();
    if (!GRAD_YEAR_RE.test(gradYearValue)) {
      setErrorMessage("Graduation year must be a 4-digit year.");
      return;
    }

    if (password.length < PASSWORD_MIN_LEN) {
      setErrorMessage(`Password must be at least ${PASSWORD_MIN_LEN} characters.`);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Password and confirm password must match.");
      return;
    }

    try {
      await signUp({
        email: emailNorm,
        password,
        first_name: fn,
        last_name: ln,
        red_id: ridDigits,
        major: majorValue,
        academic_year: gradYearValue,
      });
      navigate("/classes");
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Could not create account. Please try again.";
      setErrorMessage(
        msg.includes("Failed to fetch")
          ? "Cannot reach the server. Start the API (see apps/api/README) and try again."
          : msg,
      );
    }
  };

  return (
    <div className="signin-container">
      <header className="navbar">
        <div
          className="logo"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          <img src={sdsuLogo} alt="Logo" className="logo-img" />
          <span>Study Group Finder</span>
        </div>
        <nav className="nav-links">
          <button type="button" className="nav-btn" onClick={() => navigate("/classes")}>
            Classes
          </button>
          <button type="button" className="nav-btn primary" onClick={routeSignin}>
            SIGN IN
          </button>
          <button
            type="button"
            className="nav-prof-btn"
            onClick={() => navigate("/")}
            aria-label="Home"
          >
            <img src="/profileIcon.svg" alt="" className="prof-icon" />
          </button>
        </nav>
      </header>

      <main className="signin-content">
        <form className="signin-form signup-form" onSubmit={handleSubmit}>
          <h2>Create Account</h2>
          {errorMessage ? (
            <p className="form-message--error" role="alert">
              {errorMessage}
            </p>
          ) : null}

          <div className="signup-names-row">
            <div className="input-group">
              <label htmlFor="firstName">First name</label>
              <input
                id="firstName"
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="lastName">Last name</label>
              <input
                id="lastName"
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="signup-email">SDSU email</label>
            <input
              type="email"
              id="signup-email"
              autoComplete="email"
              placeholder="you@sdsu.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="redId">Red ID (9 digits)</label>
            <input
              type="text"
              id="redId"
              inputMode="numeric"
              autoComplete="off"
              placeholder="012345678"
              pattern="\d{9}"
              maxLength={9}
              value={redId}
              onChange={(e) => setRedId(e.target.value.replace(/\D/g, "").slice(0, 9))}
              required
            />
          </div>

          <div className="signup-details-row">
            <div className="input-group">
              <label htmlFor="major">Major</label>
              <input
                id="major"
                autoComplete="organization-title"
                placeholder="Computer Science"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="gradYear">Graduation year</label>
              <input
                type="text"
                id="gradYear"
                inputMode="numeric"
                autoComplete="off"
                placeholder={String(currentYear + 2)}
                pattern="\d{4}"
                maxLength={4}
                value={gradYear}
                onChange={(e) => setGradYear(e.target.value.replace(/\D/g, "").slice(0, 4))}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="signup-password">Password</label>
            <input
              type="password"
              id="signup-password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={PASSWORD_MIN_LEN}
            />
          </div>

          <div className="input-group">
            <label htmlFor="confirm-password">Confirm password</label>
            <input
              type="password"
              id="confirm-password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={PASSWORD_MIN_LEN}
            />
          </div>

          <button type="submit" className="signin-btn">
            Create Account
          </button>
          <p className="form-footer">
            Already have an account?{" "}
            <button
              type="button"
              className="form-footer-link"
              onClick={routeSignin}
            >
              Sign in
            </button>
          </p>
        </form>
      </main>
    </div>
  );
}

export default CreateAccount;
