import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import  jwt from "jsonwebtoken";
const prisma = new PrismaClient();

export const GET = async (request: Request) => {
    
 };

export const POST = async (request: Request) => {
    const {email, password} = await request.json();
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            }
        });

        if(!email || !password) { 
            return NextResponse.json({error: "Veuillez remplir tous les champs", status: 400});
        }
        if(!user) {
            return NextResponse.json({error: "L'utilisateur n'existe pas", status: 400});
        }
        const passwordMatched = await bcrypt.compare(password, user.password);
        if(!passwordMatched) {
            return NextResponse.json({error: "Mot de passe incorrect", status: 401});
        }

        //Générer le token
        const token = jwt.sign({id: user.id, email: user.email}, process.env.JWT_SECRET || "jwt_secret", {expiresIn: "1d"});

        return NextResponse.json({message: "Connexion réussie !", user: {id: user.id, email, username: user.username, role: user.role}, token, status: 200});

    } catch(error) {
        console.log(error);
        return NextResponse.json({error: "Erreur lors de la connexion...", status: 500});

    }

};