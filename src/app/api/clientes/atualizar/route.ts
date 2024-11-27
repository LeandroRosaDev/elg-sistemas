import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const data = await req.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json(
        { error: "ID do cliente é necessário" },
        { status: 400 }
      );
    }

    // Atualiza os dados do cliente com base no ID
    const clienteAtualizado = await prisma.cliente.update({
      where: { id: Number(id) },
      data: updateData,
    });

    return NextResponse.json(clienteAtualizado, { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar cliente" },
      { status: 500 }
    );
  }
}
