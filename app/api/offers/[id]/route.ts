import { NextResponse } from "next/server";

import { DecodedToken } from "@/app/types/misc";

import { authMiddleware } from "@/lib/middlewares/auth";
import { Role } from "@/app/types/user";
import { getOfferById, updateOffer, deleteOffer } from "@/lib/queries/offers";
import { Skill } from "@prisma/client";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({
        error: "L'identifiant (ID) de l'offre est requis pour la recherche",
        status: 400,
      });
    }

    const offer = await getOfferById(Number(id));
    return NextResponse.json(offer);
  } catch (error: unknown) {
    console.error("Erreur lors de la recherche de l'offre : ", error);
    return NextResponse.json({
      error: "Erreur lors de la recherche de l'offre.",
      status: 500,
    });
  }
}

export const PUT = async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const { title, description, company_name, contract_type, salary, recruiter_id, location_id, skills } =
    await request.json();

  if (!id) {
    return NextResponse.json({
      error: "L'identifiant (ID) de l'offre est requis pour la mise à jour",
      status: 400,
    });
  }

  try {
    const auth = (await authMiddleware()) as DecodedToken;
    if (!auth) {
      return NextResponse.json(
        {
          message: "Accès interdit, veuillez vous connecter pour modifier cette offre.",
        },
        { status: 401 }
      );
    }
    if (auth?.role !== Role.RECRUITER) {
      return NextResponse.json(
        {
          error: "Accès interdit, seuls les recruteurs peuvent modifier des offres.",
        },
        { status: 403 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: "Erreur lors de la vérification de l'authentification (PUT offer).",
      },
      { status: 500 }
    );
  }
  let updatedData = {
    id: Number(id),
    title,
    description,
    company_name,
    contract_type,
    salary,
    recruiter_id,
    location_id,
    skills,
  };
  //Skills
  if (skills) {
    updatedData.skills = {
      set: skills.map((skill: Skill) => ({ id: skill.id })),
    };
  }

  const result = await updateOffer(Number(id), updatedData);

  return NextResponse.json(
    {
      data: result,
    },
    { status: 200 }
  );
};

export const PATCH = async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const { title, description, company_name, salary, recruiter_id, location_id, skills } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "L'ID de l'offre est requis pour la mise à jour" }, { status: 400 });
    }

    try {
      const auth = (await authMiddleware()) as DecodedToken;
      if (!auth) {
        return NextResponse.json({ error: "Accès interdit, veuillez vous connecter." }, { status: 401 });
      }
      if (auth?.role !== Role.RECRUITER) {
        return NextResponse.json(
          { error: "Accès interdit, seuls les recruteurs peuvent modifier des offres." },
          { status: 403 }
        );
      }
    } catch (error) {
      return NextResponse.json({ error: "Erreur lors de la vérification de l'authentification." }, { status: 500 });
    }

    const updatedData = await updateOffer(Number(id), {
      id: Number(id),
      title,
      description,
      company_name,
      salary,
      recruiter_id,
      location_id,
      skills,
    });

    if (!updatedData) {
      return NextResponse.json({ error: "L'offre n'a pas été trouvée." }, { status: 404 });
    }
    return NextResponse.json({ data: updatedData }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'offre : ", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour de l'offre." }, { status: 500 });
  }
};
export const DELETE = async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "L'ID de l'offre est requis pour la suppression" }, { status: 400 });
    }
    try {
      const auth = (await authMiddleware()) as DecodedToken;
      if (!auth) {
        return NextResponse.json({ message: "Accès interdit" }, { status: 401 });
      }
      if (auth?.role !== Role.RECRUITER && auth?.role !== Role.ADMIN) {
        return NextResponse.json({ error: "Accès non autorisé pour supprimer cette offre." }, { status: 403 });
      }
    } catch (error) {
      return NextResponse.json({ error: "Erreur lors de la vérification de l'authentification." }, { status: 500 });
    }

    const deletedOffer = await deleteOffer(Number(id));

    if (deletedOffer === null) {
      return NextResponse.json({ error: "L'offre n'a pas été trouvée !" }, { status: 404 });
    }
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la suppression de l'offre." }, { status: 500 });
  }
};
