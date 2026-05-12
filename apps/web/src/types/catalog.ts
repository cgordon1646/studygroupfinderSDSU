export interface StudyGroup {
  id: string;
  name: string;
  members: number;
  meetingTime: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  groups: StudyGroup[];
}

export interface Subject {
  name: string;
  courses: Course[];
}
