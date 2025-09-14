// src/services/TaskService.ts
import { Task } from "@prisma/client";

import {
  ITaskRepository,
  TaskFilters,
} from "@/repositories/interfaces/ITaskRepository";
import { TaskModel } from "@/models/Task";
import { CreateTaskRequest, UpdateTaskRequest } from "@/types/task";

export class TaskService {
  private taskRepository: ITaskRepository;

  constructor(taskRepository: ITaskRepository) {
    this.taskRepository = taskRepository;
  }

  async createTask(data: CreateTaskRequest): Promise<Task> {
    // Validações de negócio usando Model
    const parsedData = TaskModel.parseCreateData(data);

    // Verificar duplicatas (regra de negócio)
    const existingTask = await this.taskRepository.findByTitle(
      parsedData.title
    );
    if (existingTask && !existingTask.completed) {
      throw new Error("Já existe uma tarefa pendente com este título");
    }

    // Criar através do repository
    return await this.taskRepository.create(parsedData);
  }

  async getTasks(filters?: TaskFilters): Promise<Task[]> {
    return await this.taskRepository.findAll(filters);
  }

  async getTaskById(id: string): Promise<Task | null> {
    return await this.taskRepository.findById(id);
  }

  async updateTask(id: string, data: UpdateTaskRequest): Promise<Task | null> {
    // Verificar se existe
    const existingTask = await this.taskRepository.findById(id);
    if (!existingTask) {
      return null;
    }

    // Validações se fornecidas
    const updateData: any = {};

    if (data.title !== undefined) {
      TaskModel.validateTitle(data.title);
      updateData.title = data.title.trim();
    }

    if (data.description !== undefined) {
      updateData.description = data.description?.trim() || null;
    }

    if (data.completed !== undefined) {
      updateData.completed = data.completed;
    }

    if (data.priority !== undefined) {
      TaskModel.validatePriority(data.priority);
      updateData.priority = data.priority;
    }

    if (data.dueDate !== undefined) {
      const dueDate = data.dueDate ? new Date(data.dueDate) : null;
      if (dueDate) {
        TaskModel.validateDueDate(dueDate);
      }
      updateData.dueDate = dueDate;
    }

    return await this.taskRepository.update(id, updateData);
  }

  async deleteTask(id: string): Promise<boolean> {
    // Verificar se pode ser deletada (regra de negócio)
    const task = await this.taskRepository.findById(id);
    if (!task) {
      return false;
    }

    if (!TaskModel.canBeDeleted(task)) {
      throw new Error("Tarefas completadas não podem ser deletadas");
    }

    return await this.taskRepository.delete(id);
  }

  // Métodos de negócio mais complexos
  async getTaskStats() {
    const [total, completed, pending, overdue] = await Promise.all([
      this.taskRepository.count(),
      this.taskRepository.count({ completed: true }),
      this.taskRepository.count({ completed: false }),
      this.taskRepository.count({ overdue: true }),
    ]);

    return { total, completed, pending, overdue };
  }

  async markTaskAsCompleted(id: string): Promise<Task | null> {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      return null;
    }

    if (task.completed) {
      throw new Error("Tarefa já está completada");
    }

    return await this.taskRepository.update(id, { completed: true });
  }

  async getOverdueTasks(): Promise<Task[]> {
    return await this.taskRepository.findAll({ overdue: true });
  }

  async duplicateTask(id: string): Promise<Task> {
    const originalTask = await this.taskRepository.findById(id);
    if (!originalTask) {
      throw new Error("Tarefa não encontrada");
    }

    return await this.taskRepository.create({
      title: `${originalTask.title} (Cópia)`,
      description: originalTask.description,
      priority: originalTask.priority,
      dueDate: originalTask.dueDate,
    });
  }
}
