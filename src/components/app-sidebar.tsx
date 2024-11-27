import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  Home,
  Settings,
  ClipboardList,
  Shield,
  LogOutIcon,
  UserRoundPen,
  FilePlus,
  ClipboardCheck,
  ClipboardX,
  FileSymlink,
  Users2,
  UserRoundPlus,
} from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";

interface SidebarProps {
  userRole: string | undefined;
}

// Menu items para moderadores e administradores
const rotinas = [
  {
    title: "Rotinas a vencer",
    url: "/",
    icon: ClipboardList,
  },
  {
    title: "Rotinas vencidas",
    url: "/",
    icon: ClipboardX,
  },
  {
    title: "Rotinas realizadas",
    url: "/",
    icon: ClipboardCheck,
  },
];

const servicos = [
  {
    title: "Cadastrar OS",
    url: "/",
    icon: FilePlus,
  },
  {
    title: "Cadastrar Rotina",
    url: "/",
    icon: FileSymlink,
  },
  {
    title: "Gerenciar Equipe",
    url: "/",
    icon: Users2,
  },
  {
    title: "Gerenciar Colaborador",
    url: "/",
    icon: UserRoundPen,
  },
  {
    title: "Cadastrar Colaborador",
    url: "/cadastro",
    icon: UserRoundPlus,
  },
];

// Menu items exclusivos para administradores
const adminItems = [
  {
    title: "Admin",
    url: "/admin",
    icon: Shield,
  },
  {
    title: "Painel Adminstrativo",
    url: "/painel-adm",
    icon: ClipboardList,
  },
];

export function AppSidebar({ userRole }: SidebarProps) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="mt-2 ">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">
                <Home />
                <span>Painel</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* Menu Items for Moderators and Admins */}
        {(userRole === "MODERATOR" || userRole === "ADMIN") && (
          <SidebarGroup>
            <SidebarGroupLabel>Relatórios</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {rotinas.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Menu Items for Moderators and Admins */}
        {(userRole === "MODERATOR" || userRole === "ADMIN") && (
          <SidebarGroup>
            <SidebarGroupLabel>Serviços</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {servicos.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Menu Items for Admins Only */}
        {userRole === "ADMIN" && (
          <SidebarGroup>
            <SidebarGroupLabel>Administração</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Settings />
              <Link href="/configuracoes">Configurações</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <div
                className="cursor-pointer"
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                <LogOutIcon />
                <span>Sair</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
