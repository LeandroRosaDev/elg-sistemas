import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Certifique-se de que a importação do Prisma está correta
import { z } from "zod";

// Definindo o schema de validação com Zod
const produtoPrecoSchema = z.object({
  nome: z.string().nonempty("O nome é obrigatório"),
  nome_completo: z.string().nonempty("O nome completo é obrigatório"),
  categoria: z.string().nonempty("A categoria é obrigatória"),
  sub_categoria: z.string().nonempty("A sub-categoria é obrigatória"),
  valor: z.string().nonempty("O valor é obrigatório"),
  valor_parcelado: z.string().nonempty("O valor parcelado é obrigatório"),
  fornecedor: z.string().nonempty("O fornecedor é obrigatório"),
});

// Handler da rota `POST`
export async function POST(req: Request) {
  try {
    // Parseando o corpo da requisição
    const produtoData = await req.json();
    const parsedData = produtoPrecoSchema.parse(produtoData);

    // Inserindo os dados no banco de dados
    const newProduto = await prisma.produtoPreco.create({
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

    return NextResponse.json(newProduto, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error("Erro ao criar produto:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
