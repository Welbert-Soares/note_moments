import { Router } from "express";

import { taskRouter } from "@/routes/taskRoutes";

const routes = Router();

routes.use('/tasks', taskRouter);

export { routes };
