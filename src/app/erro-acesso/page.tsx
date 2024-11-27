// src/app/erro-acesso/page.tsx
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

export default function ErroAcessoPage() {
  return (
    <div className="flex flex-col justify-center items-center h-screen gap-3">
      <Alert className="max-w-lg">
        <AlertTitle>Acesso Negado</AlertTitle>
        <AlertDescription>
          Você não tem permissão para acessar esta página. Contate o
          administrador para mais detalhes.
        </AlertDescription>
      </Alert>
      <Link href="/">Voltar para a página de início</Link>
    </div>
  );
}
