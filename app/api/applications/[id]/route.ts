import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { DecodedToken } from "@/app/types/misc";

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

export async function GET(request: Request, { params }: 
  { params: Promise<{ id: string }> }) {   //BIGtesterror : maybe must add Promise everywhere we have params...
  try {
   const { id } = await params;
    // const applicationId = parseInt(params.id, 10);
    const applicationId = parseInt(id, 10);

    if (isNaN(applicationId)) {
      return NextResponse.json({ error: "ID de candidature invalide" }, { status: 400 });
    }

    const application = await prisma.application.findUnique({
      where: {
        id: applicationId,
      },
      include: {
        user: true,
        offer: true,
      }
    });

    if (!application) {
      return NextResponse.json({ error: "Candidature introuvable" }, { status: 404 });
    }

    return NextResponse.json(application);

  } catch (error) {
    return NextResponse.json({ error: `Erreur lors de la recherche de la candidature : ${error}`, status: 500 });
  }
}


export async function PUT(request: Request) {
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

    const { id, firstname, lastname, email, offer_id, user_id, cv } = await request.json();

    // Vérifier si la candidature existe
    const existingApplication = await prisma.application.findUnique({
      where: {
        id: id,
      }
    });
    if (!existingApplication) {
      return NextResponse.json({ error: "Candidature introuvable" }, { status: 404 });
    }

    const updatedApplication = await prisma.application.update({
      where: {
        id: id,
      },
      data: {
        firstname,
        lastname,
        email,
        offer_id,
        user_id,
        cv,
        user: {
          connect: {
            id: user_id,
          },
        },
        offer: {
          connect: {
            id: offer_id,
          },
        }
      },
      include: { user: true, offer: true },
    });

    return NextResponse.json({ message: "Candidature mise à jour !", data: updatedApplication });

  } catch (error) {
    return NextResponse.json({ error: `Erreur lors de la mise à jour de la candidature : ${error}`}, {status: 500 });
  }
}

export async function DELETE(request: Request) {
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

    const { id } = await request.json();

    // Vérifier si la candidature existe
    const existingApplication = await prisma.application.findUnique({
      where: {
        id: id,
      }
    });
    if (!existingApplication) {
      return NextResponse.json({ error: "Candidature introuvable" }, { status: 404 });
    }

    await prisma.application.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({ message: "Candidature supprimée !" });

  } catch (error) {
    return NextResponse.json({ error: `Erreur lors de la suppression de la candidature : ${error}`}, {status: 500 });
  }
}
