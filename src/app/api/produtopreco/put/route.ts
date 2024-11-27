import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schema de validação de entrada
const updateProdutoSchema = z.object({
  id: z.number({ required_error: "O ID do produto é obrigatório" }),
  nome: z.string().optional(),
  nome_completo: z.string().optional(),
  categoria: z.string().optional(),
  sub_categoria: z.string().optional(),
  valor: z.string().optional(),
  valor_parcelado: z.string().optional(),
  fornecedor: z.string().optional(),
});

// Método PUT para atualização de produto
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    // Validando os dados de entrada
    const parsedData = updateProdutoSchema.parse(body);

    // Verificando se o produto existe antes de atualizar
    const produtoExistente = await prisma.produtoPreco.findUnique({
      where: { id: parsedData.id },
    });

    if (!produtoExistente) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    // Atualizando o produto no banco de dados
    const produtoAtualizado = await prisma.produtoPreco.update({
      where: { id: parsedData.id },
      data: {
        nome: parsedData.nome,
        nome_completo: parsedData.nome_completo,
        categoria: parsedData.categoria,
        sub_categoria: parsedData.sub_categoria,
        valor: parsedData.valor,
        valor_parcelado: parsedData.valor_parcelado,
        fornecedor: parsedData.fornecedor,
      },
    });

    return NextResponse.json(produtoAtualizado, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Erro ao atualizar o produto:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
