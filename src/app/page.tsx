import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { Component } from "@/components/chartArt/ChartArt";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, FileCheck, FileClock, FileWarning, ListPlus } from "lucide-react";

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
    <div className="flex flex-col grid-cols-2 justify-between m-6 mr-12">
      <div className="grid grid-cols-3 my-4 gap-4">
        <Card className=" text-gray-700">
          <CardHeader>
            <div className="flex items-center">
              <CardTitle className="text-xl textc ">Rotinas a vencer</CardTitle>
              <FileClock className="ml-auto" />
            </div>

            <CardDescription>Total de rotinas abertas a vencer</CardDescription>
          </CardHeader>

          <CardContent>
            <h1 className="font-bold text-2xl ">4</h1>
          </CardContent>
        </Card>
        <Card className=" text-gray-700">
          <CardHeader>
            <div className="flex items-center">
              <CardTitle className="text-xl textc ">
                Rotinas finalizadas
              </CardTitle>
              <FileCheck className="ml-auto" />
            </div>

            <CardDescription>Total de Rotinas finalizadas</CardDescription>
          </CardHeader>

          <CardContent>
            <h1 className="font-bold text-2xl ">8</h1>
          </CardContent>
        </Card>
        <Card className=" text-gray-700">
          <CardHeader>
            <div className="flex items-center">
              <CardTitle className="text-xl textc ">Rotinas vencidas</CardTitle>
              <FileWarning className="ml-auto" />
            </div>

            <CardDescription>Total de rotinas vencidas</CardDescription>
          </CardHeader>

          <CardContent>
            <h1 className="font-bold text-2xl ">15</h1>
          </CardContent>
        </Card>
        <Component />
        <Card className=" text-gray-700 col-span-1">
          <CardHeader>
            <div className="flex items-center">
              <CardTitle className="text-xl ">Últimos Registros</CardTitle>
              <ListPlus className="ml-auto" />
            </div>

            <CardDescription>Últimas rotinas realizadas</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex justify-around border-b pb-4 border-gray-200">
              <h1 className="font-bold text-md ">Nome</h1>
              <h1 className="font-bold text-md ">Rotina</h1>
              <h1 className="font-bold text-md ">Visualizar</h1>
            </div>
            <div className="flex justify-around mt-4 ">
              <h1 className="font-semibold text-xs ">Érica Rocha</h1>
              <h1 className="font-semibold text-xs pr-16">Zuqui Plus </h1>
              <Eye className="w-4 mr-8" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
