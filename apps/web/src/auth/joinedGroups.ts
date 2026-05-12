import type { Course, StudyGroup } from "../types/catalog";

const JOINED_GROUPS_KEY = "joinedGroups";

export interface JoinedGroupRecord {
  id: string;
  groupName: string;
  courseName: string;
  courseCode: string;
  meetingTime: string;
}

export function loadJoinedGroups(): JoinedGroupRecord[] {
  try {
    const raw = localStorage.getItem(JOINED_GROUPS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (g): g is JoinedGroupRecord =>
        typeof g === "object" &&
        g !== null &&
        typeof (g as JoinedGroupRecord).id === "string",
    );
  } catch {
    return [];
  }
}

export function saveJoinedGroups(groups: JoinedGroupRecord[]): void {
  localStorage.setItem(JOINED_GROUPS_KEY, JSON.stringify(groups));
}

export function isAlreadyJoined(groupId: string): boolean {
  return loadJoinedGroups().some((g) => g.id === groupId);
}

export function addJoinedGroup(
  group: StudyGroup,
  course: Course | null,
): JoinedGroupRecord[] {
  const list = loadJoinedGroups();
  if (list.some((g) => g.id === group.id)) return list;
  const record: JoinedGroupRecord = {
    id: group.id,
    groupName: group.name,
    courseName: course?.name ?? "Unknown course",
    courseCode: course?.code ?? "—",
    meetingTime: group.meetingTime,
  };
  list.push(record);
  saveJoinedGroups(list);
  return list;
}

export function removeJoinedGroupAt(index: number): JoinedGroupRecord[] {
  const list = loadJoinedGroups();
  list.splice(index, 1);
  saveJoinedGroups(list);
  return list;
}
