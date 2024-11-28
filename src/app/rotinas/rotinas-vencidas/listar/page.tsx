"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableCell, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LucideTrash2, LucideEye } from "lucide-react";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Definir o tipo de cliente
interface Cliente {
  id: number;
  nome_cliente: string;
  forma_pagamento: string;
  cidade: string;
  bairro: string;
  subtotal_1?: string;
  desc_produto_1?: string;
}

export default function ListarClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]); // Tipagem correta
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    cidade: "",
    bairro: "",
    forma_pagamento: "",
  });
  const { data: session } = useSession();
  const { toast } = useToast();

  // Estado para controlar o alert de exclusão
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [clienteToDelete, setClienteToDelete] = useState<Cliente | null>(null);

  // Função para buscar clientes com filtros e paginação
  const fetchClientes = useCallback(
    async (page = 1) => {
      try {
        const queryParams = new URLSearchParams({
          page: page.toString(),
          cidade: filters.cidade || "",
          bairro: filters.bairro || "",
          forma_pagamento:
            filters.forma_pagamento === "all" ? "" : filters.forma_pagamento, // Se for "all", não aplicamos o filtro
        });
        const response = await fetch(`/api/clientes/buscar?${queryParams}`);
        const data = await response.json();

        if (response.ok) {
          setClientes(data.clientes);
          setTotalPages(data.totalPages);
          setCurrentPage(page);
        } else {
          toast({
            title: "Erro",
            description: data.error,
            variant: "destructive",
          });
        }
      } catch {
        toast({
          title: "Erro",
          description: "Erro ao buscar clientes",
          variant: "destructive",
        });
      }
    },
    [filters, toast]
  );

  // Função para deletar um cliente
  const deleteCliente = async () => {
    if (session?.user?.role !== "ADMIN") return;

    if (!clienteToDelete) return;

    try {
      const response = await fetch("/api/clientes/deletar", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: clienteToDelete.id }),
      });
      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Cliente deletado com sucesso",
          variant: "default",
        });
        fetchClientes(currentPage); // Atualizar a lista de clientes
        setIsAlertOpen(false); // Fechar o AlertDialog
      } else {
        toast({
          title: "Erro",
          description: data.error,
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Erro",
        description: "Erro ao deletar cliente",
        variant: "destructive",
      });
    }
  };

  // Efeito para buscar clientes quando o filtro ou a página mudar
  useEffect(() => {
    fetchClientes(currentPage);
  }, [fetchClientes, filters, currentPage]);

  return (
    <div className="m-6 mr-12">
      {/* Filtros */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Input
          placeholder="Nº0s"
          value={filters.cidade}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, cidade: e.target.value }))
          }
        />
        <Input
          placeholder="Rotina"
          value={filters.bairro}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, bairro: e.target.value }))
          }
        />
        <Select
          value={filters.forma_pagamento}
          onValueChange={(value) =>
            setFilters((prev) => ({ ...prev, forma_pagamento: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Responsável" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alírio</SelectItem>
            <SelectItem value="cartao_credito">João</SelectItem>
            <SelectItem value="pix">Cleverson</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={() => fetchClientes(1)} className="">
          Filtrar
        </Button>
      </div>

      {/* Tabela de Clientes */}
      <Table>
        <thead>
          <TableRow className="font-bold text-gray-700">
            <TableCell>NºOs</TableCell>
            <TableCell>Nome</TableCell>
            <TableCell>Rotina</TableCell>
            <TableCell>Data Venc.</TableCell>
            <TableCell>Responsável</TableCell>
            <TableCell className="text-center">Ações</TableCell>
          </TableRow>
        </thead>
        <tbody>
          {clientes && clientes.length > 0 ? (
            clientes.map((cliente) => (
              <TableRow key={cliente.id}>
                <TableCell>{cliente.nome_cliente}</TableCell>
                <TableCell>{cliente.forma_pagamento}</TableCell>
                <TableCell>{cliente.cidade}</TableCell>
                <TableCell>{cliente.bairro}</TableCell>
                <TableCell>{`R$ ${cliente.subtotal_1 || "00"},00`}</TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    <Button variant="ghost">
                      <Link href={`/cliente/${cliente.id}`}>
                        <LucideEye size={20} />
                      </Link>
                    </Button>

                    {session?.user?.role === "ADMIN" && (
                      <>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setClienteToDelete(cliente);
                            setIsAlertOpen(true);
                          }}
                          className="text-red-500"
                        >
                          <LucideTrash2 size={20} />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                Nenhum rotina encontrada
              </TableCell>
            </TableRow>
          )}
        </tbody>
      </Table>

      {/* Paginação */}
      <div className="flex justify-between mt-4">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Anterior
        </Button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <Button
          onClick={() =>
            setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))
          }
          disabled={currentPage === totalPages}
        >
          Próxima
        </Button>
      </div>

      {/* AlertDialog para confirmar a exclusão */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza de que deseja deletar o cliente{" "}
              <strong>{clienteToDelete?.nome_cliente}</strong>? Essa ação não
              poderá ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={deleteCliente}>
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
