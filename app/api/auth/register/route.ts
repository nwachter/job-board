import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface DecodedToken extends JwtPayload {id: string, email: string, role: string};

const prisma = new PrismaClient();

export const POST = async (request: Request) => { 
    try {
        //   //Sécurisation de la route - Authorization         Bearer
        //   const authHeader = request.headers.get('Authorization');
        //   if(!authHeader || !authHeader.startsWith('Bearer')) { 
        //   return NextResponse.json({error: "Accès non autorisé", status: 401});
        //   }    
        //   //Extraire le token
        //   const token = authHeader.split(' ')[1];
        //   //Vérifer le token
        //   let verifiedToken : DecodedToken | undefined;
          
        //   try {
        //     verifiedToken = jwt.verify(token, process.env.JWT_SECRET || "jwt_secret") as DecodedToken;
        //   } catch(error) {
        //    return NextResponse.json({error: "Accès non autorisé", status: 401});


        //   }
        //   if(verifiedToken?.role !== "admin") {
        //    return NextResponse.json({error: "Accès non autorisé", status: 401});
        //   }


        const {email, password, username, role} = await request.json();

        if(!email || !password) { 
            return NextResponse.json({error: "Veuillez remplir tous les champs", status: 400});
        }
 
        //Vérifier si l'utilisateur existe dans la BDD
        const existUser = await prisma.user.findUnique({
            where: {
                email: email,
            }
         });

         if(existUser) {
                return NextResponse.json({error: "L'utilisateur existe déjà", status: 400});
          }


        const encryptedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                email: email,
                username: username ?? "user"+Math.floor(Math.random() * 1000),
                password: encryptedPassword,
                role: role ?? "user"
            }
        });
        return NextResponse.json({user: newUser, status: 200});
    } catch(error) {
        return NextResponse.json({error: "Erreur lors de le l'inscription...", status: 500});
    }

}