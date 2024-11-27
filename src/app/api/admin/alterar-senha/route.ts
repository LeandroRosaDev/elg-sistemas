// src/app/api/admin/alterar-senha/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { hash } from "bcryptjs";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const { userId, newPassword, passwordConfirmation } = await request.json();

  // Verifica se o usuário está autenticado e se é administrador
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Permissão negada" }, { status: 403 });
  }

  // Verifica se as senhas coincidem
  if (newPassword !== passwordConfirmation) {
    return NextResponse.json(
      { error: "As senhas não coincidem" },
      { status: 400 }
    );
  }

  // Verifica se a nova senha é válida (pode adicionar mais regras, como comprimento mínimo)
  if (newPassword.length < 6) {
    return NextResponse.json(
      { error: "A senha deve ter no mínimo 6 caracteres" },
      { status: 400 }
    );
  }

  // Hash da nova senha
  const hashedPassword = await hash(newPassword, 10);

  // Atualiza a senha do usuário
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return NextResponse.json({
    message: "Senha atualizada com sucesso",
  });
}
