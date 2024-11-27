import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

// Define a tipagem para as props do componente
interface ChangePasswordDialogProps {
  onChangePassword: (oldPassword: string, newPassword: string) => void;
}

export function ChangePasswordDialog({
  onChangePassword,
}: ChangePasswordDialogProps) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      alert("A nova senha e a confirmação não coincidem.");
      return;
    }
    onChangePassword(oldPassword, newPassword);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Alterar Senha</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Alterar Senha</DialogTitle>
          <DialogDescription>
            Insira sua senha atual e escolha uma nova senha.
          </DialogDescription>
        </DialogHeader>
        <Input
          type="password"
          placeholder="Senha Atual"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="mt-4"
        />
        <Input
          type="password"
          placeholder="Nova Senha"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="mt-4"
        />
        <Input
          type="password"
          placeholder="Confirme a Nova Senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mt-4"
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button onClick={handleChangePassword}>Salvar Nova Senha</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
