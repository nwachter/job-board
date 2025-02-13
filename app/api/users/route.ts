import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client'
import { cookies } from "next/headers";
import { DecodedToken } from "@/app/types/misc";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient()

export const GET = async () => {
    try {
        const users = await prisma.user.findMany({ include: { offers: true, applications: true } });
        return NextResponse.json({data: users, status: 200});

    } catch(e) {
        console.error("Une erreur s'est produite lors de la recherche des utilisateurs :", e);
        return NextResponse.json({ message: "Erreur lors de la recherche des utilisateurs", data: null }, { status: 404 });
    }
   
};


/*
Whenever you make changes to your database that are reflected in the Prisma schema, you need to manually re-generate Prisma Client to update the generated code in the node_modules/.prisma/client directory:

prisma generate

*/