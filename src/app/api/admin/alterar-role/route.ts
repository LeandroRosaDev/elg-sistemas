// src/app/api/admin/alterar-role/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const { userId, newRole } = await request.json();

  // Verifica se o usuário está autenticado e se é administrador
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Permissão negada" }, { status: 403 });
  }

  // Valida se o novo role é um dos valores permitidos
  const validRoles = ["ADMIN", "MODERATOR", "USER"];
  if (!validRoles.includes(newRole)) {
    return NextResponse.json(
      { error: "Nível de acesso inválido" },
      { status: 400 }
    );
  }

  // Atualiza o nível de acesso do usuário
  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
  });

  return NextResponse.json({
    message: "Nível de acesso atualizado com sucesso",
  });
}
