import { Task as PrismaTask, Priority } from "@prisma/client";

export type Task = PrismaTask;
export { Priority };

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority?: "LOW" | "MEDIUM" | "HIGH";
  dueDate?: string;
  pixel_reward?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  completed?: boolean;
  dueDate?: string;
  priority?: "LOW" | "MEDIUM" | "HIGH";
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}