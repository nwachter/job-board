import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


type Params = {
  id: string,
}

export async function GET(request: Request, { params }: { params: Params }) {
    try {
        const offers = await prisma.offer.findMany({
            include: {
                user: true,   
        }
        });
        return NextResponse.json({message: "Offres récupérées avec succès", data: offers});

    } catch(error) {
        return NextResponse.json({error: "Erreur lors de la recherche des offres...", status: 500});
    }

}
  
  export const PUT = async (request: Request, {params}: {params: Params}) => {
    const {id} = await params;
    const {title, description, company_name, location, salary, user_id} = await request.json();

    if (!id) {
     return NextResponse.json({ error: "L'ID de l'offre est requis pour la mise à jour", status: 400 });
   }

   const updatedData = await prisma.offer.update({
    where: {
      id: Number(id),
    }, 
    data: {title, description, company_name, location, salary, user_id }
});

return NextResponse.json({ message: "L'offre a été mise à jour avec succès !", data: updatedData, status: 200 });

  };
  
  export const DELETE = async (request: Request, {params}: {params: Params}) => {
    try {
       const {id} = await params;

       if (!id) {
        return NextResponse.json({ error: "L'ID de l'offre est requis pour la suppression", status: 400 });
      }

    const deletedOffer = prisma.offer.delete({where: {id: Number(id)}});
  
    if (deletedOffer === null) {
      return NextResponse.json({ error: "L'offre n'a pas été trouvée !", status: 404, data: null });
    }

    return NextResponse.json({ message: "Offre supprimée !", data: deletedOffer });

    } catch(error) {
          return NextResponse.json({ message: "Erreur lors de la suppression de l'offre...", data: null }, { status: 404 });
    } 
  };