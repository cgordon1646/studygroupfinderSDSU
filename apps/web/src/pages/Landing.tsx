import "./Landing.css";
import "./Global.css";
import sdsuLogo from "../assets/SDSULogo.jpg";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function LandingPage() {
  const navigate = useNavigate();
  const [showDashboard, setShowDashboard] = useState(false);
  const [joinedGroups, setJoinedGroups] = useState<any[]>([]);

  const routeSignin = () => {
    navigate("/signin");
  };

  const routeClassBrowser = () => {
    // Clear authentication when navigating from home to browse classes
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userMajor");
    localStorage.removeItem("userYear");
    navigate("/classes");
  };

  const handleDashboard = () => {
    const groups = JSON.parse(localStorage.getItem("joinedGroups") || "[]");
    setJoinedGroups(groups);
    setShowDashboard(true);
  };

  return (
    <div className="landing-page">
      <header className="navbar">
        <div className="logo">
          <img src={sdsuLogo} alt="Logo" className="logo-img" />
          <span>Study Group Finder</span>
        </div>
        <nav className="nav-links">
          <button className="nav-btn" onClick={routeClassBrowser}>
            Browse Classes
          </button>
          <button className="nav-btn" onClick={handleDashboard}>Dashboard</button>
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

      <main className="hero">
        <div className="hero-content">
          <h1>FORMING CONNECTIONS</h1>
          <p>Be able to connect with your peers much easier and faster.</p>
          <button className="cta-btn" onClick={routeClassBrowser}>
            Find Study Groups
          </button>
        </div>
      </main>

      {showDashboard && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2000,
        }}>
          <div style={{
            background: "white",
            borderRadius: "12px",
            padding: "30px",
            maxWidth: "600px",
            maxHeight: "80vh",
            overflow: "auto",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ margin: 0, color: "#ce1141" }}>My Study Groups</h2>
              <button onClick={() => setShowDashboard(false)} style={{
                background: "none",
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
                color: "#999",
              }}>×</button>
            </div>

            {joinedGroups.length === 0 ? (
              <p style={{ color: "#666", textAlign: "center", padding: "40px 0" }}>
                You haven't joined any study groups yet. <br />
                <button onClick={() => { setShowDashboard(false); routeClassBrowser(); }} style={{
                  background: "#ce1141",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  marginTop: "20px",
                  fontWeight: "600",
                }}>
                  Browse Study Groups
                </button>
              </p>
            ) : (
              <div>
                {joinedGroups.map((group, index) => (
                  <div key={index} style={{
                    padding: "15px",
                    marginBottom: "15px",
                    background: "#f9f9f9",
                    borderLeft: "4px solid #ce1141",
                    borderRadius: "4px",
                  }}>
                    <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>{group.groupName}</h3>
                    <p style={{ margin: "5px 0", color: "#666", fontSize: "0.9rem" }}>
                      <strong>{group.courseCode}</strong> - {group.courseName}
                    </p>
                    <p style={{ margin: "5px 0", color: "#666", fontSize: "0.9rem" }}>
                      <strong>Meeting Time:</strong> {group.meetingTime}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
