"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import {
  LucideEdit3,
  LucideAlertTriangle,
  LucideSave,
  LucideX,
  LucidePrinter,
} from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter as DialogFooterUI,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { SkeletonCard } from "@/components/Skeleton";
import Image from "next/image";
import logotipo from "@/logotipo.png";
import qrCode from "@/qrcode.png";

// Interface para o cliente
interface Cliente {
  id: number;
  nome_cliente: string;
  cidade: string;
  bairro: string;
  forma_pagamento: string;
  observacao: string;
  telefone_1?: string;
  telefone_2?: string;
  email?: string;
  logradouro?: string;
  numero?: string;
  cep?: string;
  cpf?: string;
  nome_produto_1?: string;
  desc_produto_1?: string;
  qtd_1?: string | number;
  subtotal_1?: string | number;
  nome_produto_2?: string;
  desc_produto_2?: string;
  qtd_2?: string | number;
  subtotal_2?: string | number;
  nome_produto_3?: string;
  desc_produto_3?: string;
  qtd_3?: string | number;
  subtotal_3?: string | number;
  nome_produto_4?: string;
  desc_produto_4?: string;
  qtd_4?: string | number;
  subtotal_4?: string | number;
  nome_produto_5?: string;
  desc_produto_5?: string;
  qtd_5?: string | number;
  subtotal_5?: string | number;
  numero_parcelas?: string;
  nome_entrega?: string;
  obs?: string;
  ponto_referencia?: string;
  data_entrega?: string;
  numero_nota?: string;
}

// Interface para os parâmetros da rota dinâmica
interface Params {
  info: string;
}

