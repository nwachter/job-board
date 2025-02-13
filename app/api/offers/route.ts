import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { DecodedToken } from "../auth/register/route";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();


/*
model Offer {
  id            Int      @id @default(autoincrement())
  title         String
  description   String
  company_name  String
  salary        Int
  location      String
  admin         User     @relation("AdminOffers", fields: [admin_id], references: [id], onDelete: Cascade)
  admin_id      Int

  applications  Application[]
}

*/
export async function GET() {
    try {
        const offers = await prisma.offer.findMany({
            include: {
                admin: true,   
        }
        });
        return NextResponse.json(offers);

    } catch(error) {
        return NextResponse.json({error: "Erreur lors de la recherche des offres...", status: 500});
    }

}

export async function POST(request: Request) {
    try {
        //Sécurisation de la route - Authorization         Bearer
                const authHeader = request.headers.get('Authorization');
                if(!authHeader || !authHeader.startsWith('Bearer')) { 
                return NextResponse.json({error: "Accès non autorisé", status: 401});
                }    
                //Extraire le token
                const token = authHeader.split(' ')[1];
                //Vérifer le token
                let verifiedToken : DecodedToken | undefined;
                
                try {
                  verifiedToken = jwt.verify(token, process.env.JWT_SECRET || "jwt_secret") as DecodedToken;
                } catch(error) {
                 return NextResponse.json({error: "Accès non autorisé", status: 401});
      
      
                }
                if(verifiedToken?.role !== "admin") {
                 return NextResponse.json({error: "Accès non autorisé", status: 401});
                }
      
        
        const {title, description, salary, location, user_id, company_name, admin_id} = await request.json();

        //Vérifier si l'user existe
        const user = await prisma.user.findUnique({
            where: {
                id: user_id,
            }
        })
        if(!user) {
            return NextResponse.json({error: "Utilisateur introuvable"}, {status: 404});
        }

        if (!title || !description || !user_id) {
            return NextResponse.json({ error: "Il manque des champs requis", status: 400 });
          }

        const newOffer = await prisma.offer.create({
            data: {
              title,
              description,
              salary,
              location,
              company_name,
              admin_id,
              admin: {
                connect: {
                  id: admin_id,
                },
              }
      
            },
            include: { admin: true },
          });

          

        return NextResponse.json({message: "Offre créée !", data: newOffer});

    } catch(e) {
        return NextResponse.json({error: "Erreur lors de la création de l'offre !", status: 500});
    }
}