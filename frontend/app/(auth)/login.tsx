import { Link, router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { useSignIn } from "@/features/auth/auth.hooks";
import { setToken as persistToken } from "@/infrastructure/storage/token-storage";
import { useAuthStore } from "@/store/auth-store";

export default function LoginScreen() {
  const signIn = useSignIn();
  const setAuthToken = useAuthStore((state) => state.setToken);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    const result = await signIn.mutateAsync({
      email,
      password,
    });

    await persistToken(result.accessToken);
    setAuthToken(result.accessToken);

    router.replace("/home");
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-6">
        <View className="w-full max-w-sm">
          <Card className="border-border bg-card">
            <CardHeader className="gap-2">
              <CardTitle className="text-center text-2xl text-foreground">
                Entrar
              </CardTitle>
              <CardDescription className="text-center">
                Acesse o sistema de manutencao
              </CardDescription>
            </CardHeader>

            <CardContent className="gap-5">
              <View className="gap-2">
                <Label nativeID="email">E-mail</Label>
                <Input
                  aria-labelledby="email"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="seuemail@empresa.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View className="gap-2">
                <Label nativeID="senha">Senha</Label>
                <Input
                  aria-labelledby="senha"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Digite sua senha"
                  secureTextEntry
                />
              </View>

              {signIn.isError ? (
                <View className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2">
                  <Text className="text-sm text-destructive">
                    E-mail ou senha invalidos
                  </Text>
                </View>
              ) : null}

              <Button
                className="w-full"
                disabled={signIn.isPending}
                onPress={handleLogin}
              >
                <Text>{signIn.isPending ? "Entrando..." : "Entrar"}</Text>
              </Button>

              <View className="flex-row justify-center gap-1">
                <Text className="text-muted-foreground">Nao tem conta?</Text>
                <Link href="/(auth)/signup" asChild>
                  <Text className="text-primary underline">Criar conta</Text>
                </Link>
              </View>
            </CardContent>
          </Card>
        </View>
      </View>
    </SafeAreaView>
  );
}
