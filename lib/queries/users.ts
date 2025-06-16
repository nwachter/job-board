import { prisma } from "@/lib/prisma";

export async function getUserById(id: number) {
  return await prisma.user.findUnique({
    where: {
      id: id,
    },
    include: {
      offers: true,
      skills: true,
      applications: true,
    },
  });
}

export async function getUsers() {
  return await prisma.user.findMany({
    include: { offers: true, applications: true },
  });
}
