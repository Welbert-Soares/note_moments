import { Task, Priority, Prisma } from "@prisma/client";

// ✅ Usando tipos do Prisma que refletem exatamente o schema
export interface CreateTaskData {
  title: string;                                    // obrigatório no schema
  description?: string | null;                      // String? no schema
  dueDate?: Date | null;                            // DateTime? no schema  
  priority?: Priority;                              // enum Priority (padrão MEDIUM)
  pixel_reward?: string | null;                     // String? no schema
}

// ✅ Para updates, usamos o tipo gerado pelo Prisma
export type UpdateTaskData = Prisma.TaskUpdateInput;

// ✅ Filtros tipados conforme o schema
export interface TaskFilters {
  completed?: boolean | undefined;              // Boolean no schema
  priority?: Priority | undefined;              // enum Priority
  overdue?: boolean | undefined;                // computed field baseado em dueDate
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
