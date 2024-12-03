import React from "react";

import { Button } from "@/components/ui/button";
import logoEmpresa from "@/empresa.svg";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { Save } from "lucide-react";

function CadastrarRotinaPage() {
  return (
    <div className="text-gray-700 m-6 mr-12">
      <Card className=" text-gray-700 p-4 font-medium dark:text-white">
        <CardHeader>
          <CardTitle className="text-2xl">Cadastrando OS</CardTitle>

          <CardDescription>Usuário: Leandro Rosa</CardDescription>
        </CardHeader>
        <CardContent className="bg-gray-50 rounded-md dark:bg-black p-8">
          <div className="grid grid-cols-3">
            <div className="flex flex-col gap-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="picture">Número OS</Label>
                <Input id="n_os" type="text" />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="picture">Nome da Empresa</Label>
                <Input id="n_os" type="text" />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="picture">Pregão Nº</Label>
                <Input id="n_os" type="text" />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="picture">Observações adicionais</Label>
                <Textarea placeholder="Escreva alguma observação sobre essa manutenção" />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label>Selecione o serviço prestado</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Climatização </SelectItem>
                    <SelectItem value="2">Elétrica predial </SelectItem>
                    <SelectItem value="3">Solar </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label>Selecione a Equipe responsável</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Equipe A </SelectItem>
                    <SelectItem value="2">Equipe B </SelectItem>
                    <SelectItem value="3">Equipe C </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label>Selecione as Rotinas Associadas</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Climatização </SelectItem>
                    <SelectItem value="2">Elétrica predial </SelectItem>
                    <SelectItem value="3">Solar </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col justify-center w-full max-w-sm items-center gap-4">
              <h1>Subir Imagem da Empresa</h1>
              <Image
                width={300}
                height={300}
                alt="Logo Empresa"
                src={logoEmpresa}
              />
              <Input type="file" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex gap-2 flex-wrap mt-4">
            <Button variant="outline">
              <Save size={16} className="mr-1" />
              Salvar OS
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default CadastrarRotinaPage;
