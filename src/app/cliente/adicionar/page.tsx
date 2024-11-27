"use client";

import { useState, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

export default function AddClientForm() {
  const [productCount, setProductCount] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subtotals, setSubtotals] = useState<number[]>(Array(5).fill(0));
  const [quantities, setQuantities] = useState<number[]>(Array(5).fill(1));
  const { toast } = useToast();

  const formatPhoneNumber = (phone: string): string => {
    return phone
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d{5})(\d{4})$/, "($1)$2-$3");
  };

  const formatCPF = (cpf: string): string => {
    return cpf
      .replace(/\D/g, "")
      .replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
  };

  const formatCEP = (cep: string): string => {
    return cep.replace(/\D/g, "").replace(/^(\d{5})(\d{3})$/, "$1-$2");
  };

  const generateNumeroNota = (cpf: string): string => {
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const cpfDigits = cpf.replace(/\D/g, "").slice(-3);
    const randomDigits = `${Math.floor(Math.random() * 9) + 1}${
      Math.floor(Math.random() * 9) + 1
    }`;
    return `${year}${month}${day}${cpfDigits}${randomDigits}`;
  };

  const handleSubtotalChange = (index: number, baseValue: number) => {
    setSubtotals((prev) => {
      const updated = [...prev];
      updated[index] = baseValue * (quantities[index] || 1);
      return updated;
    });
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    setQuantities((prev) => {
      const updated = [...prev];
      updated[index] = quantity;
      return updated;
    });

    setSubtotals((prev) => {
      const updated = [...prev];
      updated[index] = (subtotals[index] / (quantities[index] || 1)) * quantity;
      return updated;
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // Formatando os campos antes de enviar
    data["telefone_1"] = formatPhoneNumber(data["telefone_1"] as string);
    data["telefone_2"] = formatPhoneNumber(data["telefone_2"] as string);
    data["cpf"] = formatCPF(data["cpf"] as string);
    data["cep"] = formatCEP(data["cep"] as string);

    // Formatando a data de entrega em DD/MM/YYYY
    if (selectedDate) {
      data["data_entrega"] = format(selectedDate, "dd/MM/yyyy");
    }

    // Gerando o número da nota
    data["numero_nota"] = generateNumeroNota(data["cpf"] as string);

    subtotals.forEach((subtotal, index) => {
      if (index < productCount)
        data[`subtotal_${index + 1}`] = subtotal.toString();
    });

    try {
      const response = await fetch("/api/clientes/adicionar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Cliente cadastrado com sucesso",
          variant: "default",
        });
      } else {
        toast({
          title: "Erro",
          description: "Erro ao cadastrar cliente",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Erro",
        description: "Erro ao cadastrar cliente",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg space-y-6 border"
    >
      <h2 className="text-2xl font-semibold text-center mb-4">
        Cadastrar Cliente
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="col-span-2">
          <Label>Nome do Cliente</Label>
          <Input
            type="text"
            name="nome_cliente"
            placeholder="Nome do Cliente"
            required
          />
        </div>
        <div className="col-span-2">
          <Label>Nome para a Entrega</Label>
          <Input
            type="text"
            name="nome_entrega"
            placeholder="Nome Entrega"
            required
          />
        </div>

        <div className="col-span-1">
          <Label>Data de Entrega</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full">
                {selectedDate
                  ? format(selectedDate, "dd/MM/yyyy", { locale: ptBR })
                  : "Selecionar Data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                locale={ptBR}
                className="rounded-md border"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="col-span-1">
          <Label>CPF</Label>
          <Input type="text" name="cpf" placeholder="CPF" />
        </div>

        <div className="col-span-1">
          <Label>Forma de Pagamento</Label>
          <Select defaultValue="selecionar" name="forma_pagamento">
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Cartão de Débito">Cartão de Débito</SelectItem>
              <SelectItem value="Cartão de Crédito">
                Cartão de Crédito
              </SelectItem>
              <SelectItem value="Pix">Pix</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1">
          <Label>Vendedor</Label>
          <Select defaultValue="selecionar" name="vendedor">
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Leandro">Leandro</SelectItem>
              <SelectItem value="Sara Tavares">Sara Tavares</SelectItem>
              <SelectItem value="Albânia">Albânia</SelectItem>
              <SelectItem value="Danilo">Danilo</SelectItem>
              <SelectItem value="Cecília">Cecília</SelectItem>
              <SelectItem value="Beatriz">Beatriz</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-1">
          <Label>Nº de Parcelas</Label>
          <Select defaultValue="1" name="numero_parcelas">
            <SelectTrigger>
              <SelectValue placeholder="1" />
            </SelectTrigger>
            <SelectContent>
              {[...Array(12)].map((_, idx) => (
                <SelectItem key={idx} value={String(idx + 1)}>
                  {idx + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-1">
          <Label>QTD de Produtos</Label>
          <Select
            defaultValue="1"
            onValueChange={(value) => setProductCount(Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="1" />
            </SelectTrigger>
            <SelectContent>
              {[...Array(5)].map((_, idx) => (
                <SelectItem key={idx} value={String(idx + 1)}>
                  {idx + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Telefone 1</Label>
          <Input type="text" name="telefone_1" placeholder="Telefone 1" />
        </div>

        <div>
          <Label>Telefone 2</Label>
          <Input type="text" name="telefone_2" placeholder="Telefone 2" />
        </div>

        <div>
          <Label>Email</Label>
          <Input type="email" name="email" placeholder="Email" />
        </div>

        <div className="col-span-2">
          <Label>Logradouro</Label>
          <Input type="text" name="logradouro" placeholder="Logradouro" />
        </div>

        <div>
          <Label>Número</Label>
          <Input type="text" name="numero" placeholder="Número" />
        </div>

        <div className="col-span-2">
          <Label>Bairro</Label>
          <Input type="text" name="bairro" placeholder="Bairro" />
        </div>

        <div>
          <Label>CEP</Label>
          <Input type="text" name="cep" placeholder="CEP" />
        </div>

        <div className="col-span-2">
          <Label>Cidade</Label>
          <Input type="text" name="cidade" placeholder="Cidade" />
        </div>

        <div className="col-span-3">
          <Label>Ponto de Referência</Label>
          <Input
            type="text"
            name="ponto_referencia"
            placeholder="Ponto de Referência"
          />
        </div>

        <div className="col-span-6">
          <Label>Observação</Label>
          <Textarea name="obs" placeholder="Observação" />
        </div>
      </div>

      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={`${i < productCount ? "block" : "hidden"} mt-4`}
        >
          <h3 className="font-semibold text-lg mb-2">Produto {i + 1}</h3>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="col-span-2">
              <Label>Nome do Produto {i + 1}</Label>
              <Input
                type="text"
                placeholder={`Nome do Produto ${i + 1}`}
                name={`nome_produto_${i + 1}`}
              />
            </div>
            <div className="col-span-2">
              <Label>Descrição do Produto {i + 1}</Label>
              <Input
                type="text"
                placeholder={`Descrição do Produto ${i + 1}`}
                name={`desc_produto_${i + 1}`}
              />
            </div>
            <div className="col-span-1">
              <Label>Subtotal</Label>
              <Input
                type="number"
                placeholder="Subtotal"
                name={`subtotal_${i + 1}`}
                onChange={(e) =>
                  handleSubtotalChange(i, Number(e.target.value))
                }
                value={subtotals[i]}
              />
            </div>
            <div className="col-span-1">
              <Label>Quantidade</Label>
              <Select
                defaultValue="1"
                name={`qtd_${i + 1}`}
                onValueChange={(value) =>
                  handleQuantityChange(i, Number(value))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(10)].map((_, idx) => (
                    <SelectItem key={idx} value={String(idx + 1)}>
                      {idx + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      ))}

      <div className="flex gap-4 mt-6 justify-end">
        <Button type="reset" variant="destructive">
          Reset
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Cadastrando..." : "Cadastrar"}
        </Button>
      </div>
    </form>
  );
}
