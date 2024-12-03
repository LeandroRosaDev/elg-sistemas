import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { LucidePrinter, Save } from "lucide-react";
import React from "react";

function rotinasRealizadasPage() {
  return (
    <div className="text-gray-700 m-6 mr-12">
      <Card className=" text-gray-700 p-4 font-medium dark:text-white">
        <CardHeader>
          <CardTitle>NºOs xxx-xxx</CardTitle>

          <CardDescription>Responsável: Leandro Rosa</CardDescription>
        </CardHeader>
        <CardContent className="bg-gray-50 rounded-md dark:bg-black">
          <div>
            <h1 className="text-xl font-bold pt-4">
              Manutenção Preventiva - XxxXx
            </h1>
          </div>
          <Separator className="my-4" />
          <div>
            <h1>Descrição da Rotina</h1>
            <p>
              Mapear os pontos fortes e fracos do seu processo de produção é a
              chave para produzir mais! Na Meta realiza-se: Auxilio na redução
              de custos com desperdícios e retrabalhos; Reestruturação e gestão
              dos planos de manutenção preditiva e preventivas; Reestruturação
              de fluxos, métodos e processos de produção. Está buscando aumentar
              os lucros de sua produção? Interessou-se em nosso serviço? Entre
              em contato preenchendo o formulário a seguir.
            </p>
          </div>
          <div>
            <h1>Checklists</h1>
            <div className="flex items-center gap-4 ">
              <Checkbox id="terms" />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Checar Fúsiveis
              </label>
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>Ver descrição</AccordionTrigger>
                  <AccordionContent>
                    Você deverá checar todos os fusíveis
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            <div className="flex items-center gap-4 ">
              <Checkbox id="terms" />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Checar Isolamento
              </label>
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>Ver descrição</AccordionTrigger>
                  <AccordionContent>
                    Você deverá checar todos os fusíveis
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            <div className="flex items-center gap-4 ">
              <Checkbox id="terms" />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Checar Ventilação
              </label>
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>Ver descrição</AccordionTrigger>
                  <AccordionContent>
                    Você deverá checar todos os fusíveis
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            <div className="flex items-center gap-4 ">
              <Checkbox id="terms" />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Checar Amperagem
              </label>
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>Ver descrição</AccordionTrigger>
                  <AccordionContent>
                    Você deverá checar todos os fusíveis
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
          <div className="flex flex-col gap-4 my-4">
            <Input type="file" className="max-w-96" />
            <Textarea placeholder="Escreva alguma observação sobre essa manutenção" />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline">
              <Save size={16} className="mr-1" />
              Salvar Rotina
            </Button>
            <Button variant="outline">
              <LucidePrinter size={16} className="mr-1" />
              Imprimir Rotina
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default rotinasRealizadasPage;
