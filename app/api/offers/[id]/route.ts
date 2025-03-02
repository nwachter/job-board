import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { DecodedToken } from "@/app/types/misc";
import jwt from "jsonwebtoken";
import { authMiddleware } from "@/app/middleware";

const prisma = new PrismaClient();

type Params = {
  id: string,
}

export async function GET(request: Request, { params }: { params: Params }) {
  try {
    const { id } = await params;

    const offer = await prisma.offer.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        recruiter: true,
        applications: true,
      }
    });
    return NextResponse.json({ message: "Offre récupérée avec succès", data: offer, status: 200 });

  } catch (error : unknown) {
    console.error("Erreur lors de la recherche de l'offre : ", error);
    return NextResponse.json({ error: "Erreur lors de la recherche de l'offre...", status: 500 });
  }
}

export const PUT = async (request: Request, { params }: { params: Params }) => {
  const { id } = await params;
  const { title, description, company_name, location, salary, recruiter_id } = await request.json();

  if (!id) {
    return NextResponse.json({ error: "L'ID de l'offre est requis pour la mise à jour", status: 400 });
  }

  try {
   const auth = await authMiddleware();
   if(!auth) {
    return NextResponse.json({ message: 'Accès interdit' }, { status: 401 });
   }
    // if (auth?.role  !== "recruiter") {
    //   return NextResponse.json({ error: "Accès interdit", status: 401 });
    // }
  }
  catch (error) {
    console.error("Token invalide", error);
    return NextResponse.json({ message: 'Token invalide' }, { status: 403 });
  }

  const updatedData = await prisma.offer.update({
    where: {
      id: Number(id),
    },
    data: { title, description, company_name, location, salary, recruiter_id }
  });

  return NextResponse.json({ message: "L'offre a été mise à jour avec succès !", data: updatedData, status: 200 });

};

export const DELETE = async (request: Request, { params }: { params: Params }) => {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "L'ID de l'offre est requis pour la suppression", status: 400 });
    }

    try {
      const cookiesData = cookies();
      const token = (await cookiesData).get('token')?.value;
      if (!token) {
        return NextResponse.json({ message: 'Accès interdit' }, { status: 401 });
      }
      const decodedToken: DecodedToken = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
      if (decodedToken?.role !== "recruiter" && decodedToken?.role !== "admin") {
        return NextResponse.json({ error: "Accès non autorisé", status: 401 });
      }
    }
    catch (error) {
      console.error("Token invalide", error);
      return NextResponse.json({ message: 'Token invalide' }, { status: 403 });
    }

    const deletedOffer = prisma.offer.delete({ where: { id: Number(id) } });
    if (deletedOffer === null) {
      return NextResponse.json({ error: "L'offre n'a pas été trouvée !", status: 404, data: null });
    }
    return NextResponse.json({ message: "Offre supprimée !", data: deletedOffer, status: 200});

  } catch (error) {
    console.error("Erreur lors de la suppression de l'offre : ", error);

    return NextResponse.json({ message: "Erreur lors de la suppression de l'offre...", data: null }, { status: 404 });
  }
}

