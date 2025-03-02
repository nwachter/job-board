import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


type QueryParameters =
{
    [key: string]: { contains?: string } | { city?: { contains?: string } } | { location_id?: number } | { contract_type?: string };
}

export async function POST(request: Request) {
    try {
  
      const { searchQuery, contractType, locationId } = await request.json();

  const queryParameters  : QueryParameters[] = [
    { title: { contains: searchQuery } },
    { description: { contains: searchQuery } },
    { company_name: { contains: searchQuery } },
    { location: { city: { contains: searchQuery } } },
    { location_id: locationId }
 ];
    if(contractType !== "") {
        queryParameters.push({ contract_type: contractType });
    }
 
      const offers = await prisma.offer.findMany({
        where: {
          OR: queryParameters,
        },
        include: {
          recruiter: true,
          applications: true,
          location: true,
        },
      });
  
      return NextResponse.json(offers);
  
    } catch (e: unknown) {
      console.error("Error searching offers:", e);
      return NextResponse.json({ error: "Erreur lors de la recherche des offres !", status: 500 });
    }
  }