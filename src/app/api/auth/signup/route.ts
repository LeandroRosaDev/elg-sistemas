import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();

  const email = formData.get("email") as string;
  const name = formData.get("name") as string;
  const password = formData.get("password") as string;
  const gender = formData.get("gender") as string;
  const cpf = formData.get("cpf") as string;
  const technicalRole = formData.get("technicalRole") as string;
  const workArea = formData.get("workArea") as string;
  const dateOfBirth = formData.get("dateOfBirth") as string;
  const profileImage = formData.get("profileImage") as string;

  // Verificação de campos obrigatórios
  if (
    !email ||
    !name ||
    !password ||
    !gender ||
    !cpf ||
    !technicalRole ||
    !workArea ||
    !dateOfBirth
  ) {
    return NextResponse.json(
      { error: "Todos os campos obrigatórios devem ser preenchidos." },
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
      role: "USER",
    },
  });

  // Criar o perfil do usuário no modelo UserProfile, vinculado ao usuário
  await prisma.userProfile.create({
    data: {
      userId: user.id,
      cpf,
      technicalRole,
      workArea,
      dateOfBirth: new Date(dateOfBirth), // Conversão para Date
      gender,
      profileImage, // URL enviada para Cloudflare
    },
  });

  return NextResponse.json(user);
}
