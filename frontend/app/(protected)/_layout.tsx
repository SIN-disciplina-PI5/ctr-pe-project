import { Stack, useSegments } from "expo-router";
import { Bell, ChevronDown } from "lucide-react-native";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

const TITLES: Record<string, string> = {
  home: "Home",
  dashboard: "Dashboard",
  "ordens-servico": "Ordens de Servico",
  ativos: "Ativos",
  alertas: "Alertas",
  perfil: "Meu Perfil",
};

function getScreenTitle(segment?: string) {
  if (!segment) return "Dashboard";
  return TITLES[segment] ?? "Sistema";
}

export default function ProtectedLayout() {
  const segments = useSegments();
  const currentSegment = segments[segments.length - 1];
  const title = getScreenTitle(currentSegment);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 bg-background">
        <Card className="mx-4 mt-4 rounded-lg border border-border bg-card px-4 py-3">
          <View className="flex-row items-center justify-between gap-3">
            <View className="flex-1">
              <Text className="text-lg font-semibold text-foreground">{title}</Text>
            </View>

            <View className="flex-row items-center gap-2">
              <Button variant="outline" className="h-10 flex-row items-center gap-2 px-3">
                <Text>CTR-PE Matriz</Text>
                <Icon as={ChevronDown} className="text-foreground size-4" />
              </Button>

              <Button variant="outline" size="icon" className="h-10 w-10">
                <Icon as={Bell} className="text-foreground size-4" />
              </Button>

              <View className="flex-row items-center gap-2 rounded-lg border border-border bg-muted/40 px-2 py-1.5">
                <Avatar alt="Usuario atual" className="h-8 w-8">
                  <AvatarFallback>
                    <Text>AD</Text>
                  </AvatarFallback>
                </Avatar>
                <View>
                  <Text className="text-xs text-muted-foreground">Usuario</Text>
                  <Text className="text-sm font-medium text-foreground">Admin</Text>
                </View>
              </View>
            </View>
          </View>
        </Card>

        <View className="flex-1 px-4 pb-4 pt-4">
          <Stack screenOptions={{ headerShown: false }} />
        </View>
      </View>
    </SafeAreaView>
  );
}
