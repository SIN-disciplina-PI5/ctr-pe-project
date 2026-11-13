import { Pressable, ScrollView, View } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import {
  BarChart3,
  Bell,
  Boxes,
  Building2,
  CirclePause,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  MapPinned,
  MessageSquareText,
  Package,
  TrendingUp,
  Users,
} from "lucide-react-native";

import { Logo } from "@/components/brand/logo";
import { EmpresaCompactSelect } from "@/components/domain/empresa-compact-select";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { hasPermission, type AppPermission } from "@/lib/permissions";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  permission: AppPermission;
};

type NavGroup = {
  titulo: string;
  itens: NavItem[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    titulo: "Visão geral",
    itens: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, permission: "dashboardRead" },
      { href: "/indicadores", label: "Indicadores", icon: BarChart3, permission: "dashboardRead" },
      { href: "/desempenho", label: "Desempenho", icon: TrendingUp, permission: "costsRead" },
      { href: "/assistente", label: "Assistente", icon: MessageSquareText, permission: "assistantUse" },
    ],
  },
  {
    titulo: "Operação",
    itens: [
      { href: "/ordens-servico", label: "Ordens de serviço", icon: ClipboardList, permission: "maintenanceRead" },
      { href: "/ativos", label: "Ativos", icon: Boxes, permission: "maintenanceRead" },
      { href: "/paradas", label: "Paradas", icon: CirclePause, permission: "maintenanceRead" },
      { href: "/materiais", label: "Materiais", icon: Package, permission: "maintenanceRead" },
      { href: "/alertas", label: "Alertas", icon: Bell, permission: "maintenanceRead" },
    ],
  },
  {
    titulo: "Gestão",
    itens: [
      { href: "/auditoria", label: "Auditoria", icon: FileText, permission: "auditRead" },
      { href: "/cadastros/empresas", label: "Empresas", icon: Building2, permission: "companiesRead" },
      { href: "/cadastros/localizacoes", label: "Localizações", icon: MapPinned, permission: "locationsRead" },
      { href: "/cadastros/usuarios", label: "Usuários", icon: Users, permission: "usersRead" },
    ],
  },
];

function ativo(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function iniciais(nome?: string) {
  if (!nome) return "U";
  const partes = nome.trim().split(/\s+/);
  return (partes[0][0] + (partes.length > 1 ? partes[partes.length - 1][0] : "")).toUpperCase();
}

type SidebarProps = {
  pathname: string;
  nomeUsuario?: string;
  perfilUsuario?: Parameters<typeof hasPermission>[0];
  onNavigate: (href: string) => void;
  onLogout: () => void;
};

// Menu lateral escuro, usado fixo no desktop e como gaveta no celular.
export function Sidebar({
  pathname,
  nomeUsuario,
  perfilUsuario,
  onNavigate,
  onLogout,
}: SidebarProps) {
  return (
    <View className="flex-1 bg-[#131316]">
      <View className="flex-row items-center justify-between px-5 pb-5 pt-6">
        <Logo claro showName size={34} />
        <Pressable
          onPress={() => onNavigate("/alertas/me")}
          className="h-9 w-9 items-center justify-center rounded-xl bg-white/5 hover:bg-white/10"
        >
          <Icon as={Bell} size={16} className="text-zinc-300" />
        </Pressable>
      </View>

      <View className="px-4 pb-4">
        <Text className="mb-1.5 px-1 text-xs font-medium text-zinc-500">Empresa</Text>
        <EmpresaCompactSelect variant="sidebar" />
      </View>

      <ScrollView className="flex-1" contentContainerClassName="gap-5 px-3 pb-4 pt-1">
        {NAV_GROUPS.map((grupo) => {
          const itens = grupo.itens.filter((item) =>
            hasPermission(perfilUsuario, item.permission),
          );
          if (itens.length === 0) return null;

          return (
            <View key={grupo.titulo} className="gap-0.5">
              <Text className="mb-1 px-3 text-xs font-medium text-zinc-500">
                {grupo.titulo}
              </Text>
              {itens.map((item) => {
                const selecionado = ativo(pathname, item.href);
                return (
                  <Pressable
                    key={item.href}
                    onPress={() => onNavigate(item.href)}
                    className={cn(
                      "flex-row items-center gap-3 rounded-xl px-3 py-2.5",
                      selecionado ? "bg-brand" : "hover:bg-white/5 active:bg-white/10",
                    )}
                  >
                    <Icon
                      as={item.icon}
                      size={18}
                      className={selecionado ? "text-brand-foreground" : "text-zinc-400"}
                    />
                    <Text
                      className={cn(
                        "text-sm font-medium",
                        selecionado ? "text-brand-foreground" : "text-zinc-300",
                      )}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          );
        })}
      </ScrollView>

      <View className="m-3 flex-row items-center gap-3 rounded-2xl bg-white/5 p-3">
        <Pressable
          onPress={() => onNavigate("/perfil")}
          className="flex-1 flex-row items-center gap-3"
        >
          <View className="h-9 w-9 items-center justify-center rounded-full bg-brand">
            <Text className="text-xs font-bold text-brand-foreground">
              {iniciais(nomeUsuario)}
            </Text>
          </View>
          <View className="flex-1">
            <Text numberOfLines={1} className="text-sm font-medium text-zinc-100">
              {nomeUsuario ?? "Usuário"}
            </Text>
            <Text numberOfLines={1} className="text-xs text-zinc-500">
              {perfilUsuario ?? "Sem perfil"}
            </Text>
          </View>
        </Pressable>
        <Pressable
          onPress={onLogout}
          className="h-9 w-9 items-center justify-center rounded-xl hover:bg-white/10"
        >
          <Icon as={LogOut} size={16} className="text-zinc-400" />
        </Pressable>
      </View>
    </View>
  );
}
