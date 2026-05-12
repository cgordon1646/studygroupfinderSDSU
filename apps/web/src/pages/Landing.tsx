import "./Landing.css";
import "./Global.css";
import sdsuLogo from "../assets/SDSULogo.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthSession } from "../hooks/useAuthSession";
import { loadJoinedGroups, removeJoinedGroupAt } from "../auth/joinedGroups";
import { ProfileDropdown } from "../components/ProfileDropdown";
import { JoinedGroupsModal } from "../components/JoinedGroupsModal";

function LandingPage() {
  const navigate = useNavigate();
  const {
    isSignedIn,
    userName,
    userEmail,
    userMajor,
    userYear,
    userRedId,
    logout,
  } = useAuthSession({ listenStorage: true });

  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [joinedGroups, setJoinedGroups] = useState(() => loadJoinedGroups());

  const openDashboard = () => {
    setJoinedGroups(loadJoinedGroups());
    setDashboardOpen(true);
  };

  const handleLeave = (index: number) => {
    setJoinedGroups(removeJoinedGroupAt(index));
  };

  const handleLogout = () => {
    logout();
    setDashboardOpen(false);
  };

  return (
    <div className="landing-page">
      <header className="navbar">
        <Link to="/" className="logo logo-link" aria-label="Study Group Finder home">
          <img src={sdsuLogo} alt="" className="logo-img" aria-hidden />
          <span>Study Group Finder</span>
        </Link>
        <nav className="nav-links">
          <button
            type="button"
            className="nav-btn"
            onClick={() => navigate("/classes")}
          >
            Browse classes
          </button>
          {isSignedIn ? (
            <button type="button" className="nav-btn" onClick={openDashboard}>
              Dashboard
            </button>
          ) : null}
          {!isSignedIn ? (
            <button
              type="button"
              className="nav-btn primary"
              onClick={() => navigate("/signin")}
            >
              Sign in
            </button>
          ) : null}
          <ProfileDropdown
            isSignedIn={isSignedIn}
            userName={userName}
            userEmail={userEmail}
            userRedId={userRedId}
            userMajor={userMajor}
            userYear={userYear}
            onLogout={handleLogout}
          />
        </nav>
      </header>

      <main className="hero">
        <div className="hero-content">
          <h1>Forming connections</h1>
          <p>
            Find classmates and study groups for your SDSU courses in one place.
          </p>
          <button
            type="button"
            className="cta-btn"
            onClick={() => navigate("/classes")}
          >
            Find study groups
          </button>
        </div>
      </main>

      <JoinedGroupsModal
        open={dashboardOpen}
        onClose={() => setDashboardOpen(false)}
        groups={joinedGroups}
        onLeave={handleLeave}
        emptyCtaLabel="Browse study groups"
        onEmptyCta={() => navigate("/classes")}
      />
    </div>
  );
}

export default LandingPage;
