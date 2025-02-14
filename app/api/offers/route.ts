import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import Error from "next/error";
import jwt from "jsonwebtoken";
import { DecodedToken } from "@/app/types/misc";
import { authMiddleware, middleware } from "@/app/middleware";

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
export async function GET() {
  try {
    // const offers = await prisma.offer.findMany({
    //   include: {
    //     recruiter: true,
    //     applications: true,
    //   }
    // });

    const auth = await authMiddleware(); 
      // Check if auth is an object and has an error property
      if (typeof auth === 'object' && auth !== null && 'error' in auth) {
        return NextResponse.json({ error: "Token invalide. Accès non autorisé", status: 401 });
      }

      
    // if(auth?.error as string) {
    //   return NextResponse.json({error: "Token invalide. Accès non autorisé", status: 401});
    // }
    const offers = await prisma.offer.findMany({
      include: {
        recruiter: true,
        applications: true,
      }
    })
    return NextResponse.json(offers);

  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la recherche des offres...", status: 500 });
  }
}

export async function POST(request: Request) {
  try {
      // //Sécurisation de la route - Authorization         Bearer
    //         const authHeader = request.headers.get('Authorization');
    //         if(!authHeader || !authHeader.startsWith('Bearer')) { 
    //         return NextResponse.json({error: "Accès non autorisé", status: 401});
    //         }    
    //         //Extraire le token
    //         const token = authHeader.split(' ')[1];
    //         //Vérifer le token
    // let verifiedToken: DecodedToken | undefined;

    // try {
    //   verifiedToken = jwt.verify(token, process.env.JWT_SECRET || "jwt_secret") as DecodedToken;
    // } catch (error) {
    //   return NextResponse.json({ error: "Accès non autorisé", status: 401 });


    // }
    // if (verifiedToken?.role !== "recruiter") {
    //   return NextResponse.json({ error: "Accès non autorisé", status: 401 });
    // }

    try {
      const cookiesData = await cookies();
      const token = cookiesData.get('token')?.value;
  
      if (!token) {
        return NextResponse.json({ message: 'Accès interdit' }, { status: 401 });
      }
      let decodedToken;
       decodedToken = jwt.verify(token, process.env.JWT_SECRET ?? "jwt_secret") as DecodedToken;

       if(!decodedToken) {
        return NextResponse.json({ error: "Accès non autorisé", status: 401 });

       }
    } catch(error) {
      return NextResponse.json({ error: "Erreur lors de la vérification du token", status: 500 });

    }

    // const decodedToken: DecodedToken = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    // if (decodedToken?.role !== "recruiter") {
    //   return NextResponse.json({ error: "Accès non autorisé", status: 401 });
    // }

    const { title, description, salary, location_id, company_name, recruiter_id } = await request.json();

    console.log("Received data:", { title, description, salary, location, company_name, recruiter_id });

    // Vérifier si l'recruiter existe
    const recruiter = await prisma.user.findUnique({
      where: {
        id: recruiter_id,
      }
    });

    if (!recruiter) {
      return NextResponse.json({ error: "Recruteur introuvable" }, { status: 404 });
    }
    else{
      console.log("Admin found:", recruiter);
    }

    if (!title || !description || !recruiter_id || !salary || !location_id || !company_name) {
      return NextResponse.json({ error: "Il manque des champs requis", status: 400 });
    }
    else {
      console.log("All required fields are present");
    }

    const newOffer = await prisma.offer.create({
      data: {
        title,
        description,
        salary,
        location: {
          connect: {
            id: location_id,
          },
        },
        company_name,
        recruiter_id,
        recruiter: {
          connect: {
            id: recruiter_id,

          },
        }
      },
      // include: { recruiter: true },
    });

    console.log("Offer created:", newOffer);

    return NextResponse.json({ message: "Offre créée !", data: newOffer, status: 201 });

  } catch (e: any) {
    if (e) {
      console.log("Error creating offer");
    } else {
      console.log("Unknown error occurred");
    }
    return NextResponse.json({ error: "Erreur lors de la création de l'offre !", status: 500 });
  }
}