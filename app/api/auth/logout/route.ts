import { authMiddleware } from "@/lib/middlewares/auth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  // const response = NextResponse.json({ message: 'Logged out' }, { status: 200 });

  const auth = authMiddleware();
  if (typeof auth === "object" && auth !== null && "error" in auth) {
    return NextResponse.json(
      { message: "Vous n'êtes pas connecté, donc vous ne pouvez pas vous deconnecter" },
      { status: 401 }
    );
  }

  (await cookies()).set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0), //Expire immédiatement
    path: "/",
  });

  NextResponse.redirect(new URL("/", `${req.nextUrl.origin}`));

  return NextResponse.json({ message: "Logged out" }, { status: 200 });
};
