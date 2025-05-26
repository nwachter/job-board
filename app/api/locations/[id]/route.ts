import { authMiddleware } from "@/app/middleware";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// type Params = {
//     id: string;
// };

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "ID de lieu requis", status: 400 });
    }
    const location = await prisma.location.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        offers: true,
      },
    });
    if (!location) {
      return NextResponse.json({ error: "Lieu introuvable", status: 404 });
    }
    return NextResponse.json(location);
  } catch (error) {
    console.error("Error fetching location:", error);
    return NextResponse.json({
      error: "Erreur lors de la récupération du lieu...",
      status: 500,
    });
  }
}
export async function PUT(request: Request) {
  try {
    const auth = await authMiddleware();

    // Check if auth is an object and has an error property
    if (typeof auth === "object" && auth !== null && "error" in auth) {
      return NextResponse.json({
        error: "Token invalide. Accès non autorisé",
        status: 401,
      });
    }

    if (!auth) {
      return NextResponse.json({ error: "Accès non autorisé", status: 401 });
    }

    const { id, city, country } = await request.json();

    if (!id || !city || !country) {
      return NextResponse.json({
        error: "Il manque des champs requis",
        status: 400,
      });
    }

    const updatedLocation = await prisma.location.update({
      where: {
        id: id,
      },
      data: {
        city,
        country,
      },
      // include: {
      //   offers: true,
      // },
    });

    return NextResponse.json({
      message: "Lieu mis à jour !",
      data: updatedLocation,
    });
  } catch (e: unknown) {
    console.error("Error updating location:", e);
    return NextResponse.json({
      error: "Erreur lors de la mise à jour du lieu !",
      status: 500,
    });
  }
}

export async function DELETE(request: Request) {
  try {
    const auth = await authMiddleware();

    // Check if auth is an object and has an error property
    if (typeof auth === "object" && auth !== null && "error" in auth) {
      return NextResponse.json({
        error: "Token invalide. Accès non autorisé",
        status: 401,
      });
    }

    if (!auth) {
      return NextResponse.json({ error: "Accès non autorisé", status: 401 });
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "ID de location requis", status: 400 });
    }

    const existingLocation = await prisma.location.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingLocation) {
      return NextResponse.json({ error: "Lieu introuvable", status: 404 });
    }

    await prisma.location.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({ message: "Lieu supprimé !" });
  } catch (e: unknown) {
    console.error("Error deleting location:", e);
    return NextResponse.json({
      error: "Erreur lors de la suppression du lieu !",
      status: 500,
    });
  }
}
