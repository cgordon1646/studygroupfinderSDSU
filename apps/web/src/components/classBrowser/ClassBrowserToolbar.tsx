import sdsuLogo from "../../assets/SDSULogo.jpg";
import { useNavigate } from "react-router-dom";
import { ProfileDropdown } from "../ProfileDropdown";

interface ClassBrowserToolbarProps {
  isSignedIn: boolean;
  userName: string;
  userEmail: string;
  userRedId: string;
  userMajor: string;
  userYear: string;
  onLogout: () => void;
  onOpenDashboard: () => void;
}

export function ClassBrowserToolbar({
  isSignedIn,
  userName,
  userEmail,
  userRedId,
  userMajor,
  userYear,
  onLogout,
  onOpenDashboard,
}: ClassBrowserToolbarProps) {
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <div
        className="logo"
        onClick={() => navigate("/")}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            navigate("/");
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Study Group Finder home"
        style={{ cursor: "pointer" }}
      >
        <img src={sdsuLogo} alt="" className="logo-img" aria-hidden />
        <span>Study Group Finder</span>
      </div>
      <nav className="nav-links">
        {!isSignedIn ? (
          <button
            type="button"
            className="nav-btn primary"
            onClick={() =>
              navigate("/signin", { state: { from: "/classes" } })
            }
          >
            Sign in
          </button>
        ) : (
          <button
            type="button"
            className="nav-btn"
            onClick={onOpenDashboard}
          >
            Dashboard
          </button>
        )}
        <ProfileDropdown
          isSignedIn={isSignedIn}
          userName={userName}
          userEmail={userEmail}
          userRedId={userRedId}
          userMajor={userMajor}
          userYear={userYear}
          onLogout={onLogout}
        />
      </nav>
    </header>
  );
}
