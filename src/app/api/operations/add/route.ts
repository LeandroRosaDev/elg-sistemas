// src/app/api/operations/add/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const { tipoOperacao, nomeOperacao, observacao, valor, mes } = data;

    const newOperation = await prisma.operacaoFinanceira.create({
      data: {
        tipoOperacao,
        nomeOperacao,
        observacao,
        valor,
        mes,
        data: new Date(),
      },
    });

    return NextResponse.json(newOperation, { status: 201 });
  } catch (error) {
    console.error("Erro ao adicionar operação:", error);
    return NextResponse.json(
      { error: "Erro ao adicionar operação" },
      { status: 500 }
    );
  }
}
