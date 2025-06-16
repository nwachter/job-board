import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "@/lib/middlewares/auth";

const prisma = new PrismaClient();

/*
model Skill {
model Skill {
  id            Int      @id @default(autoincrement())
  title         String
  description   String
  company_name  String
  salary        Int
  location      Location? @relation(fields: [location_id], references: [id])
  location_id   Int?
  contract_type String?
  recruiter         User     @relation("RecruiterSkills", fields: [recruiter_id], references: [id])
  recruiter_id      Int

  applications  Application[]
}

}
*/
export async function GET() {
  // request: Request
  try {
    const skills = await prisma.skill.findMany({
      include: {
        users: true,
      },
    });
    return NextResponse.json(skills);
  } catch (error) {
    return NextResponse.json({
      error: "Erreur lors de la recherche des compétences...",
      status: 500,
    });
  }
}

export async function POST(request: Request) {
  try {
    const { name, level } = await request.json();

    if (!name) {
      return NextResponse.json({
        error: "Il manque des champs requis",
        status: 400,
      });
    }

    const skillData = { name, ...(level && { level: level }) };
    const newSkill = await prisma.skill.create({
      data: {
        ...skillData,
      },
    });

    return NextResponse.json({
      message: "Offre créée !",
      data: newSkill,
      status: 201,
    });
  } catch (e) {
    return NextResponse.json({
      error: "Erreur lors de la création de la compétence !",
      e,
      status: 500,
    });
  }
}
