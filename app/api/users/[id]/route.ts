import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


type Params = {
  id: string,
}

export async function GET(request: Request, { params }: { params: Params }) {
    try {
        const users = await prisma.user.findMany({
            include: {
                offers: true,   
        }
        });
        return NextResponse.json({message: "Utilisateurs récupérés avec succès", data: users});

    } catch(error) {
        return NextResponse.json({error: "Erreur lors de la recherche des utilisateurs...", status: 500});
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
    data: {username, email, role}
});

return NextResponse.json({ message: "L'utilisateur a été mis à jour avec succès !", data: updatedData, status: 200 });

  };
  
  export const DELETE = async (request: Request, {params}: {params: Params}) => {
    try {
       const {id} = await params;

       if (!id) {
        return NextResponse.json({ error: "L'ID de l'utilisateur est requis pour la suppression", status: 400 });
      }

    const deletedUser = prisma.user.delete({where: {id: Number(id)}});
  
    if (deletedUser === null) {
      return NextResponse.json({ error: "L'utilisateur n'a pas été trouvé !", status: 404, data: null });
    }

    return NextResponse.json({ message: "Utilisateur supprimé !", data: deletedUser });

    } catch(error) {
          return NextResponse.json({ message: "Erreur lors de la suppression de l'utilisateur...", data: null }, { status: 404 });
    } 
  };