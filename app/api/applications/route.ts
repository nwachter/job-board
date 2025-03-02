import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { DecodedToken } from "@/app/types/misc";
import { authMiddleware } from "@/app/middleware";

const prisma = new PrismaClient();

/*
model Application {
  id         Int     @id @default(autoincrement())
  firstname  String
  lastname   String
  email      String
  offer      Offer   @relation(fields: [offer_id], references: [id])
  offer_id   Int
  user       User    @relation(fields: [user_id], references: [id])
  user_id    Int
  cv         String
}
*/

export async function GET() {
  try {
    // const authHeader = request.headers.get('Authorization');

    // if(!authHeader || !authHeader.startsWith('Bearer')) {
    //   return NextResponse.json({ error: "Accès non autorisé", status: 401 });
    // }

    // const token = authHeader.split(' ')[1];
    // let decode;
    // const SECRET_KEY = process.env.JWT_SECRET || "jwt_secret";

    // try {
    //   decode = jwt.verify(token, SECRET_KEY) as DecodedToken;
    // } catch (error) {
    //   return NextResponse.json({ error: "Accès non autorisé", status: 401 });
    // }
    //  let auth;
 try {
       await authMiddleware();
 } catch(error) {
    console.error("Erreur lors de la vérification du token", error);
    return NextResponse.json({ error: "Erreur lors de la vérification du token (applications)", status: 401 });
 }

    
    const applications = await prisma.application.findMany({
      include: {
        user: true,
        offer: true,
      }
    });
    return NextResponse.json({data:applications});

  } catch (error) {
    console.error("Erreur lors de la recherche des candidatures : ", error);
    return NextResponse.json({ error: "Erreur lors de la recherche des candidatures...", status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookiesData = cookies();
    const token = (await cookiesData).get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Accès interdit' }, { status: 401 });
    }

    const decodedToken : DecodedToken = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    if (decodedToken?.role !== "user") {
      return NextResponse.json({ error: "Accès non autorisé", status: 401 });
    }

    const { firstname, lastname, email, offer_id, user_id, cv, content } = await request.json();

    // Vérifier si l'user existe
    const user = await prisma.user.findUnique({
      where: {
        id: user_id,
      }
    });
    if (!user) {
      return NextResponse.json({ error: "L'utilisateur lié à cette candidature est introuvable" }, { status: 404 });
    }

    // Vérifier si l'offre existe
    const offer = await prisma.offer.findUnique({
      where: {
        id: offer_id,
      }
    });
    if (!offer) {
      return NextResponse.json({ error: "L'offre liée à la candidature est introuvable" }, { status: 404 });
    }

    if (!firstname || !lastname || !email || !offer_id || !user_id || !cv || !content) {
      return NextResponse.json({ error: "Il manque des champs requis", status: 400 });
    }

    const newApplication = await prisma.application.create({
      data: {
        firstname,
        lastname,
        content,
        email,
        offer_id,
        user_id,
        cv,
        // user: {
        //   connect: {
        //     id: user_id,
        //   },
        // },
        // offer: {
        //   connect: {
        //     id: offer_id,
        //   },
        // }
      },
      // include: { user: true, offer: true },
    });

    return NextResponse.json({ message: "Candidature créée !", data: newApplication, status: 200 });

  } catch (error) {
    console.error("Erreur lors de la création de la candidature : ", error);
    return NextResponse.json({ error: "Erreur lors de la création de la candidature !", status: 500 });
  }
}