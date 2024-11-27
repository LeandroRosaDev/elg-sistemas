// src/middleware.ts
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Rota acessível apenas para administradores
  if (pathname.startsWith("/admin")) {
    if (!token || token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/erro-acesso", req.url));
    }
  }

  // Rota acessível apenas para moderadores e administradores
  if (pathname.startsWith("/pedidos")) {
    if (!token || (token.role !== "ADMIN" && token.role !== "MODERATOR")) {
      return NextResponse.redirect(new URL("/erro-acesso", req.url));
    }
  }

  // Permitir o acesso a todas as outras rotas
  return NextResponse.next();
}

// Define as rotas que o middleware vai monitorar
export const config = {
  matcher: [
    "/admin/:path*",
    "/pedidos/:path*",
    "/cliente/:path*",
    "/produtos/:path*",
    "/trocar-senha/:path*",
  ],
};
