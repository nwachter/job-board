import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const GET = async () => {
    try {
        const users = await prisma.user.findMany()
        return NextResponse.json({data: users});

    } catch(e) {
        console.error("Une erreur s'est produite lors de la recherche des utilisateurs :", e);
        return NextResponse.json({ message: "Erreur lors de la recherche des utilisateurs", data: null }, { status: 404 });
    }
   
};

export const POST = async (request: Request) => { 
    const userData = await request.json();
    try {
        const users = await prisma.user.findMany()
        const lastId = users.length > 0 ? users[users.length - 1]?.id : 1;
        const newUser = await prisma.user.create({
            data: {id:  lastId + 1, ...userData}
            // {
            //   name: 'Alice',
            //   email: 'alice@prisma.io',
            // }
            ,
          });
          return NextResponse.json({ message: "Utilisateur ajouté !", data: newUser });

    } catch(e) {
        console.error("Une erreur s'est produite lors de la création de l'utilisateur :", e);
        return NextResponse.json({ message: "Erreur lors de la création de l'utilisateur", data: null }, { status: 404 });

    }

}

/*
Whenever you make changes to your database that are reflected in the Prisma schema, you need to manually re-generate Prisma Client to update the generated code in the node_modules/.prisma/client directory:

prisma generate

*/