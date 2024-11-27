// src/app/api/operations/delete/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    // Exclui a operação do banco de dados com base no ID
    await prisma.operacaoFinanceira.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Operação excluída com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao excluir operação:", error);
    return NextResponse.json(
      { error: "Erro ao excluir operação" },
      { status: 500 }
    );
  }
}
