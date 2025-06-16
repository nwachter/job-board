import { PrismaClient } from "@prisma/client";
import { Application } from "@/app/types/application";

const prisma = new PrismaClient();

export async function getAllApplications() {
  return prisma.application.findMany({
    include: {
      user: true,
      offer: true,
    },
  });
}

export async function createApplication(data: Omit<Application, "id">) {
  return prisma.application.create({
    data: {
      content: data.content,
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      cv: data.cv,
      offer: {
        connect: { id: data.offer_id },
      },
      user: {
        connect: { id: data.user_id },
      },
      status: data.status,
      feedback: data.feedback,
    },
  });
}

export async function getApplicationById(id: number) {
  return prisma.application.findUnique({
    where: {
      id: id,
    },
    include: {
      user: true,
      offer: true,
    },
  });
}

export async function updateApplication(
  id: number,
  data: Partial<Application>,
) {
  return prisma.application.update({
    where: {
      id: id,
    },
    data: {
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      cv: data.cv,
      ...(data.offer_id && { offer: { connect: { id: data.offer_id } } }),
      ...(data.user_id && { user: { connect: { id: data.user_id } } }),
      status: data.status,
      feedback: data.feedback,
    },
    include: { user: true, offer: true },
  });
}

export async function deleteApplication(id: number) {
  return prisma.application.delete({
    where: {
      id: id,
    },
  });
}

export async function getApplicationsByRecruiterForChart(recruiterId: number) {
  return prisma.application.findMany({
    where: {
      offer: {
        recruiter_id: recruiterId,
      },
    },
    include: {
      offer: {
        include: {
          location: true,
        },
      },
      user: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}

export async function getApplicationsByUserForChart(userId: number) {
  return prisma.application.findMany({
    where: {
      user_id: userId,
    },
    include: {
      offer: {
        include: {
          location: true,
        },
      },
      user: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}

export async function getApplicationsByUserId(userId: number) {
  return prisma.application.findMany({
    where: {
      user_id: userId,
    },
    include: {
      user: true,
      offer: true,
    },
  });
}

export async function searchApplications(searchQuery: string) {
  return prisma.application.findMany({
    where: {
      OR: [
        { firstname: { contains: searchQuery } },
        { lastname: { contains: searchQuery } },
        { email: { contains: searchQuery } },
        { offer: { title: { contains: searchQuery } } },
        {
          offer: {
            description: { contains: searchQuery },
          },
        },
        {
          offer: {
            company_name: { contains: searchQuery },
          },
        },
        {
          offer: {
            location: {
              city: { contains: searchQuery },
            },
          },
        },
      ],
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
      offer: true,
    },
  });
}
