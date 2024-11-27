"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
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
import { useToast } from "@/hooks/use-toast";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    role: "",
  });
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isPasswordAlertOpen, setIsPasswordAlertOpen] = useState(false);
  const [isEmailAlertOpen, setIsEmailAlertOpen] = useState(false); // Novo estado para o modal de email
  const [userToUpdate, setUserToUpdate] = useState<User | null>(null);
  const [newEmail, setNewEmail] = useState(""); // Novo estado para o email
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const { toast } = useToast();

  // Função para buscar usuários com filtros e paginação
  const fetchUsers = useCallback(
    async (page = 1) => {
      try {
        const queryParams = new URLSearchParams({
          page: page.toString(),
          name: filters.name || "", // Passando o filtro de nome
          email: filters.email || "", // Passando o filtro de email
          role: filters.role || "", // Passando o filtro de role
        });
        const res = await fetch(`/api/admin/listar-usuarios?${queryParams}`);
        const data = await res.json();

        if (res.ok) {
          setUsers(data.users);
          setTotalPages(data.totalPages);
          setCurrentPage(page);
        } else {
          toast({
            title: "Erro",
            description: data.error || "Erro ao carregar usuários",
            variant: "destructive",
          });
        }
      } catch {
        toast({
          title: "Erro",
          description: "Erro ao buscar usuários",
          variant: "destructive",
        });
      }
    },
    [filters, toast]
  );

  // Função para excluir um usuário
  const deleteUser = async () => {
    if (!userToUpdate) return;

    try {
      const res = await fetch(
        `/api/admin/excluir-usuario?id=${userToUpdate.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast({
          title: "Sucesso",
          description: "Usuário excluído com sucesso",
        });
        fetchUsers(currentPage); // Atualiza a lista de usuários após exclusão
        setIsAlertOpen(false); // Fechar o modal
      } else {
        toast({
          title: "Erro",
          description: data.error || "Erro ao excluir usuário",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Erro",
        description: "Erro ao excluir usuário",
        variant: "destructive",
      });
    }
  };

  // Função para alterar o nível de acesso
  const changeUserRole = async (userId: number, newRole: string) => {
    try {
      const res = await fetch("/api/admin/alterar-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, newRole }),
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: "Sucesso",
          description: "Nível de acesso atualizado com sucesso",
        });
        fetchUsers(currentPage); // Recarrega os usuários após a atualização
      } else {
        toast({
          title: "Erro",
          description: data.error || "Erro ao alterar nível de acesso",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Erro",
        description: "Erro ao alterar nível de acesso",
        variant: "destructive",
      });
    }
  };

  // Função para atualizar a senha
  const updatePassword = async () => {
    if (!userToUpdate) return;

    if (newPassword !== passwordConfirmation) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await fetch("/api/admin/alterar-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userToUpdate.id,
          newPassword,
          passwordConfirmation,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: "Sucesso",
          description: "Senha atualizada com sucesso",
        });
        setIsPasswordAlertOpen(false); // Fechar o modal de senha
      } else {
        toast({
          title: "Erro",
          description: data.error || "Erro ao atualizar senha",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Erro",
        description: "Erro ao atualizar senha",
        variant: "destructive",
      });
    }
  };

  // Função para atualizar o email
  const updateEmail = async () => {
    if (!userToUpdate) return;

    try {
      const res = await fetch("/api/admin/alterar-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userToUpdate.id,
          newEmail,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: "Sucesso",
          description: "Email atualizado com sucesso",
        });
        setIsEmailAlertOpen(false); // Fechar o modal de email
      } else {
        toast({
          title: "Erro",
          description: data.error || "Erro ao atualizar email",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Erro",
        description: "Erro ao atualizar email",
        variant: "destructive",
      });
    }
  };

  // Efeito para buscar usuários quando os filtros ou a página mudam
  useEffect(() => {
    fetchUsers(currentPage);
  }, [fetchUsers, currentPage]);

  return (
    <div className="m-6 mr-12">
      {/* Filtros */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Input
          placeholder="Nome"
          value={filters.name}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <Input
          placeholder="Email"
          value={filters.email}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, email: e.target.value }))
          }
        />
        <Select
          value={filters.role} // Assumimos que sempre terá um valor válido, incluindo "all"
          onValueChange={(value) =>
            setFilters((prev) => ({ ...prev, role: value }))
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione um nível de acesso" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem> {/* Nova opção "all" */}
            <SelectItem value="USER">Usuário</SelectItem>
            <SelectItem value="MODERATOR">Moderador</SelectItem>
            <SelectItem value="ADMIN">Administrador</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => fetchUsers(1)}>Filtrar</Button>
      </div>

      {/* Tabela de Usuários */}
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Nome</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Nível de Acesso</th>
            <th className="px-4 py-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border px-4 py-2">{user.name || "Sem Nome"}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">
                <Select
                  value={user.role}
                  onValueChange={(newRole) => changeUserRole(user.id, newRole)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">Usuário</SelectItem>
                    <SelectItem value="MODERATOR">Moderador</SelectItem>
                    <SelectItem value="ADMIN">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </td>
              <td className="border px-4 py-2">
                <div className="flex gap-2 justify-center">
                  <Button
                    className="min-w-[100px]"
                    variant="default"
                    onClick={() => {
                      setUserToUpdate(user);
                      setIsPasswordAlertOpen(true); // Abrir o modal de senha
                    }}
                  >
                    Trocar Senha
                  </Button>
                  <Button
                    className="min-w-[100px]"
                    variant="default"
                    onClick={() => {
                      setUserToUpdate(user);
                      setNewEmail(user.email);
                      setIsEmailAlertOpen(true); // Abrir o modal de email
                    }}
                  >
                    Trocar Email
                  </Button>
                  <Button
                    className="min-w-[100px]"
                    variant="destructive"
                    onClick={() => {
                      setUserToUpdate(user);
                      setIsAlertOpen(true); // Abrir o modal de confirmação
                    }}
                  >
                    Excluir
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
              Tem certeza de que deseja deletar o usuário{" "}
              <strong>{userToUpdate?.name}</strong>? Essa ação não poderá ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={deleteUser}>Deletar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* AlertDialog para troca de senha */}
      <AlertDialog
        open={isPasswordAlertOpen}
        onOpenChange={setIsPasswordAlertOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Trocar Senha</AlertDialogTitle>
            <AlertDialogDescription>
              Insira a nova senha para o usuário{" "}
              <strong>{userToUpdate?.name}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="p-4">
            <Input
              type="password"
              placeholder="Nova senha"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mb-4"
            />
            <Input
              type="password"
              placeholder="Confirme a nova senha"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={updatePassword}>
              Atualizar Senha
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* AlertDialog para troca de email */}
      <AlertDialog open={isEmailAlertOpen} onOpenChange={setIsEmailAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Trocar Email</AlertDialogTitle>
            <AlertDialogDescription>
              Insira o novo email para o usuário{" "}
              <strong>{userToUpdate?.name}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="p-4">
            <Input
              type="email"
              placeholder="Novo email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="mb-4"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={updateEmail}>
              Atualizar Email
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
