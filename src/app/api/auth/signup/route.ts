import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();

  const email = formData.get("email") as string;
  const name = formData.get("name") as string;
  const password = formData.get("password") as string;
  const gender = formData.get("gender") as string;
  // const arquivoBase64 = formData.get("arquivoBase64") as string;

  // Verificação de campos obrigatórios
  if (!email || !name || !password || !gender) {
    return NextResponse.json(
      { error: "Todos os campos são obrigatórios." },
      { status: 400 }
    );
  }

  // Verificar se o usuário já existe
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return NextResponse.json(
      { error: "Usuário já cadastrado" },
      { status: 400 }
    );
  }

  // Hash da senha
  const hashedPassword = await hash(password, 12);

  // Criação do novo usuário no modelo User
  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      gender,
      role: "USER",
    },
  });

  // Criar o perfil do usuário no modelo UserProfile, vinculado ao usuário
  await prisma.userProfile.create({
    data: {
      userId: user.id,
      // profileImage: arquivoBase64
    },
  });

  return NextResponse.json(user);
}
