import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Definição da interface para filtros de busca
interface SearchFilters {
  nome?: { contains: string; mode: "insensitive" };
  nome_completo?: { contains: string; mode: "insensitive" };
  valor?: string;
  categoria?: { contains: string; mode: "insensitive" };
  sub_categoria?: { contains: string; mode: "insensitive" };
  fornecedor?: { contains: string; mode: "insensitive" };
}

// Método GET para buscar produtos
export async function GET(req: Request) {
  try {
    // Capturando os parâmetros de busca e de paginação da query string
    const { searchParams } = new URL(req.url);
    const nome = searchParams.get("nome");
    const nome_completo = searchParams.get("nome_completo");
    const valor = searchParams.get("valor");
    const categoria = searchParams.get("categoria");
    const sub_categoria = searchParams.get("sub_categoria");
    const fornecedor = searchParams.get("fornecedor");
    const page = searchParams.get("page");
    const pageSize = searchParams.get("pageSize");

    // Convertendo parâmetros de paginação para números ou usando valores padrão
    const pageNumber = parseInt(page || "1", 10);
    const pageSizeNumber = parseInt(pageSize || "10", 10);
    const skip = (pageNumber - 1) * pageSizeNumber;

    // Construindo o filtro de busca dinamicamente
    const filters: SearchFilters = {};
    if (nome) {
      filters.nome = {
        contains: nome,
        mode: "insensitive",
      };
    }
    if (nome_completo) {
      filters.nome_completo = {
        contains: nome_completo,
        mode: "insensitive",
      };
    }

    if (valor) {
      filters.valor = valor;
    }

    if (categoria) {
      filters.categoria = {
        contains: categoria,
        mode: "insensitive",
      };
    }

    if (sub_categoria) {
      filters.sub_categoria = {
        contains: sub_categoria,
        mode: "insensitive",
      };
    }

    if (fornecedor) {
      filters.fornecedor = {
        contains: fornecedor,
        mode: "insensitive",
      };
    }

    // Buscando os produtos com os filtros aplicados e paginação
    const produtos = await prisma.produtoPreco.findMany({
      where: filters,
      skip,
      take: pageSizeNumber,
      orderBy: { nome: "asc" },
    });

    // Contando o total de produtos para a paginação
    const totalProdutos = await prisma.produtoPreco.count({
      where: filters,
    });

    // Retornando os produtos junto com informações de paginação
    return NextResponse.json({
      produtos,
      totalProdutos,
      totalPages: Math.ceil(totalProdutos / pageSizeNumber),
      currentPage: pageNumber,
    });
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
