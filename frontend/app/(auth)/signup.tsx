import React, { useEffect, useState } from "react";
import { Link, useRouter } from "expo-router";
import { View, ScrollView, Pressable, ActivityIndicator, Alert } from "react-native";
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
import { authService } from "@/infrastructure/auth/auth.service";
import type { PerfilUsuario } from "@/features/usuarios/usuarios.types";

const PERFIS: PerfilUsuario[] = ["ADMIN", "GESTOR", "SUPERVISOR", "TECNICO", "CONSULTA"];

type FormData = {
  nome: string;
  email: string;
  empresaId: string;
  perfil: PerfilUsuario;
  senha: string;
  confirmarSenha: string;
};

type EmpresaOption = {
  id: string;
  nome: string;
};

export default function SignUpScreen() {
  const router = useRouter();
  const [empresas, setEmpresas] = useState<EmpresaOption[]>([]);
  const [loadingEmpresas, setLoadingEmpresas] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      nome: "",
      email: "",
      empresaId: "",
      perfil: "CONSULTA",
      senha: "",
      confirmarSenha: "",
    },
  });

  const empresaId = watch("empresaId");
  const perfil = watch("perfil");

  useEffect(() => {
    async function loadEmpresas() {
      try {
        const result = await authService.listSignupEmpresas();
        setEmpresas(result);
      } catch {
        Alert.alert("Erro", "Não foi possível carregar as empresas disponíveis.");
      } finally {
        setLoadingEmpresas(false);
      }
    }

    loadEmpresas();
  }, []);

  async function onSubmit(data: FormData) {
    try {
      setSubmitting(true);

      await authService.signUpTesting({
        nome: data.nome.trim(),
        email: data.email.trim(),
        password: data.senha,
        empresaId: data.empresaId,
        perfil: data.perfil,
      });

      Alert.alert(
        "Cadastro realizado",
        "Usuário criado com sucesso. Agora você já pode fazer login.",
        [{ text: "OK", onPress: () => router.replace("/(auth)/login") }],
      );
    } catch (error: any) {
      Alert.alert("Erro no cadastro", error.message || "Não foi possível criar o usuário.");
    } finally {
      setSubmitting(false);
    }
  }

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
                  Cadastro de teste para acesso imediato ao sistema
                </CardDescription>
              </CardHeader>

              <CardContent className="gap-4">
                <View className="gap-2">
                  <Label nativeID="nome">Nome completo</Label>
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
                  {errors.nome ? (
                    <Text className="text-xs text-destructive">{String(errors.nome.message)}</Text>
                  ) : null}
                </View>

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
                  {errors.email ? (
                    <Text className="text-xs text-destructive">{String(errors.email.message)}</Text>
                  ) : null}
                </View>

                <View className="gap-2">
                  <Label>Empresa</Label>
                  {loadingEmpresas ? (
                    <ActivityIndicator />
                  ) : (
                    <View className="gap-2">
                      {empresas.map((empresa) => (
                        <Pressable
                          key={empresa.id}
                          onPress={() => setValue("empresaId", empresa.id)}
                          className={`rounded-md border px-3 py-2 ${
                            empresaId === empresa.id
                              ? "border-primary bg-primary"
                              : "border-border bg-background"
                          }`}
                        >
                          <Text
                            className={
                              empresaId === empresa.id
                                ? "text-primary-foreground"
                                : "text-foreground"
                            }
                          >
                            {empresa.nome}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  )}
                  {errors.empresaId ? (
                    <Text className="text-xs text-destructive">
                      {String(errors.empresaId.message)}
                    </Text>
                  ) : null}
                </View>

                <View className="gap-2">
                  <Label>Perfil</Label>
                  <View className="flex-row flex-wrap gap-2">
                    {PERFIS.map((item) => (
                      <Pressable
                        key={item}
                        onPress={() => setValue("perfil", item)}
                        className={`rounded-full border px-3 py-1.5 ${
                          perfil === item
                            ? "border-primary bg-primary"
                            : "border-border bg-background"
                        }`}
                      >
                        <Text
                          className={
                            perfil === item
                              ? "text-primary-foreground text-xs"
                              : "text-foreground text-xs"
                          }
                        >
                          {item}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                  {errors.perfil ? (
                    <Text className="text-xs text-destructive">{String(errors.perfil.message)}</Text>
                  ) : null}
                </View>

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
                  {errors.senha ? (
                    <Text className="text-xs text-destructive">{String(errors.senha.message)}</Text>
                  ) : null}
                </View>

                <View className="gap-2">
                  <Label nativeID="confirmarSenha">Confirmar senha</Label>
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
                  {errors.confirmarSenha ? (
                    <Text className="text-xs text-destructive">
                      {String(errors.confirmarSenha.message)}
                    </Text>
                  ) : null}
                </View>

                <Button
                  className="w-full mt-2"
                  onPress={handleSubmit(onSubmit)}
                  disabled={submitting || loadingEmpresas}
                >
                  <Text>{submitting ? "Criando..." : "Criar conta"}</Text>
                </Button>

                <View className="flex-row justify-center gap-1 mt-2">
                  <Text className="text-muted-foreground">Já tem uma conta?</Text>
                  <Link href="/(auth)/login" asChild>
                    <Text className="text-primary underline">Fazer login</Text>
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