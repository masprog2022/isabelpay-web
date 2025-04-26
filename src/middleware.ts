// src/middleware.ts
import { jwtDecode } from "jwt-decode";
import { NextResponse, type NextRequest } from "next/server";

interface DecodedToken {
  sub: string;
  roles: string[];
  exp: number;
}

const publicRoutes = [
  {
    path: "/login",
    whenAuthenticated: "redirect" as const,
  },
] as const;

const protectedRoutes = ["/", "/resident", "/payment", "/debtors"];
const adminRoutes = ["/admin"]; // Exemplo de rotas específicas para admin

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = "/login";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const publicRoute = publicRoutes.find((route) => route.path === path);
  const isProtectedRoute = protectedRoutes.includes(path);
  const isAdminRoute = adminRoutes.some((route) => path.startsWith(route));

  const authToken = request.cookies.get("token")?.value;

  const isTokenExpired = (token: string): boolean => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };

  const getUserRoles = (token: string): string[] | null => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded.roles;
    } catch {
      return null;
    }
  };

  // Rotas públicas sem token
  if (!authToken && publicRoute) {
    return NextResponse.next();
  }

  // Acesso a rota protegida sem token
  if (!authToken && (isProtectedRoute || isAdminRoute)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE;
    return NextResponse.redirect(redirectUrl);
  }

  // Com token
  if (authToken) {
    // Token expirado
    if (isTokenExpired(authToken)) {
      const response = NextResponse.redirect(
        new URL(REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE, request.url)
      );
      response.cookies.delete("token");
      return response;
    }

    const roles = getUserRoles(authToken);

    // Verificar acesso a rotas de admin
    if (isAdminRoute && !roles?.includes("ROLE_ADMIN")) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/unauthorized"; // Ou para a home
      return NextResponse.redirect(redirectUrl);
    }

    // Token válido tentando acessar rota pública (login)
    if (publicRoute && publicRoute.whenAuthenticated === "redirect") {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/";
      return NextResponse.redirect(redirectUrl);
    }

    // Token válido e acessando rota permitida
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - sitemap.xml (sitemap)
     * - robots.txt (robots file)
     * - images (public images)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|images).*)",
  ],
};
