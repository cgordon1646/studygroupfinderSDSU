import "./ClassBrowser.css";
import "./Global.css";
import sdsuLogo from "../assets/SDSULogo.jpg";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  clearStoredAuth,
  reconcileExpiredAuth,
  syncProfileIfAuthenticated,
  tokenIsAuthenticated,
} from "../auth/session";

interface StudyGroup {
  id: string;
  name: string;
  members: number;
  meetingTime: string;
}

interface Course {
  id: string;
  code: string;
  name: string;
  groups: StudyGroup[];
}

interface Subject {
  name: string;
  courses: Course[];
}

function ClassBrowser() {
  const navigate = useNavigate();
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userMajor, setUserMajor] = useState("");
  const [userYear, setUserYear] = useState("");
  const [userRedId, setUserRedId] = useState("");
  const [showDashboard, setShowDashboard] = useState(false);
  const [joinedGroups, setJoinedGroups] = useState<any[]>([]);

  useEffect(() => {
    const load = () => {
      reconcileExpiredAuth();
      const signedIn = tokenIsAuthenticated();
      setIsSignedIn(signedIn);
      if (signedIn) {
        setUserName(localStorage.getItem("userName") || "");
        setUserEmail(localStorage.getItem("userEmail") || "");
        setUserMajor(localStorage.getItem("userMajor") || "");
        setUserYear(localStorage.getItem("userYear") || "");
        setUserRedId(localStorage.getItem("userRedId") || "");
      } else {
        setUserName("");
        setUserEmail("");
        setUserMajor("");
        setUserYear("");
        setUserRedId("");
      }
    };
    load();
    void syncProfileIfAuthenticated().then(load);
  }, []);

  const handleProfileClick = () => {
    if (isSignedIn) {
      setShowProfile(!showProfile);
    }
  };

  const handleDashboard = () => {
    const groups = JSON.parse(localStorage.getItem("joinedGroups") || "[]");
    setJoinedGroups(groups);
    setShowDashboard(true);
  };

  const handleLeaveGroup = (index: number) => {
    const groups = JSON.parse(localStorage.getItem("joinedGroups") || "[]");
    groups.splice(index, 1);
    localStorage.setItem("joinedGroups", JSON.stringify(groups));
    setJoinedGroups(groups);
  };

  const handleLogout = () => {
    clearStoredAuth();
    setIsSignedIn(false);
    setShowProfile(false);
    navigate("/");
  };

  const handleJoinGroup = (group: StudyGroup) => {
    if (!isSignedIn) {
      navigate("/signin");
    } else {
      // Check if already joined
      const joinedGroups = JSON.parse(localStorage.getItem("joinedGroups") || "[]");
      const alreadyJoined = joinedGroups.some((g: any) => g.id === group.id);
      
      if (alreadyJoined) {
        alert("You've already joined this group!");
        return;
      }

      // Save joined group to localStorage
      const newGroup = {
        id: group.id,
        groupName: group.name,
        courseName: selectedCourse?.name || "Unknown Course",
        courseCode: selectedCourse?.code || "N/A",
        meetingTime: group.meetingTime,
      };
      joinedGroups.push(newGroup);
      localStorage.setItem("joinedGroups", JSON.stringify(joinedGroups));
      alert("You have joined the group!");
    }
  };

  const subjects: Subject[] = [
    {
      name: "Computer Science",
      courses: [
        {
          id: "cs150",
          code: "CS 150",
          name: "Introductory Computer Programming",
          groups: [
            { id: "g1", name: "Anna's Group", members: 4, meetingTime: "Mon 3PM" },
            { id: "g2", name: "Jordan's Group", members: 3, meetingTime: "Wed 5PM" },
          ],
        },
        {
          id: "cs150l",
          code: "CS 150L",
          name: "Introductory Computer Programming Laboratory",
          groups: [
            { id: "g3", name: "Study Team Alpha", members: 5, meetingTime: "Tue 4PM" },
          ],
        },
        {
          id: "cs160",
          code: "CS 160",
          name: "Intermediate Computer Programming",
          groups: [
            { id: "g4", name: "Alex's Group", members: 4, meetingTime: "Mon 5PM" },
            { id: "g5", name: "Issa's Group", members: 3, meetingTime: "Thu 6PM" },
          ],
        },
        {
          id: "cs160l",
          code: "CS 160L",
          name: "Intermediate Computer Programming Laboratory",
          groups: [
            { id: "g6", name: "Code Warriors", members: 4, meetingTime: "Wed 3PM" },
          ],
        },
        {
          id: "cs210",
          code: "CS 210",
          name: "Data Structures",
          groups: [
            { id: "g7", name: "Anna's Group", members: 3, meetingTime: "Tue 5PM" },
            { id: "g8", name: "Chris's Group", members: 4, meetingTime: "Fri 4PM" },
          ],
        },
        {
          id: "cs240",
          code: "CS 240",
          name: "Computer Organization",
          groups: [
            { id: "g9", name: "Jordan's Group", members: 5, meetingTime: "Mon 2PM" },
          ],
        },
        {
          id: "cs250",
          code: "CS 250",
          name: "Introduction to Software Systems",
          groups: [
            { id: "g10", name: "Issa's Group", members: 4, meetingTime: "Wed 4PM" },
            { id: "g11", name: "Andy's Group", members: 3, meetingTime: "Thu 3PM" },
          ],
        },
        {
          id: "cs370",
          code: "CS 370",
          name: "Computer Architecture",
          groups: [
            { id: "g12", name: "Study Group A", members: 3, meetingTime: "Tue 6PM" },
          ],
        },
        {
          id: "cs420",
          code: "CS 420",
          name: "Advanced Programming Languages",
          groups: [
            { id: "g13", name: "Anna's Group", members: 4, meetingTime: "Mon 6PM" },
            { id: "g14", name: "Dev Team", members: 5, meetingTime: "Wed 5PM" },
          ],
        },
        {
          id: "cs450",
          code: "CS 450",
          name: "Introduction to Artificial Intelligence",
          groups: [
            { id: "g15", name: "AI Enthusiasts", members: 4, meetingTime: "Thu 5PM" },
          ],
        },
        {
          id: "cs460",
          code: "CS 460",
          name: "Algorithms",
          groups: [
            { id: "g16", name: "Jordan's Group", members: 6, meetingTime: "Tue 2PM" },
            { id: "g17", name: "Algorithm Masters", members: 4, meetingTime: "Fri 4PM" },
          ],
        },
        {
          id: "cs480",
          code: "CS 480",
          name: "Operating Systems",
          groups: [
            { id: "g18", name: "Systems Group", members: 3, meetingTime: "Mon 4PM" },
          ],
        },
        {
          id: "cs470",
          code: "CS 470",
          name: "UNIX System Administration",
          groups: [
            { id: "g19", name: "Unix Crew", members: 3, meetingTime: "Wed 3PM" },
          ],
        },
        {
          id: "cs503",
          code: "CS 503",
          name: "Scientific Database Techniques",
          groups: [
            { id: "g20", name: "DB Study Group", members: 2, meetingTime: "Thu 4PM" },
          ],
        },
        {
          id: "cs514",
          code: "CS 514",
          name: "Database Theory and Implementation",
          groups: [
            { id: "g21", name: "Database Pros", members: 4, meetingTime: "Tue 5PM" },
          ],
        },
        {
          id: "cs530",
          code: "CS 530",
          name: "Systems Programming",
          groups: [
            { id: "g22", name: "Systems Developers", members: 3, meetingTime: "Wed 6PM" },
          ],
        },
        {
          id: "cs532",
          code: "CS 532",
          name: "Software Engineering",
          groups: [
            { id: "g23", name: "SE Group", members: 5, meetingTime: "Thu 3PM" },
            { id: "g24", name: "Software Team", members: 4, meetingTime: "Sat 10AM" },
          ],
        },
        {
          id: "cs545",
          code: "CS 545",
          name: "Introduction to Web Application Development",
          groups: [
            { id: "g25", name: "Web Dev Squad", members: 6, meetingTime: "Mon 5PM" },
            { id: "g26", name: "Frontend Masters", members: 4, meetingTime: "Fri 3PM" },
          ],
        },
        {
          id: "cs549",
          code: "CS 549",
          name: "Machine Learning",
          groups: [
            { id: "g27", name: "ML Group", members: 4, meetingTime: "Tue 4PM" },
          ],
        },
        {
          id: "cs553",
          code: "CS 553",
          name: "Neural Networks",
          groups: [
            { id: "g28", name: "Neural Net Team", members: 3, meetingTime: "Wed 5PM" },
          ],
        },
        {
          id: "cs556",
          code: "CS 556",
          name: "Robotics",
          groups: [
            { id: "g29", name: "Robotics Club", members: 5, meetingTime: "Thu 6PM" },
          ],
        },
        {
          id: "cs558",
          code: "CS 558",
          name: "Computer Simulation",
          groups: [
            { id: "g30", name: "Simulation Group", members: 2, meetingTime: "Mon 3PM" },
          ],
        },
        {
          id: "cs559",
          code: "CS 559",
          name: "Computer Vision",
          groups: [
            { id: "g31", name: "Vision Lab", members: 3, meetingTime: "Tue 5PM" },
          ],
        },
        {
          id: "cs561",
          code: "CS 561",
          name: "Deep Learning for Natural Language Processing",
          groups: [
            { id: "g32", name: "NLP Team", members: 3, meetingTime: "Wed 6PM" },
          ],
        },
        {
          id: "cs562",
          code: "CS 562",
          name: "Automata Theory",
          groups: [
            { id: "g33", name: "Theory Group", members: 2, meetingTime: "Thu 5PM" },
          ],
        },
        {
          id: "cs572",
          code: "CS 572",
          name: "Microprocessor Architecture",
          groups: [
            { id: "g34", name: "Arch Study", members: 3, meetingTime: "Fri 4PM" },
          ],
        },
        {
          id: "cs574",
          code: "CS 574",
          name: "Computer Security",
          groups: [
            { id: "g35", name: "Cybersecurity Team", members: 4, meetingTime: "Mon 6PM" },
          ],
        },
        {
          id: "cs576",
          code: "CS 576",
          name: "Computer Networks and Distributed Systems",
          groups: [
            { id: "g36", name: "Networks Group", members: 3, meetingTime: "Tue 3PM" },
          ],
        },
        {
          id: "cs577",
          code: "CS 577",
          name: "Principles and Techniques of Data Science",
          groups: [
            { id: "g37", name: "Data Science Club", members: 5, meetingTime: "Wed 4PM" },
          ],
        },
        {
          id: "cs578",
          code: "CS 578",
          name: "Wireless Networks",
          groups: [
            { id: "g38", name: "Wireless Group", members: 2, meetingTime: "Thu 4PM" },
          ],
        },
        {
          id: "cs581",
          code: "CS 581",
          name: "Computational Linguistics",
          groups: [
            { id: "g39", name: "Linguistics Lab", members: 2, meetingTime: "Fri 5PM" },
          ],
        },
        {
          id: "cs582",
          code: "CS 582",
          name: "Introduction to Speech Processing",
          groups: [
            { id: "g40", name: "Speech Team", members: 3, meetingTime: "Mon 4PM" },
          ],
        },
        {
          id: "cs583",
          code: "CS 583",
          name: "3D Game Programming",
          groups: [
            { id: "g41", name: "Game Dev Squad", members: 6, meetingTime: "Tue 5PM" },
          ],
        },
        {
          id: "cs496",
          code: "CS 496",
          name: "Experimental Topics",
          groups: [
            { id: "g42", name: "Experimental Group", members: 2, meetingTime: "Wed 3PM" },
          ],
        },
        {
          id: "cs497",
          code: "CS 497",
          name: "Undergraduate Research Seminar",
          groups: [
            { id: "g43", name: "Research Group", members: 4, meetingTime: "Thu 3PM" },
          ],
        },
        {
          id: "cs596",
          code: "CS 596",
          name: "Advanced Topics in Computer Science",
          groups: [
            { id: "g44", name: "Advanced Study", members: 3, meetingTime: "Fri 3PM" },
          ],
        },
      ],
    },
    {
      name: "Mathematics",
      courses: [
        {
          id: "math150",
          code: "MATH 150",
          name: "Calculus I",
          groups: [
            { id: "gm1", name: "Calculus Team", members: 5, meetingTime: "Mon 3PM" },
            { id: "gm2", name: "Math Squad", members: 4, meetingTime: "Wed 4PM" },
          ],
        },
        {
          id: "math151",
          code: "MATH 151",
          name: "Calculus II",
          groups: [
            { id: "gm3", name: "Calc II Group", members: 4, meetingTime: "Tue 5PM" },
          ],
        },
        {
          id: "math245",
          code: "MATH 245",
          name: "Discrete Mathematics",
          groups: [
            { id: "gm4", name: "Discrete Crew", members: 3, meetingTime: "Thu 4PM" },
          ],
        },
        {
          id: "math254",
          code: "MATH 254",
          name: "Introduction to Linear Algebra",
          groups: [
            { id: "gm5", name: "Linear Algebra Study", members: 4, meetingTime: "Fri 3PM" },
          ],
        },
      ],
    },
    {
      name: "Physics",
      courses: [
        {
          id: "phys195",
          code: "PHYS 195",
          name: "Principles of Physics",
          groups: [
            { id: "gp1", name: "Physics Group", members: 4, meetingTime: "Mon 4PM" },
          ],
        },
        {
          id: "phys195l",
          code: "PHYS 195L",
          name: "Principles of Physics Laboratory",
          groups: [
            { id: "gp2", name: "Physics Lab Team", members: 3, meetingTime: "Wed 3PM" },
          ],
        },
        {
          id: "phys196",
          code: "PHYS 196",
          name: "Principles of Physics II",
          groups: [
            { id: "gp3", name: "Physics II Group", members: 4, meetingTime: "Tue 5PM" },
          ],
        },
        {
          id: "phys196l",
          code: "PHYS 196L",
          name: "Principles of Physics Laboratory II",
          groups: [
            { id: "gp4", name: "Physics Lab II", members: 3, meetingTime: "Thu 4PM" },
          ],
        },
      ],
    },
    {
      name: "Statistics",
      courses: [
        {
          id: "stat250",
          code: "STAT 250",
          name: "Statistical Principles and Practices",
          groups: [
            { id: "gs1", name: "Stats Study", members: 4, meetingTime: "Mon 5PM" },
            { id: "gs2", name: "Statistics Club", members: 3, meetingTime: "Fri 4PM" },
          ],
        },
        {
          id: "stat550",
          code: "STAT 550",
          name: "Applied Probability",
          groups: [
            { id: "gs3", name: "Probability Group", members: 3, meetingTime: "Wed 5PM" },
          ],
        },
      ],
    },
  ];

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
  };

  const toggleSubject = (subjectName: string) => {
    setExpandedSubject(expandedSubject === subjectName ? null : subjectName);
  };

  const routeSignin = () => {
    navigate("/signin");
  };

  const routeHome = () => {
    // Keep authentication when clicking SDSU logo
    navigate("/");
  };

  return (
    <div className="class-browser-page">
      <header className="navbar">
        <div className="logo" onClick={routeHome} style={{ cursor: "pointer" }}>
          <img src={sdsuLogo} alt="Logo" className="logo-img" />
          <span>Study Group Finder</span>
        </div>
        <nav className="nav-links">
          {!isSignedIn && (
            <button className="nav-btn primary" onClick={routeSignin}>
              SIGN IN
            </button>
          )}
          {isSignedIn && (
            <button className="nav-btn" onClick={handleDashboard}>
              Dashboard
            </button>
          )}
          <div style={{ position: "relative" }}>
            <button
              className="nav-prof-btn"
              onClick={handleProfileClick}
              style={{ cursor: isSignedIn ? "pointer" : "default" }}
            >
              <img src="/profileIcon.svg" alt="Profile" className="prof-icon" />
            </button>
            {isSignedIn && showProfile && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  background: "white",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "20px",
                  minWidth: "250px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                  zIndex: 1000,
                  marginTop: "10px",
                }}
              >
                <h3 style={{ margin: "0 0 15px 0", color: "#333" }}>{userName}</h3>
                <div style={{ marginBottom: "10px", fontSize: "0.9rem", color: "#666" }}>
                  <p style={{ margin: "5px 0" }}>
                    <strong>Email:</strong> {userEmail}
                  </p>
                  {userRedId && (
                    <p style={{ margin: "5px 0" }}>
                      <strong>Red ID:</strong> {userRedId}
                    </p>
                  )}
                  <p style={{ margin: "5px 0" }}>
                    <strong>Major:</strong> {userMajor}
                  </p>
                  <p style={{ margin: "5px 0" }}>
                    <strong>Year:</strong> {userYear}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    width: "100%",
                    padding: "10px",
                    background: "#ce1141",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>
      </header>

      <main className="class-browser-main">
        <div className="class-selection-section">
          <h2>Select a Course</h2>
          <div className="subjects-container">
            {subjects.map((subject) => (
              <div key={subject.name} className="subject-dropdown">
                <button
                  className="subject-btn"
                  onClick={() => toggleSubject(subject.name)}
                >
                  {subject.name}
                  <span
                    className={`dropdown-arrow ${
                      expandedSubject === subject.name ? "open" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>

                {expandedSubject === subject.name && (
                  <div className="courses-dropdown">
                    {subject.courses.map((course) => (
                      <button
                        key={course.id}
                        className="course-item"
                        onClick={() => handleCourseSelect(course)}
                      >
                        {course.code} - {course.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {selectedCourse && (
          <div className="groups-section">
            <h3>Study Groups for {selectedCourse.code}</h3>
            <div className="groups-list">
              {selectedCourse.groups.map((group) => (
                <div key={group.id} className="group-card">
                  <h4>{group.name}</h4>
                  <p className="group-info">
                    <span className="info-label">Members:</span> {group.members}
                  </p>
                  <p className="group-info">
                    <span className="info-label">Meeting Time:</span>{" "}
                    {group.meetingTime}
                  </p>
                  <button className="join-btn" onClick={() => handleJoinGroup(group)}>Join Group</button>
                </div>
              ))}
              <div className="create-group-card">
                <h4>Create Your Own Group</h4>
                <p>Don't see a group that fits? Start your own!</p>
                <button className="create-btn">+ Create Group</button>
              </div>
            </div>
          </div>
        )}
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
                You haven't joined any study groups yet.
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
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}>
                    <div>
                      <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>{group.groupName}</h3>
                      <p style={{ margin: "5px 0", color: "#666", fontSize: "0.9rem" }}>
                        <strong>{group.courseCode}</strong> - {group.courseName}
                      </p>
                      <p style={{ margin: "5px 0", color: "#666", fontSize: "0.9rem" }}>
                        <strong>Meeting Time:</strong> {group.meetingTime}
                      </p>
                    </div>
                    <button
                      onClick={() => handleLeaveGroup(index)}
                      style={{
                        background: "#ce1141",
                        color: "white",
                        border: "none",
                        padding: "8px 15px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "0.9rem",
                        whiteSpace: "nowrap",
                        marginLeft: "15px",
                      }}
                    >
                      Leave
                    </button>
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

export default ClassBrowser;
