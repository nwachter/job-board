// import { NextRequest, NextResponse } from "next/server";

// import DOMPurify from "isomorphic-dompurify";

// export function sanitizeHtml(dirty: string): string {
//   return DOMPurify.sanitize(dirty, {
//     ALLOWED_TAGS: ["b", "i", "em", "strong", "p", "br"],
//     ALLOWED_ATTR: [],
//   });
// }

// export function validateEmail(email: string): boolean {
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return emailRegex.test(email);
// }

// export function validatePassword(password: string): {
//   isValid: boolean;
//   errors: string[];
// } {
//   const errors: string[] = [];

//   if (password.length < 8) {
//     errors.push("Le mot de passe doit contenir au moins 8 caractères");
//   }

//   if (!/[A-Z]/.test(password)) {
//     errors.push("Le mot de passe doit contenir au moins une majuscule");
//   }

//   if (!/[a-z]/.test(password)) {
//     errors.push("Le mot de passe doit contenir au moins une minuscule");
//   }

//   if (!/\d/.test(password)) {
//     errors.push("Le mot de passe doit contenir au moins un chiffre");
//   }

//   return {
//     isValid: errors.length === 0,
//     errors,
//   };
// }

// export function sanitizeInput(req: NextRequest) {
//   // Supprime les scripts malveillants
//   const sanitizeString = (str: string) => {
//     return str
//       .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
//       .replace(/javascript:/gi, "")
//       .replace(/on\w+\s*=/gi, "")
//       .trim();
//   };

//   const sanitizeObject = (obj: any): any => {
//     if (typeof obj === "string") {
//       return sanitizeString(obj);
//     }
//     if (Array.isArray(obj)) {
//       return obj.map(sanitizeObject);
//     }
//     if (obj && typeof obj === "object") {
//       const sanitized: any = {};
//       for (const key in obj) {
//         sanitized[key] = sanitizeObject(obj[key]);
//       }
//       return sanitized;
//     }
//     return obj;
//   };

//   return sanitizeObject;
// }
