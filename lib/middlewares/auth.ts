import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SECRET_KEY = process.env.JWT_SECRET || "jwt_secret";

export const authMiddleware = async (request?: Request) => {
  try {
    const allCookies = await cookies();
    //console.log("All cookies:", allCookies.getAll()); // Debug line

    const token = allCookies.get("token")?.value;
    // console.log("Token found:", !!token); // Debug line

    if (!token) {
      return NextResponse.json({ message: "Accès interdit" }, { status: 401 });
    }

    const decodedToken = jwt.verify(token, SECRET_KEY);

    return decodedToken;
  } catch (error) {
    console.log("Erreur de décodage du token", error);
    return { error: "Token invalide ou expiré" };
  }
};
