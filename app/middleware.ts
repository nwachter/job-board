import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SECRET_KEY = process.env.JWT_SECRET || "jwt_secret";
// This function can be marked `async` if using `await` inside
// export const middleware = (request: Request) => {
//   let userInfo;
//   let token;
//   const authorization = request.headers.get('Authorization');

//   if (
//     // request.url.includes('/dashboard') &&
//     (!authorization || !authorization?.startsWith('Bearer'))) {
//     return NextResponse.redirect(new URL('/sign', request.url))
//   }
//   if (authorization && authorization.startsWith('Bearer')) {
//     token = authorization.split(' ')[1];
//     userInfo = jwt.verify(token, process.env.JWT_SECRET || "secret_key");
//   }

//   return userInfo;

// }

export const authMiddleware = async (request?: Request) => {
  try {
    //Récupérer le token
    const token = (await cookies()).get("token")?.value;
    // let decodedToken;
    if (!token) {
      return NextResponse.json({ message: "Accès interdit" }, { status: 401 });
    }
    const decodedToken = jwt.verify(token || "", SECRET_KEY);

    if (request && decodedToken) {
      request.headers.set("Authorization", `Bearer ${token}`);
    }
    return decodedToken;
  } catch (error) {
    console.log("Erreur de décodage du token", error); // Log de l'erreur pour plus de détails
    return { error: "Token invalide ou expiré" };
  }
};

// See "Matching Paths" below to learn more
// export const config = {
//   matcher: ['/dashboard/:path*', '/profile/:path*', '/admin/:path*', '/jobs/new']
// }

// Define paths that should be protected
const protectedPaths = ["/dashboard", "/profile", "/admin"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Only check authentication for protected paths
  if (!protectedPaths.some((prefix) => path.startsWith(prefix))) {
    return NextResponse.next();
  }

  // const jwtCookie = req.cookies.get("token");
  const jwtCookie = (await cookies()).get('token');
  const userInfoCookie = (await cookies()).get('jobboard_user_info');

  if (!jwtCookie || !userInfoCookie) {
    // No JWT cookie or user info found, user is not authenticated
    return handleUnauthenticatedUser(req);
  }

  try {
    // Send the JWT to your backend for verification
    const authResponse = await fetch(`${req.nextUrl.origin}/api/auth/jwt-verify`, {
      method: "GET",
      headers: {
        Cookie: `token=${jwtCookie?.value}`, // testerror jwt au lieu de token
      },
      credentials: "include",
    });
    const decodedToken = jwt.verify(jwtCookie?.value || '', SECRET_KEY);
    if(req && decodedToken) {
      req.headers.set('Authorization', `Bearer ${jwtCookie?.value}`);

    }

    if (!authResponse.ok) {
      throw new Error("Authentication failed  (middle)");
    }

    const authData = await authResponse.json();

    if (!authData.valid) {
      return handleUnauthenticatedUser(req);
    }

    // User is authenticated, check role-based access
    return handleAuthenticatedUser(req, userInfoCookie.value);
  } catch (error) {
    console.error("Error checking authentication (middle):", error);
    return handleUnauthenticatedUser(req);
  }
}

function handleUnauthenticatedUser(req: NextRequest) {
  // Redirect to login page or show an error
  return NextResponse.redirect(new URL("/sign", req.url));
}

function handleAuthenticatedUser(req: NextRequest, userInfoString: string) {
  let userInfo;
  try {
    userInfo = JSON.parse(userInfoString);
  } catch (error) {
    console.error("Error parsing jobboard_user_info cookie: (handleAuth)", error);
    return NextResponse.redirect(new URL("/sign", req.url));
  }

  const path = req.nextUrl.pathname;
  const hasRole = (role: string) =>
    Array.isArray(userInfo.role)
      ? userInfo.role.includes(role)
      : userInfo.role === role;

  if (path.startsWith("/admin")) {
    if (hasRole("ADMIN")) {
      return NextResponse.next();
    }

    // Si l'utilisateur n'a pas le rôle approprié, redirigez-le
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Check if the path is /client and if the user has 'admin' role
  if (path.startsWith("/admin") && !hasRole("ADMIN")) {
    return NextResponse.redirect(new URL("/sign", req.url));
  }

  // Check if the path is /dashboard and if the user has 'recruiter' or 'user' role
  if (
    path.startsWith("/dashboard") &&
    (!hasRole("recruiter") || !hasRole("user"))
  ) {
    return NextResponse.redirect(new URL("/sign", req.url));
  }

  // User has the correct role for the path, allow the request
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
