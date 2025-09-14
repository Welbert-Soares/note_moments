// src/services/TaskService.ts
import { Task, Prisma } from "@prisma/client";

import {
  ITaskRepository,
  TaskFilters,
  UpdateTaskData,
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
    const existingTask = await this.taskRepository.findById(id);
    if (!existingTask) {
      return null;
    }

    const updateData: Prisma.TaskUpdateInput = {};

    TaskModel.validateUpdateData(data);

    if (data.title !== undefined) {
      updateData.title = data.title.trim();
    }

    if (data.description !== undefined) {
      updateData.description = data.description?.trim() || null;
    }

    if (data.completed !== undefined) {
      updateData.completed = data.completed;
    }

    if (data.priority !== undefined) {
      updateData.priority = data.priority;
    }

    if (data.dueDate !== undefined) {
      updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
    }

    if (data.pixel_reward !== undefined) {
      updateData.pixel_reward = data.pixel_reward?.trim() || null;
    }

    return await this.taskRepository.update(id, updateData);
  }

  async deleteTask(id: string): Promise<boolean> {
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
