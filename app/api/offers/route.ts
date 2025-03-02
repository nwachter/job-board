import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "@/app/middleware";

const prisma = new PrismaClient();

/*
model Offer {
model Offer {
  id            Int      @id @default(autoincrement())
  title         String
  description   String
  company_name  String
  salary        Int
  location      Location? @relation(fields: [location_id], references: [id])
  location_id   Int?
  contract_type String?
  recruiter         User     @relation("RecruiterOffers", fields: [recruiter_id], references: [id])
  recruiter_id      Int

  applications  Application[]
}

}
*/
export async function GET(
  // request: Request
) {
  try {

    const offers = await prisma.offer.findMany({
      include: {
        recruiter: true,
        applications: true,
      }
    })
    return NextResponse.json(offers);

  } catch (error) {
    console.log("Error fetching offers", error);
    return NextResponse.json({ error: "Erreur lors de la recherche des offres...", status: 500 });
  }
}

export async function POST(request: Request) {
  try {

    // try {

    //   const auth = await authMiddleware();
    //   if(!auth) {
    //     return NextResponse.json({ error: "Accès non autorisé", status: 401 });
    //   }
    // } catch(error) {
    //   console.log("Error verifying token", error);
    //   return NextResponse.json({ error: "Erreur lors de la vérification du token", status: 500 });

    // }



    const { title, description, salary, location_id, company_name, contract_type, recruiter_id } = await request.json();
    console.log("Received recruiter_id:", recruiter_id);
    console.log("Received location_id:", location_id);


    if (!title || !description || !recruiter_id || !salary || !location_id || !contract_type || !company_name) {
      return NextResponse.json({ error: "Il manque des champs requis", status: 400 });
    }
    else {
      console.log("All required fields are present");
    }

    console.log("Received data:", { title, description, salary, contract_type, location_id, company_name, recruiter_id });

    // Vérifier si l'recruiter existe
    const recruiter = await prisma.user.findUnique({
      where: {
        id: recruiter_id,
      }
    });

    if (!recruiter) {
      return NextResponse.json({ error: "Recruteur introuvable" }, { status: 404 });
    }
    else {
      console.log("Recruiter found:", recruiter);
    }

    //Check location
    // Vérifier si la location existe
    const location = await prisma.location.findUnique({
      where: {
        id: location_id,
      }
    });

    if (!location) {
      return NextResponse.json({ error: "Emplacement introuvable" }, { status: 404 });
    } else {
      console.log("Location found:", location);
    }


    const newOffer = await prisma.offer.create({
      data: {
        title,
        description,
        company_name,
        salary,
        location_id,
        contract_type,
        recruiter_id,
      },
      // include: { recruiter: true },
    });

    console.log("Offer created:", newOffer);

    return NextResponse.json({ message: "Offre créée !", data: newOffer, status: 201 });

  } catch (e) {
    console.error("Error creating offer:", e); // Log the full error
    return NextResponse.json({ error: "Erreur lors de la création de l'offre !", status: 500 });

  }
}