import NextAuth, { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Por Favor, insira o seu e-mail e senha.");
        }

        // Encontrar o usuário no banco de dados
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { profile: true }, // Inclui o perfil do usuário
        });

        if (!user) {
          throw new Error("Email não encontrado.");
        }

        // Verificação da senha
        const isValid = await compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Verifique a sua senha e tente novamente.");
        }

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          gender: user.gender,
        } as User;
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // Atualizar o JWT com o role e profileImage do banco de dados
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          include: { profile: true },
        });
        token.role = dbUser?.role || "USER";
        token.gender = dbUser?.gender || "Masculino";
      }
      return token;
    },
    // Adicionar role e profileImage à sessão
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.gender = token.gender as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
