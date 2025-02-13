import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


 export type Application = {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    offer_id: number;
    user_id: number;
    cv: string;
 }

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