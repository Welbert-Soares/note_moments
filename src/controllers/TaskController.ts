// src/controllers/TaskController.ts
import { Request, Response } from "express";

import { TaskService } from "@/services/TaskService";
import { CreateTaskRequest, UpdateTaskRequest } from "@/types/task";
import { TaskModel } from "@/models/Task";

export class TaskController {
  private taskService: TaskService;

  constructor(taskService: TaskService) {
    this.taskService = taskService;
  }

  getTasks = async (req: Request, res: Response): Promise<void> => {
    try {
      const { completed, priority, overdue } = req.query;

      const filters = {
        completed:
          completed === "true"
            ? true
            : completed === "false"
            ? false
            : undefined,
        priority: priority as any,
        overdue: overdue === "true",
      };

      const tasks = await this.taskService.getTasks(filters);
      const formattedTasks = tasks.map((task) =>
        TaskModel.formatForResponse(task)
      );

      res.json({
        success: true,
        data: formattedTasks,
        count: formattedTasks.length,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    }
  };

  createTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const taskData: CreateTaskRequest = req.body;
      const task = await this.taskService.createTask(taskData);

      res.status(201).json({
        success: true,
        data: TaskModel.formatForResponse(task),
        message: "Tarefa criada com sucesso",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do sevidor',
      });
    }
  };

  getTaskById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          success: false,
          error: "ID da tarefa é obrigatório",
        });
        return;
      }

      const task = await this.taskService.getTaskById(id);

      if (!task) {
        res.status(404).json({
          success: false,
          error: "Tarefa não encontrada",
        });
        return;
      }

      res.json({
        success: true,
        data: TaskModel.formatForResponse(task),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Erro interno do servidor",
      });
    }
  };

  updateTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updateData: UpdateTaskRequest = req.body;
      
      if (!id) {
        res.status(400).json({
          success: false,
          error: "ID da tarefa é obrigatório",
        });
        return;
      }
      
      const task = await this.taskService.updateTask(id, updateData);

      if (!task) {
        res.status(404).json({
          success: false,
          error: "Tarefa não encontrada",
        });
        return;
      }

      res.json({
        success: true,
        data: TaskModel.formatForResponse(task),
        message: "Tarefa atualizada com sucesso",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : "Erro ao atualizar tarefa",
      });
    }
  };

  deleteTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          success: false,
          error: "ID da tarefa é obrigatório",
        });
        return;
      }
      
      const deleted = await this.taskService.deleteTask(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          error: "Tarefa não encontrada",
        });
        return;
      }

      res.json({
        success: true,
        message: "Tarefa deletada com sucesso",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : "Erro ao deletar tarefa",
      });
    }
  };

  getTaskStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const stats = await this.taskService.getTaskStats();

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Erro ao buscar estatísticas",
      });
    }
  };

  markTaskAsCompleted = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          success: false,
          error: "ID da tarefa é obrigatório",
        });
        return;
      }
      
      const task = await this.taskService.markTaskAsCompleted(id);

      if (!task) {
        res.status(404).json({
          success: false,
          error: "Tarefa não encontrada",
        });
        return;
      }

      res.json({
        success: true,
        data: TaskModel.formatForResponse(task),
        message: "Tarefa marcada como concluída",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : "Erro ao marcar tarefa como concluída",
      });
    }
  };

  duplicateTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json({
          success: false,
          error: "ID da tarefa é obrigatório",
        });
        return;
      }
      
      const task = await this.taskService.duplicateTask(id);

      res.status(201).json({
        success: true,
        data: TaskModel.formatForResponse(task),
        message: "Tarefa duplicada com sucesso",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : "Erro ao duplicar tarefa",
      });
    }
  };

  // ... outros métodos seguem o mesmo padrão
}
