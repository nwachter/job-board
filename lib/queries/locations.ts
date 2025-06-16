import { Location } from "@prisma/client";
import { prisma } from "../prisma";

export async function getLocationById(id: number) {
  return await prisma.location.findUnique({
    where: {
      id: id,
    },
    include: {
      offers: true,
    },
  });
}

export async function getLocations(): Promise<Location[]> {
  return await prisma.location.findMany({
    include: {
      offers: true,
    },
  });
}

export async function createLocation(
  data: Omit<Location, "id">,
): Promise<Location> {
  return await prisma.location.create({
    data: {
      city: data.city,
      country: data.country,
    },
  });
}

export async function updateLocation(
  id: number,
  data: Partial<Location>,
): Promise<Location> {
  return prisma.location.update({
    where: {
      id: id,
    },
    data: {
      ...data,
    },
  });
}

export async function updateFullLocation(
  id: number,
  data: Partial<Location>,
): Promise<Location> {
  return await prisma.location.update({
    where: {
      id: id,
    },
    data: {
      ...data,
    },
  });
}

export async function deleteLocation(id: number): Promise<Location> {
  return await prisma.location.delete({
    where: {
      id: id,
    },
  });
}

export async function searchLocations(searchTerm: string) {
  return await prisma.location.findMany({
    where: {
      OR: [
        {
          city: {
            contains: searchTerm,
          },
        },
        {
          country: {
            contains: searchTerm,
          },
        },
      ],
    },
    include: {
      offers: true,
    },
  });
}
