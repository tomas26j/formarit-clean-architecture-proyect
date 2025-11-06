/**
 * Cliente de Prisma singleton
 * Reutiliza la misma instancia en toda la aplicación
 */

import { PrismaClient } from "@prisma/client";

// Extender PrismaClient para logging en desarrollo
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
};

declare global {
  // eslint-disable-next-line no-var
  var __prisma: ReturnType<typeof prismaClientSingleton> | undefined;
}

// Singleton pattern para evitar múltiples instancias en desarrollo (hot reload)
export const prisma = globalThis.__prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma;
}

