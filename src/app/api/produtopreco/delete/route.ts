import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Método DELETE para exclusão de produto
export async function DELETE(req: NextRequest) {
  try {
    // Extraindo os dados do corpo da requisição
    const { id } = await req.json();

    // Verificando se o ID foi fornecido
    if (!id) {
      return NextResponse.json(
        { error: "O ID do produto é obrigatório para a exclusão" },
        { status: 400 }
      );
    }

    // Deletando o produto do banco de dados
    await prisma.produtoPreco.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(
      { message: "Produto deletado com sucesso" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao deletar o produto:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
