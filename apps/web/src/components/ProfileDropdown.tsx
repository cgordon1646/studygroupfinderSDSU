import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useClickOutside } from "../hooks/useClickOutside";
import "./shared-ui.css";

interface ProfileDropdownProps {
  isSignedIn: boolean;
  userName: string;
  userEmail: string;
  userRedId: string;
  userMajor: string;
  userYear: string;
  onLogout: () => void;
}

export function ProfileDropdown({
  isSignedIn,
  userName,
  userEmail,
  userRedId,
  userMajor,
  userYear,
  onLogout,
}: ProfileDropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useClickOutside(rootRef, () => setOpen(false), open);

  const handleToggle = () => {
    if (!isSignedIn) {
      navigate("/signin", { state: { from: location.pathname } });
      return;
    }
    setOpen((v) => !v);
  };

  const handleLogout = () => {
    setOpen(false);
    onLogout();
  };

  return (
    <div className="profile-dropdown-root" ref={rootRef}>
      <button
        type="button"
        className="nav-prof-btn"
        onClick={handleToggle}
        aria-label={
          isSignedIn ? "Account menu" : "Sign in (opens sign-in page)"
        }
        aria-expanded={isSignedIn ? open : undefined}
        aria-haspopup={isSignedIn ? "menu" : undefined}
      >
        <img
          src="/profileIcon.svg"
          alt=""
          className="prof-icon"
          aria-hidden
        />
      </button>
      {isSignedIn && open && (
        <div
          className="profile-dropdown-panel"
          role="region"
          aria-label="Account"
        >
          <h3>{userName || "Account"}</h3>
          <div className="profile-dropdown-meta">
            <p>
              <strong>Email:</strong> {userEmail}
            </p>
            {userRedId ? (
              <p>
                <strong>Red ID:</strong> {userRedId}
              </p>
            ) : null}
            <p>
              <strong>Major:</strong> {userMajor}
            </p>
            <p>
              <strong>Year:</strong> {userYear}
            </p>
          </div>
          <button
            type="button"
            className="profile-dropdown-logout"
            onClick={handleLogout}
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
