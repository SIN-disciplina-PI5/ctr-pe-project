import type { ReactNode } from "react";
import { Pressable, View } from "react-native";
import { usePathname, useRouter } from "expo-router";
import type { LucideIcon } from "lucide-react-native";
import {
    Bell,
    Boxes,
    Building2,
    CirclePause,
    ClipboardList,
    FileText,
    LayoutDashboard,
    LogOut,
    MapPinned,
    Package,
    UserCircle2,
    Users,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EmpresaCompactSelect } from "@/components/domain/empresa-compact-select";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { removeToken } from "@/infrastructure/storage/token-storage";
import { useAuthStore } from "@/store/auth-store";

type NavItem = {
    href: string;
    label: string;
    icon: LucideIcon;
};

const NAV_ITEMS: NavItem[] = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/ordens-servico", label: "Ordens", icon: ClipboardList },
    { href: "/ativos", label: "Ativos", icon: Boxes },
    { href: "/materiais", label: "Materiais", icon: Package },
    { href: "/paradas", label: "Paradas", icon: CirclePause },
    { href: "/alertas", label: "Alertas", icon: Bell },
    { href: "/auditoria", label: "Auditoria", icon: FileText },
    { href: "/cadastros/empresas", label: "Empresas", icon: Building2 },
    { href: "/cadastros/localizacoes", label: "Localizacoes", icon: MapPinned },
    { href: "/cadastros/usuarios", label: "Usuarios", icon: Users },
    { href: "/perfil", label: "Perfil", icon: UserCircle2 },
];

function matchesPath(pathname: string, href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
}

function TopItem({
    item,
    active,
    onPress,
}: {
    item: NavItem;
    active: boolean;
    onPress: () => void;
}) {
    return (
        <Pressable
            onPress={onPress}
            className={cn(
                "h-10 flex-1 items-center justify-center rounded-md border",
                active ? "border-primary bg-primary" : "border-border bg-card",
            )}
        >
            <Icon
                as={item.icon}
                size={16}
                className={active ? "text-primary-foreground" : "text-muted-foreground"}
            />
        </Pressable>
    );
}

export function ProtectedShell({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    const user = useAuthStore((state) => state.user);
    const clearAuth = useAuthStore((state) => state.clearAuth);

    async function handleLogout() {
        await removeToken();
        clearAuth();
        router.replace("/(auth)/login");
    }

    return (
        <SafeAreaView className="flex-1 bg-background">
            <View className="flex-1 bg-background">
                <View className="border-b border-border bg-background">
                    <View className="flex-row items-center px-4 py-3">
                        <View className="min-w-0 flex-1 max-w-[220px]">
                            <EmpresaCompactSelect />
                        </View>

                        <View className="ml-auto flex-row items-center gap-3 pl-3 shrink-0">
                            <Pressable
                                onPress={() => router.push("/alertas/me")}
                                className="h-9 w-9 items-center justify-center rounded-md border border-border bg-card"
                            >
                                <Icon as={Bell} size={16} className="text-foreground" />
                            </Pressable>

                            <View className="w-[120px] items-end">
                                <Text numberOfLines={1} className="text-sm font-medium text-foreground">
                                    {user?.nome ?? "Usuario"}
                                </Text>
                                <Text numberOfLines={1} className="text-xs text-muted-foreground">
                                    {user?.perfil ?? "Sem perfil"}
                                </Text>
                            </View>

                            <Pressable
                                onPress={handleLogout}
                                className="h-9 w-9 items-center justify-center rounded-md border border-border bg-card"
                            >
                                <Icon as={LogOut} size={16} className="text-foreground" />
                            </Pressable>
                        </View>
                    </View>

                    <View className="flex-row items-center gap-1 px-4 pb-3">
                        {NAV_ITEMS.map((item) => (
                            <TopItem
                                key={item.href}
                                item={item}
                                active={matchesPath(pathname, item.href)}
                                onPress={() => router.push(item.href)}
                            />
                        ))}
                    </View>
                </View>

                <View className="flex-1 bg-background">{children}</View>
            </View>
        </SafeAreaView>
    );
}