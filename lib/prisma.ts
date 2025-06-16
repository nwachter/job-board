// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = new PrismaClient();
