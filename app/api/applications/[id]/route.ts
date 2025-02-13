import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Params = {
  id: string,
}

export async function GET(request: Request, { params }: { params: Params }) {
  try {
    const application = await prisma.application.findUnique({
      where: { id: Number(params.id) },
      include: {
        user: true,
        offer: true,
      }
    });

    if (!application) {
      return NextResponse.json({ error: "Application introuvable", status: 404 });
    }

    return NextResponse.json({ message: "Application trouvée !", data: application });
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la recherche de l'application...", status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Params }) {
  try {
    const application = await prisma.application.delete({
      where: { id: Number(params.id) },
    });

    return NextResponse.json({ message: "Candidature supprimée avec succès", data: application });
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la suppression de la candidature...", status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Params }) {
  try {
    const data = await request.json();
    const application = await prisma.application.update({
      where: { id: Number(params.id) },
      data,
    });

    return NextResponse.json({ message: "Candidature mise à jour avec succès", data: application });
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la mise à jour de la candidature...", status: 500 });
  }
}



