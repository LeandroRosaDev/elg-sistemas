// src/app/api/auth/trocar-senha/route.ts
import { prisma } from "@/lib/prisma";
import { hash, compare } from "bcryptjs";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const { currentPassword, newPassword } = await request.json();

  if (!session || !session.user?.email) {
    return NextResponse.json(
      { error: "Usuário não autenticado" },
      { status: 401 }
    );
  }

  // Busca o usuário no banco de dados
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Usuário não encontrado" },
      { status: 404 }
    );
  }

  // Verifica se a senha atual está correta
  const isPasswordValid = await compare(currentPassword, user.password);

  if (!isPasswordValid) {
    return NextResponse.json(
      { error: "Senha atual incorreta" },
      { status: 400 }
    );
  }

  // Gera um hash para a nova senha
  const hashedPassword = await hash(newPassword, 12);

  // Atualiza a senha no banco de dados
  await prisma.user.update({
    where: { email: user.email },
    data: { password: hashedPassword },
  });

  return NextResponse.json({ message: "Senha alterada com sucesso" });
}
