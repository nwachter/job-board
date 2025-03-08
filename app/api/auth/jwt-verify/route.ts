import { NextRequest, NextResponse } from 'next/server'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const GET = async (request: NextRequest) => {
    try {
        const SECRET_KEY = process.env.JWT_SECRET ?? '';
        const tokenCookie = request.cookies.get('token');
        if (!tokenCookie) {
            return NextResponse.json({ error: "Token manquant. Accès non autorisé (jwt-v)", status: 401 });
        }

        const decodedToken = jwt.verify(tokenCookie.value, SECRET_KEY);
        if (typeof decodedToken === 'string') {
            return NextResponse.json({ error: "Token invalide. Accès non autorisé (jwt-v)", status: 401 });
        }
        const auth: JwtPayload & { id: number } = decodedToken as JwtPayload & { id: number };

        const user = await prisma.user.findUnique({
            where: {
                id: auth?.id,
            }
        });
     
      
       return NextResponse.json({message: "Token validé avec succès (jwt-v)", user: {id: user?.id, email: user?.email, username: user?.username, role: user?.role, avatar: user?.avatar}, valid: true,  status: 200});

    } catch(error) {
        console.log(error);
        return NextResponse.json({error: "Erreur lors de la vérification du token et de la récupération des informations de l'utilisateur courant (jwt-v)", status: 500});

    }
};