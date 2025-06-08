import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SECRET_KEY = process.env.JWT_SECRET || "jwt_secret";

// For API routes
// export const authMiddleware = async (request?: Request) => {
//   try {
//     const token = (await cookies()).get("token")?.value;

//     if (!token) {
//       return NextResponse.json({ message: "Accès interdit" }, { status: 401 });
//     }

//     const decodedToken = jwt.verify(token, SECRET_KEY);

//     if (request && decodedToken) {
//       request.headers.set("Authorization", `Bearer ${token}`);
//     }

//     return decodedToken;
//   } catch (error) {
//     console.log("Erreur de décodage du token", error);
//     return { error: "Token invalide ou expiré" };
//   }
// };

export const authMiddleware = async (request?: Request) => {
  try {
    const allCookies = await cookies();
    console.log("All cookies:", allCookies.getAll()); // Debug line

    const token = allCookies.get("token")?.value;
    console.log("Token found:", !!token); // Debug line

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

// Protected paths and their required roles
const protectedRoutes = {
  "/dashboard": ["user", "recruiter"],
  "/profile": ["user", "recruiter", "admin"],
  "/admin": ["admin"],
};

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Check if current path needs protection (dash, pro, admin)
  const matchedRoute = Object.keys(protectedRoutes).find((route) =>
    path.startsWith(route),
  );

  // If no protected route matches, allow request
  if (!matchedRoute) {
    return NextResponse.next();
  }

  const requiredRoles =
    protectedRoutes[matchedRoute as keyof typeof protectedRoutes];

  // Get cookies
  const jwtCookie = req.cookies.get("token");
  const userInfoCookie = req.cookies.get("jobboard_user_info");

  if (!jwtCookie || !userInfoCookie) {
    return handleUnauthenticatedUser(req);
  }

  try {
    // Verify JWT token locally first
    const decodedToken = jwt.verify(jwtCookie.value, SECRET_KEY);

    if (!decodedToken) {
      return handleUnauthenticatedUser(req);
    }

    // Parse user info from cookie
    let userInfo;
    try {
      userInfo = JSON.parse(userInfoCookie.value);
    } catch (error) {
      console.error("Error parsing jobboard_user_info cookie:", error);
      return handleUnauthenticatedUser(req);
    }

    // Check if user has required role
    if (!hasRequiredRole(userInfo.role, requiredRoles)) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // (facultat) Add authorization header for downstream API calls
    const response = NextResponse.next();
    response.headers.set("Authorization", `Bearer ${jwtCookie.value}`);

    return response;
  } catch (error) {
    console.error("Error in middleware authentication:", error);
    return handleUnauthenticatedUser(req);
  }
}

function handleUnauthenticatedUser(req: NextRequest) {
  return NextResponse.redirect(new URL("/sign", req.url));
}

function hasRequiredRole(
  userRole: string | string[],
  requiredRoles: string[],
): boolean {
  if (Array.isArray(userRole)) {
    return userRole.some((role) => requiredRoles.includes(role));
  }
  return requiredRoles.includes(userRole);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - sign (login page)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|sign).*)",
  ],
};
