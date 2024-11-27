import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Obtendo os parâmetros de filtro e paginação
  const tipoOperacao = searchParams.get("tipoOperacao") || undefined;
  const mes = searchParams.get("mes") || undefined;
  const nomeOperacao = searchParams.get("nomeOperacao") || undefined;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);

  // Calculando o deslocamento para a paginação
  const skip = (page - 1) * pageSize;

  try {
    // Definindo filtros com o tipo Prisma para OperacaoFinanceira
    const filters: Prisma.OperacaoFinanceiraWhereInput = {};
    if (tipoOperacao) filters.tipoOperacao = tipoOperacao;
    if (mes) filters.mes = mes;
    if (nomeOperacao) {
      filters.nomeOperacao = { contains: nomeOperacao, mode: "insensitive" };
    }

    // Consultando o banco de dados com filtros e paginação
    const operations = await prisma.operacaoFinanceira.findMany({
      where: filters,
      skip,
      take: pageSize,
      orderBy: { data: "desc" }, // Ordenando pela data, mais recente primeiro
    });

    // Contando o total de registros para a paginação
    const totalOperations = await prisma.operacaoFinanceira.count({
      where: filters,
    });

    return NextResponse.json({
      operations,
      totalOperations,
      totalPages: Math.ceil(totalOperations / pageSize),
      currentPage: page,
    });
  } catch (error) {
    console.error("Erro ao buscar operações financeiras:", error);
    return NextResponse.json(
      { error: "Erro ao buscar operações financeiras" },
      { status: 500 }
    );
  }
}
