import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { Component } from "@/components/chartArt/ChartArt";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div>
        <h1>Você não está autenticado</h1>
        <p>Redirecionando para a página de login...</p>
        <meta httpEquiv="refresh" content="2; url=/login" />
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between m-6 mr-12">
      <Component />
    </div>
  );
}
