import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import Error from "next/error";

const prisma = new PrismaClient();

/*
model Offer {
  id            Int      @id @default(autoincrement())
  title         String
  description   String
  company_name  String
  salary        Int
  location      String
  admin         User     @relation("AdminOffers", fields: [admin_id], references: [id], onDelete: Cascade)
  admin_id      Int

  applications  Application[]
}
*/
export async function GET() {
  try {
    const offers = await prisma.offer.findMany({
      include: {
        admin: true,
        applications: true,
      }
    });
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
    // if (verifiedToken?.role !== "admin") {
    //   return NextResponse.json({ error: "Accès non autorisé", status: 401 });
    // }
    const cookiesData = await cookies();
    const token = cookiesData.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Accès interdit' }, { status: 401 });
    }

    // const decodedToken: DecodedToken = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    // if (decodedToken?.role !== "recruiter") {
    //   return NextResponse.json({ error: "Accès non autorisé", status: 401 });
    // }

    const { title, description, salary, location, company_name, admin_id } = await request.json();

    console.log("Received data:", { title, description, salary, location, company_name, admin_id });

    // Vérifier si l'admin existe
    const admin = await prisma.user.findUnique({
      where: {
        id: admin_id,
      }
    });

    if (!admin) {
      return NextResponse.json({ error: "Recruteur introuvable" }, { status: 404 });
    }
    else{
      console.log("Admin found:", admin);
    }

    if (!title || !description || !admin_id || !salary || !location || !company_name) {
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
        location,
        company_name,
        admin_id,
        admin: {
          connect: {
            id: admin_id,
          },
        }
      },
      // include: { admin: true },
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