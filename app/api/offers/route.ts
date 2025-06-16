import { NextRequest, NextResponse } from "next/server";
import { createOffer, getOffers } from "@/lib/queries/offers";
import { getUserById } from "@/lib/queries/users";
import { getLocationById } from "@/lib/queries/locations";
import { authMiddleware } from "@/lib/middlewares/auth";
import { Skill } from "@prisma/client";

export async function GET() {
  // request: Request
  try {
    const offers = await getOffers();
    return NextResponse.json(offers);
  } catch (error) {
    return NextResponse.json({
      error: `Erreur lors de la récupération des offres (api-offers) : ${error}`,
      status: 500,
    });
  }
}

export async function POST(request: NextRequest) {
  // // TEST - Rate limiting - 5 créations par heure
  // const rateLimitCheck = checkRateLimit(request, 20, 60);

  // if (rateLimitCheck.isLimited) {
  //   return rateLimitCheck.response!;
  // }

  try {
    const { title, description, salary, location_id, company_name, contract_type, recruiter_id, skills } =
      await request.json();

    const auth = await authMiddleware();
    if (!auth) {
      return NextResponse.json({ error: "Vous n'êtes pas autorisé à créer une offre!" }, { status: 401 });
    }

    if (
      !title ||
      !description ||
      !recruiter_id ||
      !salary ||
      !location_id ||
      !contract_type ||
      !company_name ||
      !skills
    ) {
      return NextResponse.json({ error: "Il manque des champs requis" }, { status: 400 });
    }

    let createdData: any = {
      title,
      description,
      salary,
      location_id,
      company_name,
      contract_type,
      recruiter_id,
      skills,
    };

    //console.log("Received data:", {
    //   title,
    //   description,
    //   salary,
    //   contract_type,
    //   location_id,
    //   company_name,
    //   recruiter_id,
    // });

    // Vérifier si l'recruiter existe
    const recruiter = await getUserById(recruiter_id);

    if (!recruiter) {
      return NextResponse.json({ error: "Recruteur introuvable" }, { status: 404 });
    }

    //Check location
    const location = await getLocationById(location_id);

    if (!location) {
      return NextResponse.json({ error: "Emplacement introuvable" }, { status: 404 });
    }
    //Skills

    if (skills) {
      createdData.skills = {
        connect: skills.map((skill: Skill) => ({ id: skill.id })),
      };
    }
    const newOffer = await createOffer(
      createdData
      //   {
      //   title,
      //   description,
      //   company_name,
      //   salary,
      //   location_id,
      //   location,
      //   contract_type,
      //   recruiter_id,
      //   ...(skills && { skills }),
      // }
    );

    return NextResponse.json(
      {
        data: newOffer,
      },
      { status: 201 }
    );
  } catch (e) {
    //console.warn("Error creating offer:", e); // Log the full error
    return NextResponse.json(
      {
        error: "Erreur lors de la création de l'offre : ",
        e,
      },
      { status: 500 }
    );
  }
}
