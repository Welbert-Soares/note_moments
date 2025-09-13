
import express from 'express';
import cors from 'cors';

import { env } from '@/env';
import { routes } from '@/routes';

const app = express();

app.use(
  cors({
    origin: env.isDevelopment ? '*' : env.ALLOWED_ORIGINS,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', "PATCH"],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);
app.use(express.json());

app.use(routes);

export { app };

