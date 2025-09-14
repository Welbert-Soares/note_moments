import { Task as PrismaTask, Priority } from "@prisma/client";

export type Task = PrismaTask;
export { Priority };

// ✅ Interface para entrada de dados (do frontend)
export interface CreateTaskRequest {
  title: string;                                    // obrigatório no schema
  description?: string;                             // opcional no schema (String?)
  priority?: Priority;                              // enum Priority, opcional (padrão MEDIUM)
  dueDate?: string;                                 // string ISO para conversão para DateTime?
  pixel_reward?: string;                            // opcional no schema (String?)
}

// ✅ Interface para atualização (todos opcionais exceto validações específicas)
export interface UpdateTaskRequest {
  title?: string;                                   // String no schema (se fornecido, não pode ser vazio)
  description?: string | null;                      // String? no schema (pode ser null)
  completed?: boolean;                              // Boolean no schema (padrão false)
  dueDate?: string | null;                          // DateTime? no schema (pode ser null)
  priority?: Priority;                              // enum Priority
  pixel_reward?: string | null;                     // String? no schema (pode ser null)
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}