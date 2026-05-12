import type { Course, StudyGroup, Subject } from "../../types/catalog";

function subjectPanelId(subjectName: string): string {
  return `subject-courses-${subjectName.replace(/\s+/g, "-").toLowerCase()}`;
}

interface CourseCatalogPanelProps {
  subjects: Subject[];
  expandedSubject: string | null;
  onToggleSubject: (name: string) => void;
  selectedCourse: Course | null;
  onSelectCourse: (course: Course) => void;
  onJoinGroup: (group: StudyGroup) => void;
  onCreateGroupHint: () => void;
}

export function CourseCatalogPanel({
  subjects,
  expandedSubject,
  onToggleSubject,
  selectedCourse,
  onSelectCourse,
  onJoinGroup,
  onCreateGroupHint,
}: CourseCatalogPanelProps) {
  return (
    <main className="class-browser-main">
      <div className="class-selection-section">
        <h2>Select a course</h2>
        <div className="subjects-container">
          {subjects.map((subject) => {
            const expanded = expandedSubject === subject.name;
            const panelId = subjectPanelId(subject.name);
            return (
              <div key={subject.name} className="subject-dropdown">
                <button
                  type="button"
                  className="subject-btn"
                  id={`btn-${panelId}`}
                  aria-expanded={expanded}
                  aria-controls={panelId}
                  onClick={() => onToggleSubject(subject.name)}
                >
                  {subject.name}
                  <span
                    className={`dropdown-arrow ${expanded ? "open" : ""}`}
                    aria-hidden
                  >
                    ▼
                  </span>
                </button>

                {expanded ? (
                  <div
                    className="courses-dropdown"
                    id={panelId}
                    role="region"
                    aria-labelledby={`btn-${panelId}`}
                  >
                    {subject.courses.map((course) => (
                      <button
                        type="button"
                        key={course.id}
                        className={`course-item${
                          selectedCourse?.id === course.id
                            ? " course-item--selected"
                            : ""
                        }`}
                        onClick={() => onSelectCourse(course)}
                      >
                        {course.code} — {course.name}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {selectedCourse ? (
        <div className="groups-section">
          <h3>Study groups for {selectedCourse.code}</h3>
          <div className="groups-list">
            {selectedCourse.groups.map((group) => (
              <div key={group.id} className="group-card">
                <h4>{group.name}</h4>
                <p className="group-info">
                  <span className="info-label">Members:</span> {group.members}
                </p>
                <p className="group-info">
                  <span className="info-label">Meeting time:</span>{" "}
                  {group.meetingTime}
                </p>
                <button
                  type="button"
                  className="join-btn"
                  onClick={() => onJoinGroup(group)}
                >
                  Join group
                </button>
              </div>
            ))}
            <div className="create-group-card">
              <h4>Create your own group</h4>
              <p>Do not see a group that fits? Start your own (coming soon).</p>
              <button
                type="button"
                className="create-btn create-btn--muted"
                onClick={onCreateGroupHint}
              >
                + Create group
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
