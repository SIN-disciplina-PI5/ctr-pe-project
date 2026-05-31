import React from "react";
import { Link, useRouter } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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

// Schema simples local para validar o e-mail de recuperação
const forgotPasswordSchema = z.object({
  email: z
    .string({ error: "O e-mail é obrigatório" })
    .email("Insira um e-mail válido"),
});

export default function ForgotPasswordScreen() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: any) => {
    console.log("Recuperar senha para:", data.email);
    // Aqui futuramente chamaremos o hook de mutação da API
    alert("Se o e-mail estiver cadastrado, você receberá as instruções de redefinição.");
    router.replace("/(auth)/login");
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-6">
        <View className="w-full max-w-sm">
          <Card className="border-border bg-card">
            <CardHeader className="gap-2">
              <CardTitle className="text-center text-2xl text-foreground">
                Recuperar Senha
              </CardTitle>
              <CardDescription className="text-center">
                Insira o seu e-mail cadastrado para redefinir a sua senha
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

              {/* Botão de Enviar */}
              <Button className="w-full mt-2" onPress={handleSubmit(onSubmit)}>
                <Text>Enviar Instruções</Text>
              </Button>

              {/* Link para voltar ao Login */}
              <View className="flex-row justify-center mt-2">
                <Link href="/(auth)/login" asChild>
                  <Text className="text-primary underline font-medium text-sm">
                    Voltar para o Login
                  </Text>
                </Link>
              </View>
            </CardContent>
          </Card>
        </View>
      </View>
    </SafeAreaView>
  );
}