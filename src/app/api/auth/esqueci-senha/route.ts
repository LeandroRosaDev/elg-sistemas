// // src/app/api/auth/esqueci-senha/route.ts
// import { prisma } from "@/lib/prisma";
// import { NextResponse } from "next/server";
// import { randomBytes } from "crypto";
// import { sendEmail } from "@/lib/utils"; // Função fictícia para enviar email
// import { addHours } from "date-fns";

// export async function POST(request: Request) {
//   const { email } = await request.json();

//   const user = await prisma.user.findUnique({
//     where: { email },
//   });

//   if (!user) {
//     return NextResponse.json(
//       { error: "Email não encontrado." },
//       { status: 404 }
//     );
//   }

//   // Gerar um token seguro para redefinição
//   const token = randomBytes(32).toString("hex");

//   // Definir um prazo de validade para o token (ex: 1 hora)
//   const expires = addHours(new Date(), 1);

//   // Armazenar o token no banco de dados
//   await prisma.passwordResetToken.create({
//     data: {
//       userId: user.id,
//       token,
//       expires,
//     },
//   });

//   // Enviar e-mail para o usuário com o link de redefinição de senha
//   const resetUrl = `${process.env.NEXTAUTH_URL}/trocar-senha?token=${token}`;
//   await sendEmail({
//     to: email,
//     subject: "Redefinição de senha",
//     html: `<p>Você solicitou uma redefinição de senha. Clique no link abaixo para redefinir sua senha:</p>
//            <a href="${resetUrl}">Redefinir Senha</a>`,
//   });

//   return NextResponse.json({
//     message: "Um e-mail foi enviado para redefinir sua senha.",
//   });
// }
