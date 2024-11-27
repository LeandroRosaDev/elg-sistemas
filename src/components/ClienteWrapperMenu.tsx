"use client";
import { usePathname } from "next/navigation";
import MenuSuspenso from "./MenuSuspenso";

export default function ClientMenuSuspenso() {
  const pathname = usePathname(); // Obtem a rota atual
  const hideSidebar =
    pathname === "/login" ||
    pathname === "/cadastro" ||
    pathname === "/esqueci-senha" ||
    pathname === "/erro-acesso";

  return <div>{!hideSidebar && <MenuSuspenso />}</div>;
}
