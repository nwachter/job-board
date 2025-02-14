import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import  jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const prisma = new PrismaClient();


export const GET = async (request: Request) => {
    const {email, password} = await request.json();
    try {
        const user = await prisma?.user?.findUnique({
            where: {
                email: email,
            }
        });


        //Générer le token
      
       
        //Générer le cookie
       const token =  (await cookies()).get('token')?.value;
       if(!token) {
              return NextResponse.json({error: "Accès non autorisé", status: 401});
       }
       const userInfo = jwt.verify(token || '', process.env.JWT_SECRET || "jwt_secret");
       if(!userInfo) {
              return NextResponse.json({error: "Accès non autorisé", status: 401});
       }
        return userInfo;

    } catch(error) {
        console.log(error);
        return NextResponse.json({error: "Erreur lors de la récupération des informations de l'utilisateur courant", status: 500});

    }
};