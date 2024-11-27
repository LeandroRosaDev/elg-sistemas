import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const {
      nome_cliente,
      nome_entrega,
      data_entrega,
      logradouro,
      numero,
      bairro,
      cep,
      cidade,
      ponto_referencia,
      obs,
      email,
      vendedor,
      telefone_1,
      telefone_2,
      nome_produto_1,
      nome_produto_2,
      nome_produto_3,
      nome_produto_4,
      nome_produto_5,
      desc_produto_1,
      desc_produto_2,
      desc_produto_3,
      desc_produto_4,
      desc_produto_5,
      qtd_1,
      qtd_2,
      qtd_3,
      qtd_4,
      qtd_5,
      subtotal_1,
      subtotal_2,
      subtotal_3,
      subtotal_4,
      subtotal_5,
      forma_pagamento,
      numero_parcelas,
      cpf,
      numero_nota,
    } = data;

    // Validação opcional antes de salvar
    if (!nome_cliente || !cpf || !data_entrega || !email || !telefone_1) {
      return NextResponse.json(
        { error: "Campos obrigatórios não preenchidos" },
        { status: 400 }
      );
    }

    // Adicionar cliente no banco de dados
    const cliente = await prisma.cliente.create({
      data: {
        nome_cliente,
        nome_entrega,
        data_entrega,
        logradouro,
        numero,
        bairro,
        cep,
        cidade,
        ponto_referencia,
        obs,
        email,
        vendedor,
        telefone_1,
        telefone_2,
        nome_produto_1,
        nome_produto_2,
        nome_produto_3,
        nome_produto_4,
        nome_produto_5,
        desc_produto_1,
        desc_produto_2,
        desc_produto_3,
        desc_produto_4,
        desc_produto_5,
        qtd_1,
        qtd_2,
        qtd_3,
        qtd_4,
        qtd_5,
        subtotal_1,
        subtotal_2,
        subtotal_3,
        subtotal_4,
        subtotal_5,
        forma_pagamento,
        numero_parcelas,
        cpf,
        numero_nota,
      },
    });

    return NextResponse.json(cliente, { status: 201 });
  } catch (error) {
    console.error("Erro ao adicionar cliente:", error);
    return NextResponse.json(
      { error: "Erro ao adicionar cliente" },
      { status: 500 }
    );
  }
}
