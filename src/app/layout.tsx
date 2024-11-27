// src/app/layout.tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ClientWrapper from "@/components/ClienteWrapper";
import { Toaster } from "@/components/ui/toaster";
import MenuSuspenso from "@/components/MenuSuspenso";
import { ThemeProvider } from "next-themes"; // Importar o ThemeProvider

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "ELG System",
  description: "Sistema de Manutenção Programada",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="light">
          {" "}
          {/* Adicionando ThemeProvider */}
          <ClientWrapper>
            <MenuSuspenso />
            {children}
          </ClientWrapper>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
