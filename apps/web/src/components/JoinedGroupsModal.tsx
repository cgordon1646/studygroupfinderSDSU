import { useEffect, useId, useRef } from "react";
import type { JoinedGroupRecord } from "../auth/joinedGroups";
import { useEscapeKey } from "../hooks/useEscapeKey";
import "./shared-ui.css";

interface JoinedGroupsModalProps {
  open: boolean;
  onClose: () => void;
  groups: JoinedGroupRecord[];
  onLeave?: (index: number) => void;
  emptyCtaLabel?: string;
  onEmptyCta?: () => void;
}

export function JoinedGroupsModal({
  open,
  onClose,
  groups,
  onLeave,
  emptyCtaLabel,
  onEmptyCta,
}: JoinedGroupsModalProps) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEscapeKey(onClose, open);

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
      >
        <div className="modal-header">
          <h2 className="modal-title" id={titleId}>
            My study groups
          </h2>
          <button
            ref={closeRef}
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {groups.length === 0 ? (
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
          <div>
            {groups.map((group, index) => (
              <div key={`${group.id}-${index}`} className="joined-group-row">
                <div>
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
