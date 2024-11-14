export interface Task {
  id: string;
  name: string;
  completed: boolean;
  progress: number;
}

export interface Course {
  id: string;
  name: string;
  tasks: Task[];
}