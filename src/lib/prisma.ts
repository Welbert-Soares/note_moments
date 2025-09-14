// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

import { env } from "@/env";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: env.isDevelopment ? ['query'] : [],
  });

if (env.isDevelopment) globalForPrisma.prisma = prisma;
