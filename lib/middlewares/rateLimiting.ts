// middlewares/rateLimiting.ts
import { NextRequest, NextResponse } from "next/server";

// Cache simple pour stocker les requêtes
const requestCache = new Map<string, { count: number; resetTime: number }>();

// Fonction pour nettoyer le cache des entrées expirées
function cleanupCache() {
  const now = Date.now();
  for (const [key, data] of requestCache.entries()) {
    if (now > data.resetTime) {
      requestCache.delete(key);
    }
  }
}

// Fonction principale de rate limiting
export function checkRateLimit(
  request: NextRequest,
  maxRequests: number = 5,
  windowMinutes: number = 60
): { isLimited: boolean; response?: NextResponse } {
  // Nettoyer le cache
  cleanupCache();

  // Récupérer l'IP
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";

  const now = Date.now();
  const windowMs = windowMinutes * 60 * 1000;
  const resetTime = now + windowMs;

  const existing = requestCache.get(ip);

  if (!existing) {
    // Première requête
    requestCache.set(ip, { count: 1, resetTime });
    return { isLimited: false };
  }

  if (now > existing.resetTime) {
    // Fenêtre expirée, reset
    requestCache.set(ip, { count: 1, resetTime });
    return { isLimited: false };
  }

  if (existing.count >= maxRequests) {
    // Limite atteinte
    const response = NextResponse.json(
      {
        error: "Trop de requêtes. Réessayez plus tard.",
        retryAfter: Math.ceil((existing.resetTime - now) / 1000),
      },
      { status: 429 }
    );
    return { isLimited: true, response };
  }

  // Incrémenter le compteur
  existing.count++;
  return { isLimited: false };
}
