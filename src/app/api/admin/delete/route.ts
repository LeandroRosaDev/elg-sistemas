import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);

  // Verifica se o usuário está autenticado e é um administrador
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Permissão negada" }, { status: 403 });
  }

  // Extrai o ID do usuário a ser deletado
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("id");

  if (!userId) {
    return NextResponse.json(
      { error: "ID de usuário não fornecido" },
      { status: 400 }
    );
  }

  try {
    // Verifica se o usuário que está tentando ser excluído existe
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // Exclui o usuário do banco de dados
    await prisma.user.delete({ where: { id: Number(userId) } });

    return NextResponse.json(
      { message: "Usuário excluído com sucesso" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Erro ao excluir o usuário" },
      { status: 500 }
    );
  }
}
