// app/api/send-product/route.ts

import { NextResponse } from "next/server";

export async function POST(formData: FormData) {
  try {
    const response = await fetch("http://localhost:1337/api/produtos/", {
      method: "POST",
      headers: {
        Authorization: `Bearer dba00f8cc53eb71c44ee794c1f50cfac56bf654632156d75e24155d1d5edd213587d08fab5d17e5ebdcc0a0ce6b039ec8bf5199b0b3c53f22762ecb67ff9e757b6fdad68d2a354dfbf6cc746f6371e3bde01e9dde2d55d04312b03f296886f9f1b4c17d44c47c37927078ee97129a3f6f366b39a9136906faf66381bfc644d3b`, // Insira o token aqui
      },
      body: formData,
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Erro ao enviar o produto para o endpoint externo." },
        { status: response.status }
      );
    }

    return NextResponse.json({ message: "Produto enviado com sucesso!" });
  } catch (error) {
    console.error("Erro ao fazer a requisição:", error);
    return NextResponse.json(
      { error: "Erro ao fazer a requisição ao endpoint externo." },
      { status: 500 }
    );
  }
}
