import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt, { Jwt } from 'jsonwebtoken'
import { cookies } from 'next/headers';

const SECRET_KEY = process.env.JWT_SECRET || "jwt_secret";
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  let userInfo;
  let token;
  const authorization = request.headers.get('Authorization');

  if (
    // request.url.includes('/dashboard') &&
    (!authorization || !authorization?.startsWith('Bearer'))) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  if (authorization && authorization.startsWith('Bearer')) {
    token = authorization.split(' ')[1];
    userInfo = jwt.verify(token, process.env.JWT_SECRET || "secret_key");
  }
  if (userInfo) {

  }

}

export const authMiddleware = async () => {
  try {
    //Récupérer le token
    const token = (await cookies()).get('token')?.value;
    let decodedToken;
    // if (!token) {
    //   return NextResponse.json({ message: 'Accès interdit' }, { status: 401 });
    // }
    decodedToken = jwt.verify(token || '', process.env.JWT_SECRET ?? "jwt_secret");
    return decodedToken

    //  if(!decodedToken) {
    //   return NextResponse.json({ error: "Accès non autorisé", status: 401 });

    //  }


  } catch (error) {

    console.log(error)
    return { error }
  }
}
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/admin/:path*']
}