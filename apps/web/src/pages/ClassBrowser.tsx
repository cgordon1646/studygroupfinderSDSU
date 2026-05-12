import "./ClassBrowser.css";
import "./Global.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthSession } from "../hooks/useAuthSession";
import { useToast } from "../hooks/useToast";
import { MOCK_SUBJECTS } from "../data/mockCatalog";
import type { Course, StudyGroup } from "../types/catalog";
import {
  addJoinedGroup,
  isAlreadyJoined,
  loadJoinedGroups,
  removeJoinedGroupAt,
} from "../auth/joinedGroups";
import { ClassBrowserToolbar } from "../components/classBrowser/ClassBrowserToolbar";
import { CourseCatalogPanel } from "../components/classBrowser/CourseCatalogPanel";
import { JoinedGroupsModal } from "../components/JoinedGroupsModal";
import { Toast } from "../components/Toast";

function ClassBrowser() {
  const navigate = useNavigate();
  const {
    isSignedIn,
    userName,
    userEmail,
    userMajor,
    userYear,
    userRedId,
    logout,
  } = useAuthSession();
  const { message, showToast, dismiss } = useToast();

  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [joinedGroups, setJoinedGroups] = useState(() => loadJoinedGroups());

  const openDashboard = () => {
    setJoinedGroups(loadJoinedGroups());
    setDashboardOpen(true);
  };

  const handleLeaveGroup = (index: number) => {
    setJoinedGroups(removeJoinedGroupAt(index));
  };

  const handleLogout = () => {
    logout();
    setDashboardOpen(false);
    navigate("/");
  };

  const handleJoinGroup = (group: StudyGroup) => {
    if (!isSignedIn) {
      navigate("/signin", { state: { from: "/classes" } });
      return;
    }
    if (!selectedCourse) return;
    if (isAlreadyJoined(group.id)) {
      showToast("You are already in this group.");
      return;
    }
    setJoinedGroups(addJoinedGroup(group, selectedCourse));
    showToast(`Joined “${group.name}”.`);
  };

  const toggleSubject = (subjectName: string) => {
    setExpandedSubject((prev) => (prev === subjectName ? null : subjectName));
  };

  return (
    <div className="class-browser-page">
      <ClassBrowserToolbar
        isSignedIn={isSignedIn}
        userName={userName}
        userEmail={userEmail}
        userRedId={userRedId}
        userMajor={userMajor}
        userYear={userYear}
        onLogout={handleLogout}
        onOpenDashboard={openDashboard}
      />

      <CourseCatalogPanel
        subjects={MOCK_SUBJECTS}
        expandedSubject={expandedSubject}
        onToggleSubject={toggleSubject}
        selectedCourse={selectedCourse}
        onSelectCourse={setSelectedCourse}
        onJoinGroup={handleJoinGroup}
        onCreateGroupHint={() =>
          showToast("Group creation from the app is not available yet.")
        }
      />

      <JoinedGroupsModal
        open={dashboardOpen}
        onClose={() => setDashboardOpen(false)}
        groups={joinedGroups}
        onLeave={handleLeaveGroup}
      />

      <Toast message={message} onDismiss={dismiss} />
    </div>
  );
}

export default ClassBrowser;
