import { NextResponse } from "next/server";
import { PrismaClient, Skill } from "@prisma/client";
import { DecodedToken } from "@/app/types/misc";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { authMiddleware } from "@/lib/middlewares/auth";
import { Role } from "@/app/types/user";

const prisma = new PrismaClient();

// type Params = {
//   id: string,
// }

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const userId = parseInt(id, 10);

    const auth: DecodedToken = (await authMiddleware()) as DecodedToken;
    if (!auth || (auth?.role !== Role.ADMIN && Number(id) !== Number(auth?.id))) {
      return NextResponse.json({ message: "Accès interdit" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        offers: true,
        skills: true,
        applications: true,
      },
    });
    return NextResponse.json({
      message: "Utilisateur récupéré avec succès",
      data: user,
    });
  } catch (error) {
    return NextResponse.json({
      error: `Erreur lors de la recherche de l'utilisateur : ${error}`,
      status: 500,
    });
  }
}

export const PATCH = async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;

    let requestBody;
    try {
      requestBody = await request.json();
    } catch (error) {
      return NextResponse.json({ error: "Le corps de la requête n'est pas valide" }, { status: 400 });
    }

    const { username, email, role, skills, password } = requestBody;

    // Auth check
    const auth: DecodedToken = (await authMiddleware()) as DecodedToken;
    if (!auth || (auth?.role !== Role.ADMIN && Number(id) !== Number(auth?.id))) {
      return NextResponse.json({ message: "Accès interdit" }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({
        error: "L'ID de l'utilisateur est requis pour la mise à jour",
        status: 400,
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : existingUser.password;

    const updateData: any = {
      ...(username !== undefined && { username }),
      ...(email !== undefined && { email }),
      ...(password !== undefined && { password: hashedPassword }),
      ...(role !== undefined && { role }),
    };

    // Handle skills many-to-many relationship
    if (skills && Array.isArray(skills)) {
      // For each skill,  either connect to existing or create new ones
      const skillConnections = [];

      for (const skillData of skills) {
        if (skillData.id) {
          // Skill exists, connect to it
          skillConnections.push({ id: skillData.id });
        } else if (skillData.name) {
          const existingSkill = await prisma.skill.findUnique({
            where: { name: skillData.name },
          });

          if (existingSkill) {
            skillConnections.push({ id: existingSkill.id });
          } else {
            // Create new skill
            const newSkill = await prisma.skill.create({
              data: {
                name: skillData.name,
                level: skillData.level || null,
              },
            });
            skillConnections.push({ id: newSkill.id });
          }
        }
      }

      updateData.skills = {
        set: skillConnections,
      };
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "Aucun champ valide n'a été fourni pour la mise à jour" }, { status: 400 });
    }

    const updatedData = await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: updateData,
      include: {
        offers: true,
        applications: true,
        skills: true,
      },
    });

    return NextResponse.json({
      message: "L'utilisateur a été mis à jour avec succès !",
      data: updatedData,
      status: 200,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur : ", error);

    return NextResponse.json({ error: "Erreur du serveur lors de la mise à jour de l'utilisateur" }, { status: 500 });
  }
};

export async function DELETE(request: Request) {
  try {
    // const cookiesData = cookies();
    // const token = (await cookiesData).get("token")?.value;

    // if (!token) {
    //   return NextResponse.json({ message: "Accès interdit" }, { status: 401 });
    // }
    const { id } = await request.json();
    const auth: DecodedToken = (await authMiddleware()) as DecodedToken;

    if (!auth || (auth?.role !== Role.ADMIN && Number(id) !== Number(auth?.id))) {
      return NextResponse.json({ message: "Accès interdit" }, { status: 401 });
    }

    // Vérifier si l'utilisateur existe
    const existingUser = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!existingUser) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    await prisma.user.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({ message: "Utilisateur supprimé !", data: null });
  } catch (error) {
    return NextResponse.json({
      error: `Erreur lors de la suppression de l'utilisateur : ${error}`,
      status: 500,
    });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const cookiesData = await cookies();
    const token = cookiesData.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Accès interdit" }, { status: 401 });
    }

    const decodedToken: DecodedToken = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    // if (decodedToken?.role !== "admin") {
    //   return NextResponse.json({ error: "Accès non autorisé", status: 401 });
    // }
    if (!decodedToken) {
      return NextResponse.json({ error: "Accès non autorisé", status: 401 });
    }

    const { username, email, password, role, skills } = await request.json();

    // Vérifier si l'utilisateur existe
    const existingUser = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!existingUser) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    // Hasher le mot de passe si nécessaire
    const hashedPassword = password ? await bcrypt.hash(password, 10) : existingUser.password;

    //Skills
    const updateData: any = { username, email, password: hashedPassword, role };

    if (skills) {
      updateData.skills = {
        set: skills.map((skill: Skill) => ({ id: skill.id })),
      };
    }
    console.log("updateData : ", updateData);
    const updatedUser = await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: updateData,
      include: { offers: true, applications: true, skills: true },
    });

    return NextResponse.json({
      message: "Utilisateur mis à jour !",
      data: updatedUser,
    });
  } catch (error) {
    return NextResponse.json({
      error: `Erreur lors de la mise à jour de l'utilisateur : ${error}`,
      status: 500,
    });
  }
}
