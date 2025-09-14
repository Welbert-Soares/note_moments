
import { Router } from "express";

import { TaskController } from "@/controllers/TaskController";
import { TaskService } from "@/services/TaskService";
import { TaskRepository } from "@/repositories/TaskRepository";
import { prisma } from "@/lib/prisma";

const taskRouter = Router();

// Injeção de dependências em camadas
const taskRepository = new TaskRepository(prisma);
const taskService = new TaskService(taskRepository);
const taskController = new TaskController(taskService);

// Rotas específicas 
taskRouter.get('/stats/overview', taskController.getTaskStats);

// Rotas básicas
taskRouter.get('/', taskController.getTasks);
taskRouter.post('/', taskController.createTask);
taskRouter.get('/:id', taskController.getTaskById);
taskRouter.put('/:id', taskController.updateTask);
taskRouter.delete('/:id', taskController.deleteTask);

// Rotas específicas com parâmetros
taskRouter.patch('/:id/complete', taskController.markTaskAsCompleted);
taskRouter.post('/:id/duplicate', taskController.duplicateTask);

export { taskRouter };