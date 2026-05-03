import { Link } from "expo-router";
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

export default function LoginScreen() {
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
                  placeholder="seuemail@empresa.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View className="gap-2">
                <Label nativeID="senha">Senha</Label>
                <Input
                  aria-labelledby="senha"
                  placeholder="Digite sua senha"
                  secureTextEntry
                />
              </View>

              <View className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2">
                <Text className="text-sm text-destructive">
                  E-mail ou senha invalidos
                </Text>
              </View>

              <Button className="w-full">
                <Text>Entrar</Text>
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
