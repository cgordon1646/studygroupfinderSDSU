import { useEffect, useId, useRef, useState } from "react";
import type { JoinedGroupRecord } from "../auth/joinedGroups";
import { useEscapeKey } from "../hooks/useEscapeKey";
import { ChatPanel } from "./ChatPanel";
import "./shared-ui.css";

interface JoinedGroupsModalProps {
  open: boolean;
  onClose: () => void;
  groups: JoinedGroupRecord[];
  onLeave?: (index: number) => void;
  emptyCtaLabel?: string;
  onEmptyCta?: () => void;
  accessToken?: string | null;
}

export function JoinedGroupsModal({
  open,
  onClose,
  groups,
  onLeave,
  emptyCtaLabel,
  onEmptyCta,
  accessToken,
}: JoinedGroupsModalProps) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [selectedGroupIndex, setSelectedGroupIndex] = useState<number | null>(
    null
  );

  useEscapeKey(() => {
    if (selectedGroupIndex !== null) {
      setSelectedGroupIndex(null);
    } else {
      onClose();
    }
  }, open);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const showLeave = typeof onLeave === "function";
  const selectedGroup =
    selectedGroupIndex !== null ? groups[selectedGroupIndex] : null;

  return (
    <div
      className="modal-overlay"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        style={{
          display: "flex",
          flexDirection: "column",
          maxHeight: selectedGroup ? "90vh" : "auto",
        }}
      >
        <div className="modal-header">
          <h2 className="modal-title" id={titleId}>
            {selectedGroup ? `${selectedGroup.groupName} - Chat` : "My study groups"}
          </h2>
          <button
            ref={closeRef}
            type="button"
            className="modal-close"
            onClick={() => {
              if (selectedGroupIndex !== null) {
                setSelectedGroupIndex(null);
              } else {
                onClose();
              }
            }}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {selectedGroup ? (
          <div style={{ flex: 1, overflow: "hidden" }}>
            <ChatPanel
              groupId={selectedGroup.id}
              groupName={selectedGroup.groupName}
              accessToken={accessToken || null}
            />
          </div>
        ) : groups.length === 0 ? (
          <div className="modal-empty">
            <p>You have not joined any study groups yet.</p>
            {emptyCtaLabel && onEmptyCta ? (
              <button
                type="button"
                className="modal-primary-btn"
                onClick={() => {
                  onClose();
                  onEmptyCta();
                }}
              >
                {emptyCtaLabel}
              </button>
            ) : null}
          </div>
        ) : (
          <div style={{ overflowY: "auto" }}>
            {groups.map((group, index) => (
              <div key={`${group.id}-${index}`} className="joined-group-row">
                <div style={{ cursor: "pointer", flex: 1 }}
                     onClick={() => setSelectedGroupIndex(index)}>
                  <h3>{group.groupName}</h3>
                  <p>
                    <strong>{group.courseCode}</strong> — {group.courseName}
                  </p>
                  <p>
                    <strong>Meeting time:</strong> {group.meetingTime}
                  </p>
                </div>
                {showLeave ? (
                  <button
                    type="button"
                    className="joined-group-leave"
                    onClick={() => onLeave!(index)}
                  >
                    Leave
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
