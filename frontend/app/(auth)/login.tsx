import React from "react";
import { Link } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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

import { loginSchema } from "@/features/auth/auth.schemas";
import { useLoginMutation } from "@/features/auth/auth.hooks";

export default function LoginScreen() {
  const { mutate: login, isPending, error: mutationError } = useLoginMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      senha: "",
    },
  });

  const onSubmit = (data: any) => {
    login(data);
  };

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
              {/* Campo de E-mail */}
              <View className="gap-2">
                <Label nativeID="email">E-mail</Label>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      aria-labelledby="email"
                      placeholder="seuemail@empresa.com"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                {errors.email && (
                  <Text className="text-xs text-destructive font-medium mt-1">
                    {String(errors.email.message)}
                  </Text>
                )}
              </View>

              {/* Campo de Senha */}
              <View className="gap-2">
                <div className="flex items-center justify-between">
                  <Label nativeID="senha">Senha</Label>
                  <Link href="/(auth)/forgot-password" asChild>
                    <Text className="text-xs text-primary underline font-medium">
                      Esqueceu a senha?
                    </Text>
                  </Link>
                </div>
                <Controller
                  control={control}
                  name="senha"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      aria-labelledby="senha"
                      placeholder="Digite sua senha"
                      secureTextEntry
                      autoCapitalize="none"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                {errors.senha && (
                  <Text className="text-xs text-destructive font-medium mt-1">
                    {String(errors.senha.message)}
                  </Text>
                )}
              </View>

              {mutationError && (
                <View className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2">
                  <Text className="text-sm text-destructive">
                    E-mail ou senha inválidos ou erro de conexão.
                  </Text>
                </View>
              )}

              <Button 
                className="w-full" 
                onPress={handleSubmit(onSubmit)}
                disabled={isPending}
              >
                {isPending ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text>Entrar</Text>
                )}
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