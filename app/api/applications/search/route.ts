import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/*

model Application {
  id         Int     @id @default(autoincrement())
  firstname  String
  lastname   String
  email      String
  offer      Offer   @relation(fields: [offer_id], references: [id])
  offer_id   Int
  user       User    @relation(fields: [user_id], references: [id])
  user_id    Int
  cv         String
}


*/
type QueryParameters =
{
    [key: string]: { contains?: string } | { city?: { contains?: string } } | { location_id?: number } | { contract_type?: string };
}

export async function POST(request: Request) {
    try {
  
      const { searchQuery } = await request.json();


  const queryParameters  : QueryParameters[] = [
    { title: { contains: searchQuery } },
    { description: { contains: searchQuery } },
    { company_name: { contains: searchQuery } },
    { location: { city: { contains: searchQuery } } },
 ];
  
 
      const applications = await prisma.application.findMany({
        where: {
          OR: queryParameters,
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true
            }
          }
        }
      });
  
      return NextResponse.json(applications);
  
    } catch (e: unknown) {
      console.error("Error searching applications:", e);
      return NextResponse.json({ error: "Erreur lors de la recherche des offres !", status: 500 });
    }
  }