export default function ClienteInfo({ params }: { params: Params }) {
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Cliente>>({});
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [horaSaida, setHoraSaida] = useState<string>("");

  const { data: session } = useSession();
  const { toast } = useToast();

  const fetchCliente = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/clientes/cliente/${params.info}`);
      const data = await response.json();
      setCliente(data);
      setFormData(data);
    } catch {
      toast({
        title: "Erro",
        description: "Erro ao buscar os dados do cliente",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [params.info, toast]);

  useEffect(() => {
    if (params.info) fetchCliente();

    const currentHoraSaida = new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setHoraSaida(currentHoraSaida);
  }, [params.info, fetchCliente]);

  const handleUpdateCliente = async () => {
    try {
      const response = await fetch("/api/clientes/atualizar", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: cliente?.id, ...formData }),
      });

      if (response.ok) {
        const updatedCliente = await response.json();
        setCliente(updatedCliente);
        toast({
          title: "Sucesso",
          description: "Dados do cliente atualizados com sucesso",
          variant: "default",
        });
        setIsEditing(false);
      } else {
        const errorData = await response.json();
        toast({
          title: "Erro",
          description: errorData.error || "Erro ao atualizar o cliente",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Erro",
        description: "Erro ao atualizar os dados do cliente",
        variant: "destructive",
      });
    }
  };

  const printModalContent = () => {
    setIsPrintModalOpen(false);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  if (isLoading) return <SkeletonCard />;
  if (!cliente) return <p>Cliente não encontrado.</p>;

  // Função para converter valores para número com fallback para 0
  const toNumber = (value: string | number | undefined): number =>
    value ? Number(value) : 0;

  return (
    <div className="p-6 mx-auto flex flex-col justify-center items-center w-full">
      <Card className="print:hidden max-w-4xl">
        <CardHeader className="bg-gray-100 rounded-t-md">
          <CardTitle className="flex items-center gap-2 text-lg">
            {isEditing ? (
              <>
                <LucideEdit3 size={20} />
                Editar Cliente
              </>
            ) : (
              <>Informações do Cliente: {cliente.nome_cliente}</>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome_cliente">Nome do Cliente</Label>
                <Input
                  id="nome_cliente"
                  value={formData.nome_cliente || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      nome_cliente: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  value={formData.cidade || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      cidade: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="bairro">Bairro</Label>
                <Input
                  id="bairro"
                  value={formData.bairro || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      bairro: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="forma_pagamento">Forma de Pagamento</Label>
                <Input
                  id="forma_pagamento"
                  value={formData.forma_pagamento || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      forma_pagamento: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="subtotal_1">Total</Label>
                <Input
                  id="subtotal_1"
                  value={formData.subtotal_1 || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      subtotal_1: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="observacao">Observações</Label>
                <Textarea
                  id="observacao"
                  value={formData.observacao || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      observacao: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <p>
                <strong>Nome:</strong> {cliente.nome_cliente}
              </p>
              <p>
                <strong>CPF:</strong> {cliente.cpf}
              </p>
              <p>
                <strong>Email:</strong> {cliente.email}
              </p>
              <p>
                <strong>Telefone:</strong> {cliente.telefone_1}
              </p>
              <p>
                <strong>Endereço:</strong> {cliente.cidade} {cliente.bairro}{" "}
                {cliente.logradouro} Nº {cliente.numero} CEP:{cliente.cep}
              </p>
              <p>
                <strong>Produto:</strong> {cliente.nome_produto_1} Qtd:{" "}
                {cliente.qtd_1}
              </p>
              <p>
                <strong>Forma de Pagamento:</strong> {cliente.forma_pagamento}
              </p>
              <p>
                <strong>Total:</strong> R$
                {toNumber(cliente.subtotal_1) * toNumber(cliente.qtd_1)}
              </p>
              <p>
                <strong>Observações:</strong>{" "}
                {cliente.observacao || "Nenhuma observação"}
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between gap-2">
          {(session?.user?.role === "MODERATOR" ||
            session?.user?.role === "ADMIN") && (
            <>
              {isEditing ? (
                <>
                  <Button
                    variant="secondary"
                    onClick={() => setIsEditing(false)}
                  >
                    <LucideX size={16} className="mr-1" />
                    Cancelar
                  </Button>
                  <Button onClick={handleUpdateCliente}>
                    <LucideSave size={16} className="mr-1" />
                    Salvar Alterações
                  </Button>
                </>
              ) : (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <LucideEdit3 size={16} className="mr-1" />
                  Editar Informações
                </Button>
              )}
            </>
          )}
          <Dialog open={isPrintModalOpen} onOpenChange={setIsPrintModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <LucidePrinter size={16} className="mr-1" />
                Imprimir Nota
              </Button>
            </DialogTrigger>
            <DialogContent id="print-content">
              <DialogHeader>
                <DialogTitle>Resumo do Cliente</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                <div className="space-y-2 print:hidden">
                  <p>
                    <strong>Nome:</strong> {cliente.nome_cliente}
                  </p>
                  <p>
                    <strong>CPF:</strong> {cliente.cpf}
                  </p>
                  <p>
                    <strong>Cidade:</strong> {cliente.cidade}
                  </p>
                  <p>
                    <strong>Forma de Pagamento:</strong>{" "}
                    {cliente.forma_pagamento}
                  </p>
                  <p>
                    <strong>Observação:</strong> {cliente.observacao}
                  </p>
                </div>
              </DialogDescription>
              <DialogFooterUI>
                <Button onClick={printModalContent}>Imprimir</Button>
              </DialogFooterUI>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>

      {/* Nota fiscal para impressão */}
      <div className="hidden print:block p-6 w-[1100px] mx-auto my-auto border border-black">
        <div className="mb-20 border-b border-dashed border-black pb-10 grid grid-cols-7 gap-3">
          <div className="col-span-6">
            <div className="grid">
              <div className="text-left border border-black">
                <span className="block p-1">
                  Recebemos de Komode Móveis os produtos constantes no CUPOM
                  FISCAL INDICADO AO LADO
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3">
              <div className="text-left col-span-1">
                <span className="block font-bold text-xs border-x border-b border-black p-1 h-20">
                  Data de recebimento:
                </span>
              </div>
              <div className="text-left col-span-2">
                <span className="block border-r border-black border-b font-bold text-xs h-20 p-1">
                  Identificação e assinatura do recebedor
                </span>
              </div>
            </div>
          </div>
          <div className="text-center border flex flex-col justify-center border-black p-2 col-span-1">
            <span className="block font-bold">CF-e</span>
            <span className="block font-bold">Nº {cliente.numero_nota}</span>
            <span className="block font-bold">Série 1</span>
          </div>
        </div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col items-center justify-center gap-2 border border-black p-2 h-[250px] w-[500px]">
            <Image
              src={logotipo}
              alt="Logotipo Komode"
              width={228}
              height={62}
            />
            <span className="text-xs">Komode Móveis</span>
            <span className="text-xs">www.komodemoveis.com.br</span>
          </div>
          <div className="flex flex-col text-center px-14 py-2">
            <span className="font-bold">CUPOM FISCAL</span>
            <span className="text-sm">Documento fiscal de compra</span>
            <div className="flex items-center justify-center gap-2">
              <div className="flex flex-col">
                <span className="text-sm text-left mr-2">1 - Entrada</span>
                <span className="text-sm text-left">2 - Saida</span>
              </div>
              <span className="text-sm border border-black px-4 py-2">2</span>
            </div>
            <span className="text-sm">Página 1 de 1</span>
            <span className="text-base font-bold">
              Nº {cliente.numero_nota}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 border border-black p-2 h-[250px] w-[500px]">
            <span className="text-xs">Dúvidas sugestões ou reclamações:</span>
            <Image src={qrCode} alt="QrCode" width={200} height={200} />
          </div>
        </div>
        <div className="text-left border border-black p-2 grid grid-cols-2">
          <div>
            <span className="block text-sm">Natureza da operação</span>
            <span className="block font-bold">Venda de mercadorias</span>
          </div>
        </div>
        <span className="block font-bold mt-2 pb-2">Dados da empresa</span>
        <div className="mb-10 border border-black">
          <div className="grid grid-cols-2">
            <div>
              <span className="block font-bold text-xs border-r border-black p-1">
                Nome Empresarial/Razão Social:
              </span>
              <span className="block border-r border-black border-b p-1">
                Komode Moveis e Decorados
              </span>
              <span className="block font-bold text-xs border-r border-black p-1">
                CNPJ:
              </span>
              <span className="block border-r border-black border-b p-1">
                54.251.497/0001-40
              </span>
              <span className="block font-bold text-xs border-r border-black p-1">
                Endereço:
              </span>
              <span className="block border-r border-black p-1">
                Av. Presidente Vargas
              </span>
            </div>
            <div className="text-left">
              <span className="block font-bold text-xs p-1">Bairro:</span>
              <span className="block border-black border-b p-1">Centro</span>
              <span className="block font-bold text-xs p-1">CEP:</span>
              <span className="block border-black border-b p-1">20230-010</span>
              <span className="block font-bold text-xs p-1">Município:</span>
              <span className="block border-black p-1">Rio de Janeiro</span>
            </div>
          </div>
        </div>

        <span className="block font-bold mt-2 pb-2">
          Destinatário/Remetente
        </span>
        <div className="mb-10 border border-black">
          <div className="grid grid-cols-2">
            <div>
              <span className="block font-bold text-xs border-r border-black p-1">
                Nome/Razão Social:
              </span>
              <span className="block border-r border-black border-b p-1">
                {cliente.nome_cliente}
              </span>

              <span className="block font-bold text-xs border-r border-black p-1">
                Endereço:
              </span>
              <span className="block border-r border-black border-b p-1">
                {cliente.logradouro}, {cliente.numero}
              </span>
              <span className="block font-bold text-xs border-r border-black p-1">
                Bairro:
              </span>
              <span className="block border-r border-black border-b p-1">
                {cliente.bairro}
              </span>
              <span className="block font-bold text-xs border-r border-black p-1">
                Município:
              </span>
              <span className="block border-b border-r border-black p-1">
                {cliente.cidade}
              </span>
              <span className="block font-bold text-xs border-r border-black p-1">
                CEP:
              </span>
              <span className="block border-r border-b border-black p-1">
                {cliente.cep}
              </span>
              <span className="block font-bold text-xs border-r border-black p-1">
                UF:
              </span>
              <span className="block border-r border-black p-1">RJ</span>
            </div>
            <div className="text-left">
              <span className="block font-bold text-xs p-1">CPF/CNPJ:</span>
              <span className="block border-black border-b p-1">
                {cliente.cpf}
              </span>
              <span className="block font-bold text-xs p-1">Telefone:</span>
              <span className="block border-black border-b p-1">
                {cliente.telefone_1}
              </span>
              <span className="block font-bold text-xs p-1">Telefone (2)</span>
              <span className="block border-b border-black p-1">
                {cliente.telefone_2}
              </span>
              <span className="block font-bold text-xs p-1">Data emissão:</span>
              <span className="block border-black border-b p-1">
                {cliente.data_entrega}
              </span>
              <span className="block font-bold text-xs p-1">Data saída:</span>
              <span className="block border-black border-b p-1">
                {cliente.data_entrega}
              </span>
              <span className="block font-bold text-xs p-1">Hora saída:</span>
              <span className="block p-1">{horaSaida}</span>
            </div>
          </div>
        </div>
        <span className="block font-bold mt-2 pb-2">Itens do cupom fiscal</span>
        <div className="mb-10 border border-black">
          <div className="grid grid-cols-6 text-center bg-gray-200 font-bold">
            <div className="p-1 border-r border-black">Nome</div>
            <div className="p-1 border-r border-black col-span-2">
              Descrição
            </div>
            <div className="p-1 border-r border-black">Quantidade</div>
            <div className="p-1 border-r border-black">Valor Unitário</div>
            <div className="p-1">Valor Total</div>
          </div>
          <div className="grid grid-cols-6 text-center">
            <div className="p-1 border-r border-black">
              {cliente.nome_produto_1}
            </div>
            <div className="p-1 border-r border-black col-span-2">
              {cliente.desc_produto_1}
            </div>
            <div className="p-1 border-r border-black">{cliente.qtd_1}</div>
            <div className="p-1 border-r border-black">
              R${toNumber(cliente.subtotal_1)},00
            </div>
            <div className="p-1">
              R$
              {toNumber(cliente.subtotal_1) * toNumber(cliente.qtd_1)}
            </div>
          </div>
          {cliente.nome_produto_2 && (
            <div className="grid grid-cols-6 text-center">
              <div className="p-1 border-r border-black">
                {cliente.nome_produto_2}
              </div>
              <div className="p-1 border-r border-black col-span-2">
                {cliente.desc_produto_2}
              </div>
              <div className="p-1 border-r border-black">{cliente.qtd_2}</div>
              <div className="p-1 border-r border-black">
                R${toNumber(cliente.subtotal_2)},00
              </div>
              <div className="p-1">
                R$
                {(
                  toNumber(cliente.subtotal_2) * toNumber(cliente.qtd_2)
                ).toFixed(2)}
              </div>
            </div>
          )}
          {cliente.nome_produto_3 && (
            <div className="grid grid-cols-6 text-center">
              <div className="p-1 border-r border-black">
                {cliente.nome_produto_3}
              </div>
              <div className="p-1 border-r border-black col-span-2">
                {cliente.desc_produto_3}
              </div>
              <div className="p-1 border-r border-black">{cliente.qtd_3}</div>
              <div className="p-1 border-r border-black">
                R${toNumber(cliente.subtotal_3)},00
              </div>
              <div className="p-1">
                R$
                {(
                  toNumber(cliente.subtotal_3) * toNumber(cliente.qtd_3)
                ).toFixed(2)}
              </div>
            </div>
          )}
          {cliente.nome_produto_4 && (
            <div className="grid grid-cols-6 text-center">
              <div className="p-1 border-r border-black">
                {cliente.nome_produto_4}
              </div>
              <div className="p-1 border-r border-black col-span-2">
                {cliente.desc_produto_4}
              </div>
              <div className="p-1 border-r border-black">{cliente.qtd_4}</div>
              <div className="p-1 border-r border-black">
                R${toNumber(cliente.subtotal_4)},00
              </div>
              <div className="p-1">
                R$
                {(
                  toNumber(cliente.subtotal_4) * toNumber(cliente.qtd_4)
                ).toFixed(2)}
              </div>
            </div>
          )}
          {cliente.nome_produto_5 && (
            <div className="grid grid-cols-6 text-center">
              <div className="p-1 border-r border-black">
                {cliente.nome_produto_5}
              </div>
              <div className="p-1 border-r border-black col-span-2">
                {cliente.desc_produto_5}
              </div>
              <div className="p-1 border-r border-black">{cliente.qtd_5}</div>
              <div className="p-1 border-r border-black">
                R${toNumber(cliente.subtotal_5)},00
              </div>
              <div className="p-1">
                R$
                {(
                  toNumber(cliente.subtotal_5) * toNumber(cliente.qtd_5)
                ).toFixed(2)}
              </div>
            </div>
          )}
        </div>
        <span className="block font-bold mt-2 pb-2">
          Total dos itens/serviços
        </span>
        <div className="mb-10 border border-black">
          <div className="grid grid-cols-4">
            <div>
              <span className="block font-bold text-xs border-r border-black p-1">
                Total dos itens
              </span>
              <span className="block border-r border-black p-1">
                R$
                {(
                  toNumber(cliente.subtotal_1) * toNumber(cliente.qtd_1) +
                  toNumber(cliente.subtotal_2) * toNumber(cliente.qtd_2) +
                  toNumber(cliente.subtotal_3) * toNumber(cliente.qtd_3) +
                  toNumber(cliente.subtotal_4) * toNumber(cliente.qtd_4) +
                  toNumber(cliente.subtotal_5) * toNumber(cliente.qtd_5)
                ).toFixed(2)}
              </span>
            </div>
            <div className="text-left">
              <span className="block font-bold text-xs border-r border-black p-1">
                Método de Pagamento:
              </span>
              <span className="block border-r border-black p-1">
                {cliente.forma_pagamento}
              </span>
            </div>
            <div className="text-left">
              <span className="block font-bold text-xs border-r border-black p-1">
                Frete:
              </span>
              <span className="block border-r border-black p-1">
                Não cobrado
              </span>
            </div>
            <div className="text-left">
              <span className="block font-bold text-xs p-1">
                Outros serviços:
              </span>
              <span className="block p-1">Não cobrado</span>
            </div>
          </div>
        </div>

        <span className="block font-bold pb-2">Dados adicionais</span>
        <div className="border border-black h-42 p-2">
          <span className="block">Observações:</span>
          {cliente.numero_parcelas && (
            <span className="block">
              Parcelamento em {cliente.numero_parcelas}x de R$
              {(toNumber(cliente.subtotal_1) * toNumber(cliente.qtd_1) +
                toNumber(cliente.subtotal_2) * toNumber(cliente.qtd_2) +
                toNumber(cliente.subtotal_3) * toNumber(cliente.qtd_3) +
                toNumber(cliente.subtotal_4) * toNumber(cliente.qtd_4) +
                toNumber(cliente.subtotal_5) * toNumber(cliente.qtd_5)) /
                Number(cliente.numero_parcelas)}{" "}
              no cartão de crédito
            </span>
          )}
          {cliente.ponto_referencia && (
            <span className="block">
              Ponto de referência: {cliente.ponto_referencia}
            </span>
          )}
          {cliente.email && (
            <span className="block">E-mail: {cliente.email}</span>
          )}

          <span className="block">
            Nome de quem receberá a entrega: {cliente.nome_entrega}
          </span>
          {cliente.obs && (
            <span className="block">Detalhes adicionais: {cliente.obs}</span>
          )}
        </div>
      </div>

      {session?.user?.role !== "MODERATOR" &&
        session?.user?.role !== "ADMIN" && (
          <Alert variant="destructive" className="mt-4">
            <AlertTitle>
              <LucideAlertTriangle className="mr-1 inline" size={20} />
              Permissão Negada
            </AlertTitle>
            <AlertDescription>
              Somente moderadores ou administradores podem editar as informações
              do cliente.
            </AlertDescription>
          </Alert>
        )}
    </div>
  );
}
