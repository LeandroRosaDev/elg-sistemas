// src/app/api/admin/alterar-email/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const { userId, newEmail } = await request.json();

  // Verifica se o usuário está autenticado e se é administrador
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Permissão negada" }, { status: 403 });
  }

  // Verifica se o e-mail é válido
  if (!newEmail || !newEmail.includes("@")) {
    return NextResponse.json(
      { error: "Por favor, forneça um e-mail válido" },
      { status: 400 }
    );
  }

  // Atualiza o e-mail do usuário
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { email: newEmail },
    });

    return NextResponse.json({
      message: "E-mail atualizado com sucesso",
    });
  } catch {
    return NextResponse.json(
      { error: "Erro ao atualizar o e-mail" },
      { status: 500 }
    );
  }
}
