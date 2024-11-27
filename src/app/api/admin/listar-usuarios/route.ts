import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Prisma } from "@prisma/client"; // Importar tipos do Prisma

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const name = searchParams.get("name") || "";
  const email = searchParams.get("email") || "";
  const role = searchParams.get("role") || "all";

  const pageSize = 10; // Número de usuários por página

  const session = await getServerSession(authOptions);

  // Verifica se o usuário está autenticado e se é administrador
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Permissão negada" }, { status: 403 });
  }

  try {
    // Construir um array de condições
    const conditions: Prisma.UserWhereInput[] = [];

    // Verificar e adicionar condição de nome
    if (name) {
      conditions.push({ name: { contains: name } }); // Removido o `mode`
    }

    // Verificar e adicionar condição de e-mail
    if (email) {
      conditions.push({ email: { contains: email } }); // Removido o `mode`
    }

    // Verificar e adicionar condição de role
    if (role !== "all") {
      conditions.push({ role });
    }

    // Construir o objeto `where` aplicando as condições
    const where: Prisma.UserWhereInput =
      conditions.length > 0 ? { AND: conditions } : {};

    // Contar o total de usuários com os filtros aplicados
    const totalUsers = await prisma.user.count({ where });

    // Buscar os usuários com paginação
    const users = await prisma.user.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json(
      {
        users,
        totalPages: Math.ceil(totalUsers / pageSize),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    return NextResponse.json(
      { error: "Erro ao buscar usuários" },
      { status: 500 }
    );
  }
}
