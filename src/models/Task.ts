// src/models/Task.ts
import { Task, Priority } from "@prisma/client";
import { CreateTaskRequest, UpdateTaskRequest } from "@/types/task";
import { CreateTaskData } from "@/repositories/interfaces/ITaskRepository";

export class TaskModel {
  // ✅ Validações baseadas no schema Prisma
  static validateTitle(title: string): void {
    if (!title?.trim()) {
      throw new Error("Título da tarefa é obrigatório");  // campo obrigatório no schema
    }

    if (title.trim().length > 255) {
      throw new Error("Título deve ter no máximo 255 caracteres");  // limite padrão String
    }

    if (title.trim().length < 3) {
      throw new Error("Título deve ter pelo menos 3 caracteres");   // regra de negócio
    }
  }

  static validateDescription(description: string): void {
    // description é String? no schema, então pode ser null/undefined
    if (description && description.length > 1000) {
      throw new Error("Descrição deve ter no máximo 1000 caracteres");
    }
  }

  static validateDueDate(dueDate: Date): void {
    // dueDate é DateTime? no schema, validação de negócio
    if (isNaN(dueDate.getTime())) {
      throw new Error("Data de vencimento inválida");
    }

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (dueDate < now) {
      throw new Error("Data de vencimento não pode ser no passado");
    }
  }

  static validatePriority(priority: Priority): void {
    // ✅ Usar enum do Prisma diretamente
    const validPriorities: Priority[] = Object.values(Priority);
    if (!validPriorities.includes(priority)) {
      throw new Error(`Prioridade inválida. Use: ${validPriorities.join(', ')}`);
    }
  }

  static validatePixelReward(pixelReward: string): void {
    // pixel_reward é String? no schema
    if (pixelReward && pixelReward.length > 100) {
      throw new Error("Pixel reward deve ter no máximo 100 caracteres");
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
      pixel_reward: task.pixel_reward,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
      isOverdue: this.isOverdue(task),
      priorityWeight: this.getPriorityWeight(task.priority),
      canBeDeleted: this.canBeDeleted(task),
    };
  }

    // ✅ Parsing dos dados do frontend com validações do schema
  static parseCreateData(data: CreateTaskRequest): CreateTaskData {
    // Validações obrigatórias baseadas no schema
    this.validateTitle(data.title);

    if (data.description !== undefined) {
      this.validateDescription(data.description);
    }

    if (data.priority !== undefined) {
      this.validatePriority(data.priority);
    }

    if (data.pixel_reward !== undefined) {
      this.validatePixelReward(data.pixel_reward);
    }

    const dueDate = data.dueDate ? new Date(data.dueDate) : undefined;
    if (dueDate) {
      this.validateDueDate(dueDate);
    }

    // ✅ Retornar objeto tipado conforme CreateTaskData (que reflete o schema)
    const result: CreateTaskData = {
      title: data.title.trim(),
      priority: data.priority || Priority.MEDIUM,  // padrão do schema
    };

    // ✅ Só adicionar campos opcionais se tiverem valor
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

  // ✅ Validar dados de update conforme schema
  static validateUpdateData(data: UpdateTaskRequest): void {
    if (data.title !== undefined) {
      this.validateTitle(data.title);
    }

    if (data.description !== undefined && data.description !== null) {
      this.validateDescription(data.description);
    }

    if (data.priority !== undefined) {
      this.validatePriority(data.priority);
    }

    if (data.pixel_reward !== undefined && data.pixel_reward !== null) {
      this.validatePixelReward(data.pixel_reward);
    }

    if (data.dueDate !== undefined && data.dueDate !== null) {
      // dueDate vem como string do frontend, validamos após conversão
      const dateToValidate = new Date(data.dueDate);
      this.validateDueDate(dateToValidate);
    }

    // completed é Boolean no schema, não precisa validação especial
  }
}
