import React from "react";
import { View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Text } from "@/components/ui/text";

import { useCurrentUser } from "@/hooks/use-current-user";
import { useLogoutMutation } from "@/features/auth/auth.hooks";

export default function PerfilScreen() {
  const { data: usuario } = useCurrentUser();
  const { mutate: logout, isPending } = useLogoutMutation();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-6">
        <View className="w-full max-w-sm">
          <Card className="border-border bg-card">
            <CardHeader className="gap-1 items-center">
              {/* Avatar com as iniciais do usuário logado */}
              <View className="w-16 h-16 bg-primary/10 rounded-full items-center justify-center mb-2">
                <Text className="text-xl font-bold text-primary">
                  {usuario?.nome?.substring(0, 2).toUpperCase() || "US"}
                </Text>
              </View>
              <CardTitle className="text-center text-2xl text-foreground">
                Meu Perfil
              </CardTitle>
              <CardDescription className="text-center">
                Gerencie suas informações de sessão
              </CardDescription>
            </CardHeader>

            <CardContent className="gap-6">
              {/* Informações dinâmicas vindas do useAuth */}
              <View className="gap-3 bg-muted/30 p-4 rounded-lg border border-border/50">
                <View>
                  <Text className="text-xs text-muted-foreground uppercase font-semibold">Nome</Text>
                  <Text className="text-base text-foreground font-medium">{usuario?.nome || "Não informado"}</Text>
                </View>
                
                <View>
                  <Text className="text-xs text-muted-foreground uppercase font-semibold">E-mail</Text>
                  <Text className="text-base text-foreground font-medium">{usuario?.email || "Não informado"}</Text>
                </View>

                <View>
                  <Text className="text-xs text-muted-foreground uppercase font-semibold">Nível de Acesso</Text>
                  <Text className="text-base text-foreground font-medium">{usuario?.perfil || "USER"}</Text>
                </View>
              </View>

              {/* Botão de Logout conectado ao useLogoutMutation */}
              <Button 
                variant="destructive"
                className="w-full" 
                onPress={() => logout()}
                disabled={isPending}
              >
                {isPending ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="font-semibold">Sair da Conta</Text>
                )}
              </Button>
            </CardContent>
          </Card>
        </View>
      </View>
    </SafeAreaView>
  );
}