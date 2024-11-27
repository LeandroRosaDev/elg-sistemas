"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { Trash, Edit } from "lucide-react";
import { useSession } from "next-auth/react";

interface Produto {
  id: number;
  nome: string;
  nome_completo: string;
  categoria: string;
  sub_categoria: string;
  valor: string;
  valor_parcelado: string;
  fornecedor: string;
}

interface Filters {
  nome_completo: string;
  fornecedor: string;
  categoria: string;
  sub_categoria: string;
}

export default function ProdutoPrecoPage() {
  const [formData, setFormData] = useState<Omit<Produto, "id">>({
    nome: "",
    nome_completo: "",
    categoria: "",
    sub_categoria: "",
    valor: "",
    valor_parcelado: "",
    fornecedor: "ALPOIM",
  });
  const { data: session } = useSession();

  const [editData, setEditData] = useState<Produto | null>(null); // Dados para edição
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [filters, setFilters] = useState<Filters>({
    nome_completo: "",
    fornecedor: "",
    categoria: "",
    sub_categoria: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { toast } = useToast();

  const handleEdit = (produto: Produto) => {
    setEditData(produto);
    setIsEditModalOpen(true);
  };

  const fetchProdutos = useCallback(async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.nome_completo)
        queryParams.append("nome_completo", filters.nome_completo);
      if (filters.fornecedor)
        queryParams.append("fornecedor", filters.fornecedor);
      if (filters.categoria) queryParams.append("categoria", filters.categoria);
      if (filters.sub_categoria)
        queryParams.append("sub_categoria", filters.sub_categoria);

      const response = await fetch(
        `/api/produtopreco/get?${queryParams.toString()}`
      );
      if (!response.ok) {
        throw new Error("Erro ao buscar produtos");
      }
      const data = await response.json();
      setProdutos(data.produtos || []);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      toast({
        title: "Erro",
        description: "Erro ao buscar produtos. Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  }, [filters, toast]);

  useEffect(() => {
    fetchProdutos();
  }, [fetchProdutos]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFilterChange = (name: keyof Filters, value: string) => {
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/produtopreco/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast({
          title: "Erro ao cadastrar produto",
          description:
            errorData.error || "Não foi possível cadastrar o produto",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Sucesso!",
          description: "Produto cadastrado com sucesso.",
        });

        fetchProdutos();
      }
    } catch (error) {
      console.error("Erro ao enviar o formulário:", error);
      toast({
        title: "Erro",
        description: "Erro ao cadastrar produto. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch("/api/produtopreco/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error("Erro ao deletar produto");
      }

      toast({
        title: "Sucesso!",
        description: "Produto deletado com sucesso.",
      });
      fetchProdutos();
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      toast({
        title: "Erro",
        description: "Erro ao deletar produto. Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  const handleEditSubmit = async () => {
    if (!editData) return;

    try {
      const response = await fetch("/api/produtopreco/put", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editData),
      });

      if (!response.ok) {
        throw new Error("Erro ao editar produto");
      }

      toast({
        title: "Sucesso!",
        description: "Produto atualizado com sucesso.",
      });
      setEditData(null);
      setIsEditModalOpen(false);
      fetchProdutos();
    } catch (error) {
      console.error("Erro ao editar produto:", error);
      toast({
        title: "Erro",
        description: "Erro ao editar produto. Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6">
      {/* Modal para adicionar produtos */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button>Adicionar Produto</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cadastrar Novo Produto</AlertDialogTitle>
            <AlertDialogDescription>
              Preencha os campos abaixo para cadastrar um novo produto.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <form className="space-y-4">
            {Object.keys(formData)
              .filter(
                (field) =>
                  field !== "fornecedor" &&
                  field !== "categoria" &&
                  field !== "sub_categoria"
              )
              .map((field) => (
                <div key={field} className="flex flex-col space-y-1">
                  <Label htmlFor={field}>{field.replace("_", " ")}</Label>
                  <Input
                    id={field}
                    name={field}
                    value={formData[field as keyof typeof formData]}
                    onChange={handleInputChange}
                    placeholder={`Digite o ${field.replace("_", " ")}`}
                  />
                </div>
              ))}
            <div className="flex flex-col space-y-1">
              <Label htmlFor="categoria">Categoria</Label>
              <Select
                value={formData.categoria}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, categoria: value }))
                }
              >
                <SelectTrigger id="categoria">
                  <SelectValue placeholder="Selecione o categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sala de estar">Sala de estar</SelectItem>
                  <SelectItem value="Quarto de Solteiro">
                    Quarto de Solteiro
                  </SelectItem>
                  <SelectItem value="Quarto de Casal">
                    Quarto de Casal
                  </SelectItem>
                  <SelectItem value="Cozinha">Cozinha</SelectItem>
                  <SelectItem value="Banheiro">Banheiro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1">
              <Label htmlFor="sub_categoria">Sub Categoria</Label>
              <Select
                value={formData.sub_categoria}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, sub_categoria: value }))
                }
              >
                <SelectTrigger id="sub_categoria">
                  <SelectValue placeholder="Selecione a Sub Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Retráteis">Retráteis</SelectItem>
                  <SelectItem value="Painéis">Painéis</SelectItem>
                  <SelectItem value="Mesa de Jantar">Mesa de Jantar</SelectItem>
                  <SelectItem value="Cadeiras">Cadeiras</SelectItem>
                  <SelectItem value="Poltronas">Poltronas</SelectItem>
                  <SelectItem value="Cabeceiras">Cabeceiras</SelectItem>
                  <SelectItem value="Multiuso">Multiuso</SelectItem>
                  <SelectItem value="Camas de Casal">Camas de Casal</SelectItem>
                  <SelectItem value="Camas de Solteiro">
                    Camas de Solteiro
                  </SelectItem>
                  <SelectItem value="Colchões de Casal">
                    Colchões de Casal
                  </SelectItem>
                  <SelectItem value="Colchões de Solteiro">
                    Colchões de Solteiro
                  </SelectItem>
                  <SelectItem value="Guarda Roupa de Solteiro">
                    Guarda Roupa de Solteiro
                  </SelectItem>
                  <SelectItem value="Guarda Roupa de Casal">
                    Guarda Roupa de Casal
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1">
              <Label htmlFor="fornecedor">Fornecedor</Label>
              <Select
                value={formData.fornecedor}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, fornecedor: value }))
                }
              >
                <SelectTrigger id="fornecedor">
                  <SelectValue placeholder="Selecione o fornecedor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Alpoim">Alpoim</SelectItem>
                  <SelectItem value="Prime">Prime</SelectItem>
                  <SelectItem value="Sr Móveis">Sr Móveis</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>
          <AlertDialogFooter>
            <Button disabled={isLoading} onClick={handleSubmit}>
              {isLoading ? "Enviando..." : "Enviar"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Filtros */}
      <div className="mt-6 space-y-4">
        <h2 className="text-xl font-semibold">Filtros</h2>
        <div className="flex space-x-4 items-center">
          <Input
            placeholder="Buscar por nome completo"
            value={filters.nome_completo}
            onChange={(e) =>
              handleFilterChange("nome_completo", e.target.value)
            }
          />
          <div className="flex items-center space-x-2">
            <Select
              value={filters.categoria}
              onValueChange={(value) => handleFilterChange("fornecedor", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sala">Sala de Estar</SelectItem>
                <SelectItem value="Quarto Solteiro">Quarto Solteiro</SelectItem>
              </SelectContent>
            </Select>
            {filters.categoria && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFilterChange("fornecedor", "")}
              >
                Limpar
              </Button>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Select
              value={filters.fornecedor}
              onValueChange={(value) => handleFilterChange("fornecedor", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o fornecedor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALPOIM">ALPOIM</SelectItem>
                <SelectItem value="PRIME">PRIME</SelectItem>
              </SelectContent>
            </Select>
            {filters.fornecedor && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFilterChange("fornecedor", "")}
              >
                Limpar
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Modal para editar produto */}
      <AlertDialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Editar Produto</AlertDialogTitle>
          </AlertDialogHeader>
          <form className="space-y-4">
            {editData &&
              Object.keys(editData)
                .filter((field) => field !== "id")
                .map((field) => (
                  <div key={field} className="flex flex-col space-y-1">
                    <Label htmlFor={field}>{field.toUpperCase()}</Label>
                    <Input
                      id={field}
                      name={field}
                      value={editData[field as keyof Produto] || ""}
                      onChange={(e) =>
                        setEditData((prev) =>
                          prev ? { ...prev, [field]: e.target.value } : prev
                        )
                      }
                    />
                  </div>
                ))}
          </form>
          <AlertDialogFooter>
            <Button onClick={handleEditSubmit}>Salvar</Button>
            <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>
              Cancelar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Tabela de produtos */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Lista de Produtos</h2>
        <Table>
          <TableHeader>
            <TableRow className="m-auto text-center">
              <TableHead>Nome</TableHead>
              <TableHead>Nome Completo</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Sub Categoria</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Valor em 12x</TableHead>
              <TableHead>Fornecedor</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {produtos.map((produto) => (
              <TableRow key={produto.id}>
                <TableCell>{produto.nome}</TableCell>
                <TableCell>{produto.nome_completo}</TableCell>
                <TableCell>{produto.categoria}</TableCell>
                <TableCell>{produto.sub_categoria}</TableCell>
                <TableCell>R${produto.valor},00</TableCell>
                <TableCell>R${produto.valor_parcelado},00</TableCell>
                <TableCell>{produto.fornecedor}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(produto)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  {session?.user?.role === "ADMIN" && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(produto.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
