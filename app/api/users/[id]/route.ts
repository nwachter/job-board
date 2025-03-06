import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { DecodedToken } from "@/app/types/misc";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

type Params = {
  id: string,
}

export async function GET(
  // request: Request, { params }: { params: Params }
) {
    try {
        const users = await prisma.user.findMany({
            include: {
                offers: true, 
                applications: true  
        }
        });
        return NextResponse.json({message: "Utilisateurs récupérés avec succès", data: users});

    } catch(error) {
        return NextResponse.json({error: `Erreur lors de la recherche des utilisateurs : ${error}`, status: 500});
    }
}
  
  export const PATCH = async (request: Request, {params}: {params: Params}) => {
    const {id} = await params;
    const {username, email, role} = await request.json();

    if (!id) {
     return NextResponse.json({ error: "L'ID de l'utilisateur est requis pour la mise à jour", status: 400 });
   }

   const updatedData = await prisma.user.update({
    where: {
      id: Number(id),
    }, 
    data: {username, email, role},
    include: { offers: true, applications: true },
});

return NextResponse.json({ message: "L'utilisateur a été mis à jour avec succès !", data: updatedData, status: 200 });

  };
  
  export async function DELETE(request: Request) {
    try {
      const cookiesData = cookies();
      const token = (await cookiesData).get('token')?.value;
  
      if (!token) {
        return NextResponse.json({ message: 'Accès interdit' }, { status: 401 });
      }
  
      const decodedToken : DecodedToken = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
      if (decodedToken?.role !== "admin") {
        return NextResponse.json({ error: "Accès non autorisé", status: 401 });
      }
  
      const { id } = await request.json();
  
      // Vérifier si l'utilisateur existe
      const existingUser = await prisma.user.findUnique({
        where: {
          id: id,
        }
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
      return NextResponse.json({ error: `Erreur lors de la suppression de l'utilisateur : ${error}`, status: 500 });
    }
  }
  
  export async function PUT(request: Request, { params }: { params: Params }) {
    const { id } = await params;
    try {
      const cookiesData = await cookies();
      const token = cookiesData.get('token')?.value;
      console.log("token : ", token);
  
      if (!token) {
        return NextResponse.json({ message: 'Accès interdit' }, { status: 401 });
      }
  
      const decodedToken: DecodedToken = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
      // if (decodedToken?.role !== "admin") {
      //   return NextResponse.json({ error: "Accès non autorisé", status: 401 });
      // } 
      if(!decodedToken) {
           return NextResponse.json({ error: "Accès non autorisé", status: 401 });

      }
  
      const { username, email, password, role } = await request.json();
  
      // Vérifier si l'utilisateur existe
      const existingUser = await prisma.user.findUnique({
        where: {
          id: Number(id),
        }
      });
      if (!existingUser) {
        return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
      }
  
      // Hasher le mot de passe si nécessaire
      const hashedPassword = password ? await bcrypt.hash(password, 10) : existingUser.password;
  
      const updatedUser = await prisma.user.update({
        where: {
          id: Number(id),
        },
        data: {
          username,
          email,
          password: hashedPassword,
          role,
        },
        include: { offers: true, applications: true },
      });
  
      return NextResponse.json({ message: "Utilisateur mis à jour !", data: updatedUser });
  
    } catch (error) {
      return NextResponse.json({ error: `Erreur lors de la mise à jour de l'utilisateur : ${error}`, status: 500 });
    }
  }
