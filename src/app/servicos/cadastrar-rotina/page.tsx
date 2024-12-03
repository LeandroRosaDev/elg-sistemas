import React from "react";

import { Button } from "@/components/ui/button";
import logoEmpresa from "@/climatizacao.svg";
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
import { CirclePlus, Save } from "lucide-react";

function CadastrarRotinasPage() {
  return (
    <div className="text-gray-700 m-6 mr-12">
      <Card className=" text-gray-700 p-4 font-medium dark:text-white">
        <CardHeader>
          <CardTitle className="text-2xl">Cadastrando Rotina</CardTitle>

          <CardDescription>Usuário: Leandro Rosa</CardDescription>
        </CardHeader>
        <CardContent className="bg-gray-50 rounded-md dark:bg-black p-8">
          <div className="grid grid-cols-3">
            <div className="flex flex-col gap-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label>Selecione o Tipo de Rotina</Label>
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
                <Label htmlFor="picture">Número da Rotina</Label>
                <Input id="n_os" type="text" />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="picture">Nome da Rotina</Label>
                <Input id="n_os" type="text" />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="picture">Descrição da Rotina</Label>
                <Textarea placeholder="Escreva alguma observação sobre essa manutenção" />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label>Selecione um Supervisor para essa rotina</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Clevson </SelectItem>
                    <SelectItem value="2">André </SelectItem>
                    <SelectItem value="3">Roberto </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label>Selecione a Recorrência desta Rotina</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Mês</SelectItem>
                    <SelectItem value="2">2 Meses </SelectItem>
                    <SelectItem value="3">3 Meses </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="picture">Adicionar Check List de tarefa</Label>
                <Input id="n_os" type="text" />
              </div>
              <div className="w-full max-w-sm flex  justify-center">
                <button>
                  <CirclePlus className="text-center" />
                </button>
              </div>
            </div>
            <div className="flex flex-col justify-center w-full max-w-sm items-center gap-4">
              <Image
                width={300}
                height={300}
                alt="Logo Empresa"
                src={logoEmpresa}
              />
              <p>Adicionar Imagens Exemplo da Rotina</p>
              <Input className="w-32" type="file" />
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

export default CadastrarRotinasPage;
