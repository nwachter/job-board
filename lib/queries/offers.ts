import { prisma } from "@/lib/prisma";
import { Offer } from "@prisma/client";
import { Offer as OfferType } from "@/app/types/offer";

export type QueryParameters = {
  [key: string]:
    | { contains?: string }
    | { city?: { contains?: string } }
    | { location_id?: number }
    | { contract_type?: string };
};

export type UpdateOfferPayload = Partial<Offer> & {
  skills: {
    set?: { id: number }[];
  };
};

export type CreateOfferPayload = Omit<Offer, "id"> & {
  skills: {
    connect: { id: number }[];
  };
};

export async function getOfferById(id: number) {
  return await prisma.offer.findUnique({
    where: {
      id: id,
    },
    include: {
      recruiter: true,
      applications: true,
      location: true,
      skills: true,
    },
  });
}

export async function getOffers() {
  return await prisma.offer.findMany({
    include: {
      recruiter: true,
      applications: true,
      location: true,
      skills: true,
    },
  });
}

export async function searchOffers(query: QueryParameters[]) {
  return await prisma.offer.findMany({
    where: {
      OR: query,
    },
    include: {
      recruiter: true,
      applications: true,
      location: true,
      skills: true,
    },
  });
}

export async function getOffersByRecruiterId(recruiterId: number) {
  return await prisma.offer.findUnique({
    where: {
      id: recruiterId,
    },
    include: {
      recruiter: true,
      applications: true,
      skills: true,
      location: true, //testerror
    },
  });
}

export async function updateOffer(id: number, data: UpdateOfferPayload): Promise<Offer> {
  // const updateData: any = { ...data };

  // if (data.skills) {
  //   updateData.skills = {
  //     set: data.skills.map(skill => ({ id: skill.id })),
  //   };
  // }
  return await prisma.offer.update({
    where: {
      id: id,
    },
    data: data,
    include: {
      recruiter: true,
      applications: true,
      skills: true,
      location: true,
    },
  });
}

export async function createOffer(data: CreateOfferPayload): Promise<Offer> {
  // let createdData: any = { ...data };
  // if (data.skills) {
  //   createdData.skills = {
  //     set: data.skills.map(skill => ({ id: skill.id })),
  //   };
  // }
  return await prisma.offer.create({
    data: {
      ...data,
      // skills: {
      //   connect: data.skills?.map(skill => ({ id: skill.id })) || [],
      // },
    },
    include: {
      recruiter: true,
      applications: true,
      skills: true,
      location: true,
    },
    // include: { recruiter: true },
  });
  // .create({
  //   data: data,
  // });
}

export async function deleteOffer(id: number): Promise<Offer> {
  return await prisma.offer.delete({
    where: {
      id: id,
    },
  });
}
