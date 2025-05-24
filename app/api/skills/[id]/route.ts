import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { DecodedToken } from "@/app/types/misc";
import jwt from "jsonwebtoken";
import { authMiddleware } from "@/app/middleware";
import { Role } from "@/app/types/user";

const prisma = new PrismaClient();

type Params = {
  id: string;
};

export async function GET(request: Request, { params }: { params: Params }) {
  try {
    const { id } = await params;

    const skill = await prisma.skill.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        users: true,
        offers: true,
      },
    });
    return NextResponse.json({
      message: "Offre récupérée avec succès",
      data: skill,
      status: 200,
    });
  } catch (error: unknown) {
    console.error("Erreur lors de la recherche de la compétence : ", error);
    return NextResponse.json({
      error: "Erreur lors de la recherche de l'compétence...",
      status: 500,
    });
  }
}

export const PUT = async (request: Request, { params }: { params: Params }) => {
  const { id } = await params;
  const { name } = await request.json();

  if (!id) {
    return NextResponse.json({
      error: "L'ID de la compétence est requis pour la mise à jour",
      status: 400,
    });
  }

  try {
    const auth = await authMiddleware();
    if (!auth) {
      return NextResponse.json({ message: "Accès interdit" }, { status: 401 });
    }
  } catch (error) {
    console.error("Token invalide", error);
    return NextResponse.json({ message: "Token invalide" }, { status: 403 });
  }

  const updatedData = await prisma.skill.update({
    where: {
      id: Number(id),
    },
    data: { name: name },
  });

  return NextResponse.json({
    message: "La compétence a été mise à jour avec succès !",
    data: updatedData,
    status: 200,
  });
};

export const DELETE = async (
  request: Request,
  { params }: { params: Params },
) => {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({
        error: "L'ID de la compétence est requis pour la suppression",
        status: 400,
      });
    }

    try {
      const cookiesData = cookies();
      const token = (await cookiesData).get("token")?.value;
      if (!token) {
        return NextResponse.json(
          { message: "Accès interdit" },
          { status: 401 },
        );
      }
      const decodedToken: DecodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET!,
      ) as DecodedToken;
      if (
        decodedToken?.role !== Role.RECRUITER &&
        decodedToken?.role !== Role.ADMIN
      ) {
        return NextResponse.json({ error: "Accès non autorisé", status: 401 });
      }
    } catch (error) {
      console.error("Token invalide", error);
      return NextResponse.json({ message: "Token invalide" }, { status: 403 });
    }

    const deletedSkill = prisma.skill.delete({ where: { id: Number(id) } });
    if (deletedSkill === null) {
      return NextResponse.json({
        error: "La compétence n'a pas été trouvée !",
        status: 404,
        data: null,
      });
    }
    return NextResponse.json({
      message: "Compétence supprimée !",
      data: deletedSkill,
      status: 200,
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de la compétence : ", error);

    return NextResponse.json(
      {
        message: "Erreur lors de la suppression de la compétence...",
        data: null,
      },
      { status: 404 },
    );
  }
};
