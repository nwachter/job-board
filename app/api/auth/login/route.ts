import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import  jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export const POST = async (request: Request) => {
    const {email, password} = await request.json();
    try {
        const user = await prisma?.user?.findUnique({
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
        const token = jwt.sign({id: user.id, email: user.email, role: user.role, username: user.username, avatar: user.avatar}, process.env.JWT_SECRET || "jwt_secret", {expiresIn: "1d"});
        const userInfo = {id: user.id, email, username: user.username, role: user.role, avatar: user.avatar};
        const response =  NextResponse.json({message: "Connexion réussie !", user: userInfo, token, status: 200});
       
        //Générer le cookie
        (await
            cookies()).set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'strict',
            maxAge: 5*24*60*60, //1 jour
            path: '/', // Accessible sur le site entier
        });

        (await
            cookies()).set('jobboard_user_info', JSON.stringify(userInfo), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'strict',
            maxAge: 5*24*60*60, //1 jour
            path: '/', // Accessible sur le site entier
        });

        return response;

    } catch(error) {
        console.log(error);
        return NextResponse.json({error: "Erreur lors de la connexion...", status: 500});

    }
};