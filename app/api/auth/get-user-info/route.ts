import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import { authMiddleware } from "@/lib/middlewares/auth";

const prisma = new PrismaClient();

export const GET = async () => {
  try {
    const userInfo = await authMiddleware();

    // Vérifier si userInfo est un objet et contient une erreur
    if ((userInfo as { error?: string }).error) {
      return NextResponse.json({
        error: (userInfo as { error?: string }).error,
        status: 401,
      });
    }
    // Check if auth is an object and has an error property
    if (typeof userInfo === "object" && userInfo !== null && "error" in userInfo) {
      return NextResponse.json({
        error: "Token invalide. Accès non autorisé",
        userInfo,
        status: 401,
      });
    }

    if (!(userInfo as JwtPayload)?.id) {
      return NextResponse.json({
        error: "Token invalide. Accès non autorisé",
        userInfo,
        status: 401,
      });
    }
    // console.log("RouteUserInfo : ", userInfo);
    const user = await prisma.user.findUnique({
      where: {
        id: (userInfo as JwtPayload)?.id,
      },
    });

    return NextResponse.json({
      message: "Utilisateur récupéré avec succès",
      user: {
        id: user?.id,
        email: user?.email,
        username: user?.username,
        role: user?.role,
        avatar: user?.avatar,
      },
      status: 200,
    });
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
  } catch (error) {
    if (error instanceof Error) {
      // Si l'erreur est une instance de l'objet Error
      console.warn(error.message);
    } else {
      // Si ce n'est pas une erreur standard, affiche l'erreur telle quelle
      console.warn(error);
    }

    return NextResponse.json({
      error: "Erreur lors de la récupération des informations de l'utilisateur courant",
      status: 500,
    });
  }
};
