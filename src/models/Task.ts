// src/models/Task.ts
import { Task, Priority } from "@prisma/client";
import { CreateTaskRequest } from "@/types/task";

export class TaskModel {
  // Validações de negócio
  static validateTitle(title: string): void {
    if (!title?.trim()) {
      throw new Error("Título da tarefa é obrigatório");
    }

    if (title.trim().length > 255) {
      throw new Error("Título deve ter no máximo 255 caracteres");
    }

    if (title.trim().length < 3) {
      throw new Error("Título deve ter pelo menos 3 caracteres");
    }
  }

  static validateDueDate(dueDate: Date): void {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Zera horário para comparar apenas data

    if (dueDate < now) {
      throw new Error("Data de vencimento não pode ser no passado");
    }
  }

  static validatePriority(priority: string): void {
    const validPriorities = ["LOW", "MEDIUM", "HIGH"];
    if (!validPriorities.includes(priority)) {
      throw new Error("Prioridade inválida. Use: LOW, MEDIUM ou HIGH");
    }
  }

  // Regras de negócio
  static isOverdue(task: Task): boolean {
    return task.dueDate ? task.dueDate < new Date() && !task.completed : false;
  }

  static canBeDeleted(task: Task): boolean {
    // Regra: apenas tarefas não completadas podem ser deletadas
    return !task.completed;
  }

  static getPriorityWeight(priority: Priority): number {
    const weights = { LOW: 1, MEDIUM: 2, HIGH: 3 };
    return weights[priority] || 2;
  }

  // Formatação para response
  static formatForResponse(task: Task) {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      completed: task.completed,
      priority: task.priority,
      dueDate: task.dueDate?.toISOString(),
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
      isOverdue: this.isOverdue(task),
      priorityWeight: this.getPriorityWeight(task.priority),
      canBeDeleted: this.canBeDeleted(task),
    };
  }

  // Parsing dos dados do frontend
  static parseCreateData(data: CreateTaskRequest) {
    // Validações
    this.validateTitle(data.title);

    if (data.priority) {
      this.validatePriority(data.priority);
    }

    const dueDate = data.dueDate ? new Date(data.dueDate) : undefined;
    if (dueDate) {
      this.validateDueDate(dueDate);
    }

    // ✅ Criar objeto apenas com propriedades que têm valor
    const result: any = {
      title: data.title.trim(),
      priority: (data.priority as Priority) || Priority.MEDIUM,
    };

    // ✅ Só adicionar se tiver valor
    if (data.description?.trim()) {
      result.description = data.description.trim();
    }

    if (dueDate) {
      result.dueDate = dueDate;
    }

    if (data.pixel_reward?.trim()) {
      result.pixel_reward = data.pixel_reward.trim();
    }

    return result;
  }
}
