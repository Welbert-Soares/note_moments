import { Task, Priority } from "@prisma/client";

export interface CreateTaskData {
  title: string;
  description?: string | null; 
  dueDate?: Date | null; 
  priority?: Priority;
  pixel_reward?: string | null; 
}

export interface UpdateTaskData {
  title?: string;
  description?: string | null; 
  completed?: boolean;
  dueDate?: Date | null; 
  priority?: Priority;
  pixel_reward?: string | null; 
}

export interface TaskFilters {
  completed?: boolean | undefined; 
  priority?: Priority | undefined; 
  overdue?: boolean | undefined; 
}

export interface ITaskRepository {
  create(data: CreateTaskData): Promise<Task>;
  findById(id: string): Promise<Task | null>;
  findAll(filters?: TaskFilters): Promise<Task[]>;
  update(id: string, data: UpdateTaskData): Promise<Task | null>;
  delete(id: string): Promise<boolean>;
  count(filters?: TaskFilters): Promise<number>;
  findByTitle(title: string): Promise<Task | null>;
}
