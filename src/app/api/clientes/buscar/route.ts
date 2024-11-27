import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const cidade = searchParams.get("cidade") || "";
  const bairro = searchParams.get("bairro") || "";
  const forma_pagamento = searchParams.get("forma_pagamento") || "";

  const pageSize = 10; // Número de clientes por página

  try {
    // Aplicando filtros
    const where = {
      AND: [
        cidade ? { cidade: { contains: cidade } } : {},
        bairro ? { bairro: { contains: bairro } } : {},
        forma_pagamento ? { forma_pagamento } : {},
      ],
    };

    // Contar o total de clientes
    const totalClientes = await prisma.cliente.count({ where });

    // Buscar os clientes com paginação
    const clientes = await prisma.cliente.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return NextResponse.json(
      {
        clientes,
        totalPages: Math.ceil(totalClientes / pageSize),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    return NextResponse.json(
      { error: "Erro ao buscar clientes" },
      { status: 500 }
    );
  }
}
