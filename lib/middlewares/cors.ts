// import { NextRequest } from "next/server";

// export function corsMiddleware(req: NextRequest) {
//   const origin = req.headers.get("origin");
//   const allowedOrigins = [
//     "http://localhost:3000",
//     "http://localhost:3000/",
//     "https://jobboard.nwproject.fr",
//     "https://jobboard.nwproject.fr/",
//   ];

//   const headers = new Headers();

//   if (allowedOrigins.includes(origin || "")) {
//     headers.set("Access-Control-Allow-Origin", origin || "");
//   }

//   headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
//   headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   headers.set("Access-Control-Max-Age", "86400");

//   return headers;
// }
