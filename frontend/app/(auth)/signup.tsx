import React from "react";
import { Link, useRouter } from "expo-router";
import { View, ScrollView } from "react-native";
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

import { signupSchema } from "@/features/auth/auth.schemas";

export default function SignUpScreen() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      nome: "",
      email: "",
      senha: "",
      confirmarSenha: "",
    },
  });

  const onSubmit = (data: any) => {
    console.log("Dados de registo:", data);
    // Aqui no futuro ligaremos o hook de useRegisterMutation
    // Por enquanto, podemos simular o sucesso e mandar o utilizador para o login
    router.replace("/(auth)/login");
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 items-center justify-center px-6 py-8">
          <View className="w-full max-w-sm">
            <Card className="border-border bg-card">
              <CardHeader className="gap-2">
                <CardTitle className="text-center text-2xl text-foreground">
                  Criar Conta
                </CardTitle>
                <CardDescription className="text-center">
                  Registe-se para aceder ao sistema de manutenção
                </CardDescription>
              </CardHeader>

              <CardContent className="gap-4">
                {/* Campo de Nome */}
                <View className="gap-2">
                  <Label nativeID="nome">Nome Completo</Label>
                  <Controller
                    control={control}
                    name="nome"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        aria-labelledby="nome"
                        placeholder="Seu nome"
                        autoCapitalize="words"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                      />
                    )}
                  />
                  {errors.nome && (
                    <Text className="text-xs text-destructive font-medium mt-1">
                      {String(errors.nome.message)}
                    </Text>
                  )}
                </View>

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
                  <Label nativeID="senha">Senha</Label>
                  <Controller
                    control={control}
                    name="senha"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        aria-labelledby="senha"
                        placeholder="No mínimo 6 caracteres"
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

                {/* Campo de Confirmação de Senha */}
                <View className="gap-2">
                  <Label nativeID="confirmarSenha">Confirmar Senha</Label>
                  <Controller
                    control={control}
                    name="confirmarSenha"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        aria-labelledby="confirmarSenha"
                        placeholder="Repita a sua senha"
                        secureTextEntry
                        autoCapitalize="none"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                      />
                    )}
                  />
                  {errors.confirmarSenha && (
                    <Text className="text-xs text-destructive font-medium mt-1">
                      {String(errors.confirmarSenha.message)}
                    </Text>
                  )}
                </View>

                {/* Botão de Registar */}
                <Button className="w-full mt-2" onPress={handleSubmit(onSubmit)}>
                  <Text>Criar conta</Text>
                </Button>

                <View className="flex-row justify-center gap-1 mt-2">
                  <Text className="text-muted-foreground">Já tem uma conta?</Text>
                  <Link href="/(auth)/login" asChild>
                    <Text className="text-primary underline">Fazer Login</Text>
                  </Link>
                </View>
              </CardContent>
            </Card>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}