import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import  { JwtPayload } from "jsonwebtoken";
import { authMiddleware } from "@/app/middleware";

const prisma = new PrismaClient();


export const GET = async () => {
    // const {email, password} = await request.json();
    try {
        // const user = await prisma?.user?.findUnique({
        //     where: {
        //         email: email,
        //     }
        // });

        //Générer le token

        const userInfo = await authMiddleware();
        // Check if auth is an object and has an error property
        if (typeof userInfo === 'object' && userInfo !== null && 'error' in userInfo) {
            return NextResponse.json({ error: "Token invalide. Accès non autorisé", status: 401 });
          }
        const user = await prisma.user.findUnique({
            where: {
                id: (userInfo as JwtPayload)?.id,
            }
        });
     
      
       return NextResponse.json({message: "Utilisateur récupéré avec succès", user: {id: user?.id, email: user?.email, username: user?.username, role: user?.role, avatar: user?.avatar},  status: 200});
        //Générer le cookie
    //    const token =  (await cookies()).get('token')?.value;
    //    if(!token) {
    //           return NextResponse.json({error: "Accès non autorisé", status: 401});
    //    }
    //    const userInfo = jwt.verify(token || '', process.env.JWT_SECRET || "jwt_secret");
    //    if(!userInfo) {
    //           return NextResponse.json({error: "Accès non autorisé", status: 401});
    //    }
    //     return userInfo;

    } catch(error) {
        console.log(error);
        return NextResponse.json({error: "Erreur lors de la récupération des informations de l'utilisateur courant", status: 500});

    }
};