"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
// import { Calendar as CalendarIcon } from "lucide-react";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { Calendar } from "@/components/ui/calendar";

// Definição local do tipo DateRange
interface DateRange {
  from: Date | null;
  to: Date | null;
}

interface FinancialOperation {
  id: number;
  tipoOperacao: "ENTRADA" | "SAIDA" | "NEUTRA";
  nomeOperacao: string;
  observacao: string;
  valor: number;
  data: Date;
  mes: string;
}

interface FilterState {
  tipoOperacao: "TODOS" | "ENTRADA" | "SAIDA" | "NEUTRA";
  nomeOperacao: string;
  mes: string;
  dateRange: DateRange;
}

export default function FinancialDashboard() {
  const { toast } = useToast();
  const [operations, setOperations] = useState<FinancialOperation[]>([]);
  const [newOperation, setNewOperation] = useState<Partial<FinancialOperation>>(
    {}
  );
  const [filters, setFilters] = useState<FilterState>({
    tipoOperacao: "TODOS",
    nomeOperacao: "",
    mes: "",
    dateRange: { from: null, to: null }, // Garantimos que from e to sejam sempre definidos, mesmo que seja null
  });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [totalPages, setTotalPages] = useState(1);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedOperation, setSelectedOperation] =
    useState<FinancialOperation | null>(null);

  const fetchOperations = useCallback(async () => {
    try {
      const queryParams = new URLSearchParams({
        tipoOperacao:
          filters.tipoOperacao === "TODOS" ? "" : filters.tipoOperacao,
        nomeOperacao: filters.nomeOperacao,
        mes: filters.mes,
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
        startDate: filters.dateRange.from
          ? filters.dateRange.from.toISOString()
          : "",
        endDate: filters.dateRange.to ? filters.dateRange.to.toISOString() : "",
      });

      const response = await fetch(`/api/operations/get?${queryParams}`);
      const data = await response.json();

      setOperations(data.operations);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Erro ao buscar operações:", error);
      toast({
        title: "Erro",
        description: "Erro ao buscar operações financeiras.",
        variant: "destructive",
      });
    }
  }, [toast, filters, currentPage]);

  useEffect(() => {
    fetchOperations();
  }, [fetchOperations, filters, currentPage]);

  const handleAddOperation = async () => {
    try {
      const response = await fetch("/api/operations/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipoOperacao: (newOperation.tipoOperacao || "ENTRADA") as
            | "ENTRADA"
            | "SAIDA"
            | "NEUTRA",
          nomeOperacao: newOperation.nomeOperacao,
          observacao: newOperation.observacao,
          valor: parseFloat(newOperation.valor?.toString() || "0"),
          mes: format(new Date(), "MMMM"),
        }),
      });

      if (response.ok) {
        const addedOperation = await response.json();
        setOperations([...operations, addedOperation]);
        toast({
          title: "Operação adicionada",
          description: "A nova operação foi adicionada com sucesso.",
        });
        setNewOperation({});
      } else {
        toast({
          title: "Erro",
          description: "Erro ao adicionar operação",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao adicionar operação:", error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar operação",
        variant: "destructive",
      });
    }
    setIsAddDialogOpen(false);
  };

  const handleDeleteOperation = async (operationId: number) => {
    try {
      const response = await fetch("/api/operations/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: operationId }),
      });

      if (response.ok) {
        setOperations(operations.filter((op) => op.id !== operationId));
        toast({
          title: "Operação excluída",
          description: "A operação foi removida com sucesso.",
        });
      } else {
        toast({
          title: "Erro",
          description: "Erro ao excluir operação",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao excluir operação:", error);
      toast({
        title: "Erro",
        description: "Erro ao excluir operação",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center text-green-600">
        Fluxo de Caixa Diário
      </h1>

      {/* Resumo de Totais */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-green-100 p-4 rounded-lg">
          <h2 className="font-semibold">Entradas</h2>
          <p>
            R${" "}
            {operations
              .filter((op) => op.tipoOperacao === "ENTRADA")
              .reduce((acc, op) => acc + op.valor, 0)
              .toFixed(2)}
          </p>
        </div>
        <div className="bg-red-100 p-4 rounded-lg">
          <h2 className="font-semibold">Saídas</h2>
          <p>
            R${" "}
            {operations
              .filter((op) => op.tipoOperacao === "SAIDA")
              .reduce((acc, op) => acc + op.valor, 0)
              .toFixed(2)}
          </p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="font-semibold">Saldo</h2>
          <p>
            R${" "}
            {(
              operations
                .filter((op) => op.tipoOperacao === "ENTRADA")
                .reduce((acc, op) => acc + op.valor, 0) -
              operations
                .filter((op) => op.tipoOperacao === "SAIDA")
                .reduce((acc, op) => acc + op.valor, 0)
            ).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-4 gap-4">
        <Select
          value={filters.tipoOperacao}
          onValueChange={(value) =>
            setFilters((prev) => ({
              ...prev,
              tipoOperacao: value as FilterState["tipoOperacao"],
            }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Tipo de Operação" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODOS">Todos</SelectItem>
            <SelectItem value="ENTRADA">Entrada</SelectItem>
            <SelectItem value="SAIDA">Saída</SelectItem>
            <SelectItem value="NEUTRA">Neutra</SelectItem>
          </SelectContent>
        </Select>
        <Input
          placeholder="Nome da Operação"
          value={filters.nomeOperacao}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, nomeOperacao: e.target.value }))
          }
        />
        <Input
          placeholder="Mês"
          value={filters.mes}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, mes: e.target.value }))
          }
        />
        {/* <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.dateRange.from && filters.dateRange.to ? (
                <>
                  {format(filters.dateRange.from, "dd/MM/yyyy")} -{" "}
                  {format(filters.dateRange.to, "dd/MM/yyyy")}
                </>
              ) : (
                <span>Selecionar intervalo de datas</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={filters.dateRange} // Passamos dateRange diretamente agora que ele está consistente
              onSelect={(range) =>
                setFilters((prev) => ({
                  ...prev,
                  dateRange: range || { from: null, to: null },
                }))
              }
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover> */}
      </div>

      {/* Botão de Adicionar Operação */}
      <div className="flex justify-end">
        <AlertDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="default">Adicionar Operação</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Adicionar Nova Operação</AlertDialogTitle>
              <AlertDialogDescription>
                Preencha as informações da nova operação financeira
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-4">
              <Select
                value={newOperation.tipoOperacao}
                onValueChange={(value) =>
                  setNewOperation({
                    ...newOperation,
                    tipoOperacao: value as "ENTRADA" | "SAIDA" | "NEUTRA",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de operação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ENTRADA">Entrada</SelectItem>
                  <SelectItem value="SAIDA">Saída</SelectItem>
                  <SelectItem value="NEUTRA">Neutra</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Nome da Operação"
                value={newOperation.nomeOperacao || ""}
                onChange={(e) =>
                  setNewOperation({
                    ...newOperation,
                    nomeOperacao: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Valor"
                type="number"
                value={newOperation.valor?.toString() || ""}
                onChange={(e) =>
                  setNewOperation({
                    ...newOperation,
                    valor: parseFloat(e.target.value),
                  })
                }
              />
              <Input
                placeholder="Observação"
                value={newOperation.observacao || ""}
                onChange={(e) =>
                  setNewOperation({
                    ...newOperation,
                    observacao: e.target.value,
                  })
                }
              />
            </div>
            <AlertDialogFooter>
              <Button onClick={handleAddOperation}>Salvar</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Tabela de Operações */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Data</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Nome</TableCell>
            <TableCell>Valor</TableCell>
            <TableCell>Observação</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {operations.map((operation) => (
            <TableRow key={operation.id}>
              <TableCell>
                {format(new Date(operation.data), "dd/MM/yyyy")}
              </TableCell>
              <TableCell>{operation.tipoOperacao}</TableCell>
              <TableCell>{operation.nomeOperacao}</TableCell>
              <TableCell>R$ {operation.valor.toFixed(2)}</TableCell>
              <TableCell>{operation.observacao}</TableCell>
              <TableCell className="flex justify-center gap-2">
                <AlertDialog
                  open={selectedOperation?.id === operation.id}
                  onOpenChange={() => setSelectedOperation(null)}
                >
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      onClick={() => setSelectedOperation(operation)}
                    >
                      Excluir
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir Operação</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir esta operação?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <Button
                        variant="secondary"
                        onClick={() => setSelectedOperation(null)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteOperation(operation.id)}
                      >
                        Confirmar
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Paginação */}
      <div className="flex justify-between items-center mt-4">
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
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Próxima
        </Button>
      </div>
    </div>
  );
}
