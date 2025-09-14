// src/repositories/TaskRepository.ts
import { PrismaClient, Task, Priority, Prisma } from "@prisma/client";

import {
  ITaskRepository,
  CreateTaskData,
  UpdateTaskData,
  TaskFilters,
} from "@/repositories/interfaces/ITaskRepository";

export class TaskRepository implements ITaskRepository {

  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(data: CreateTaskData): Promise<Task> {
    // Usar dados diretamente, já validados pelo TaskModel
    return await this.prisma.task.create({
      data: {
        title: data.title,
        description: data.description ?? null,
        priority: data.priority ?? Priority.MEDIUM,  // padrão do schema
        dueDate: data.dueDate ?? null,
        pixel_reward: data.pixel_reward ?? null
      },
    });
  }

  async findById(id: string): Promise<Task | null> {
    return await this.prisma.task.findUnique({
      where: { id },
    });
  }

  async findAll(filters?: TaskFilters): Promise<Task[]> {
    // Usar tipos do Prisma para where clause
    const where: Prisma.TaskWhereInput = {};

    if (filters?.completed !== undefined) {
      where.completed = filters.completed;
    }

    if (filters?.priority) {
      where.priority = filters.priority;
    }

    if (filters?.overdue) {
      where.AND = [
        { completed: false }, 
        { dueDate: { lt: new Date() } }
      ];
    }

    return await this.prisma.task.findMany({
      where,
      orderBy: [{ completed: "asc" }, { createdAt: "desc" }],
    });
  }

  async update(id: string, data: UpdateTaskData): Promise<Task | null> {
    try {
      return await this.prisma.task.update({
        where: { id },
        data,
      });
    } catch (error) {
      // Se não encontrou o registro (P2025)
      if (error && typeof error === 'object' && 'code' in error && error.code === "P2025") {
        return null;
      }
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.task.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      // Se não encontrou o registro
      if (error && typeof error === 'object' && 'code' in error && error.code === "P2025") {
        return false;
      }
      throw error;
    }
  }

  async count(filters?: TaskFilters): Promise<number> {
    // Usar tipos do Prisma para where clause
    const where: Prisma.TaskWhereInput = {};

    if (filters?.completed !== undefined) {
      where.completed = filters.completed;
    }

    if (filters?.priority) {
      where.priority = filters.priority;
    }

    if (filters?.overdue) {
      where.AND = [
        { completed: false }, 
        { dueDate: { lt: new Date() } }
      ];
    }

    return await this.prisma.task.count({ where });
  }

  async findByTitle(title: string): Promise<Task | null> {
    return await this.prisma.task.findFirst({
      where: {
        title: {
          equals: title,
          mode: "insensitive", // Case insensitive
        },
      },
    });
  }

  // Métodos específicos do repository
  async findCompletedInPeriod(startDate: Date, endDate: Date): Promise<Task[]> {
    return await this.prisma.task.findMany({
      where: {
        completed: true,
        updatedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }

  async bulkUpdateCompleted(
    ids: string[],
    completed: boolean
  ): Promise<number> {
    const result = await this.prisma.task.updateMany({
      where: {
        id: { in: ids },
      },
      data: { completed },
    });
    return result.count;
  }
}
