import React, { useState } from "react";
import { useRouter } from "expo-router";
import { View, TextInput, Pressable, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";

import { setToken } from "../../src/infrastructure/storage/token-storage";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleLogin() {
    if (!email || !senha) {
      Alert.alert("Atenção", "Por favor, preencha todos os campos.");
      return;
    }
    try {
      setCarregando(true);
      const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password: senha }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erro ao realizar login.");
      if (data.accessToken) {
        await setToken(data.accessToken);
        router.replace("/(protected)/(tabs)/home");
      } else {
        throw new Error("Token não recebido do servidor.");
      }
    } catch (error: any) {
      Alert.alert("Falha no Login", error.message || "Não foi possível conectar ao servidor.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-950 md:bg-slate-50/80 flex-row justify-center items-center">
      {/* Container Principal Híbrido (Desktop / Mobile) */}
      <View className="w-full h-full md:h-[600px] max-w-4xl bg-white md:rounded-3xl shadow-2xl flex-row overflow-hidden">
        
        {/* BANNER ESQUERDO: Só aparece em telas grandes (Computador) */}
        <View className="hidden md:flex flex-1 bg-blue-950 p-12 justify-between relative">
          <View className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-transparent to-black/50" />
          
          <View className="z-10 gap-1">
            <Text className="text-blue-400 font-black tracking-widest text-xs uppercase">Plataforma Operacional</Text>
            <Text className="text-white text-4xl font-black tracking-tight mt-1">CTR-PE</Text>
          </View>

          <View className="z-10 gap-2">
            <Text className="text-white text-lg font-bold">Controle Total de Manutenção</Text>
            <Text className="text-blue-200/70 text-sm leading-relaxed">
              Gerencie ordens de serviço, monitore a saúde dos ativos e minimize o tempo de máquina parada em uma única interface técnica robusta.
            </Text>
          </View>

          <Text className="z-10 text-xs text-blue-300/40 font-mono">v2.0.26 // Unidade Recife</Text>
        </View>

        {/* COLUNA DIREITA: O Formulário que se adapta e justifica no Smartphone */}
        <View className="w-full md:w-[420px] bg-white justify-center px-6 md:px-10 py-8">
          <View className="w-full min-h-[440px] flex-col justify-between">
            
            <View className="gap-6">
              <View className="gap-1 md:items-start items-center">
                <Text className="text-2xl font-black tracking-tight text-slate-800">Acessar Sistema</Text>
                <Text className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Insira suas credenciais técnicas</Text>
              </View>

              <View className="gap-4">
                <View className="gap-1.5">
                  <Text className="text-xs font-bold text-slate-500 uppercase tracking-wider">E-mail</Text>
                  <TextInput 
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-800 focus:border-blue-900"
                    placeholder="seuemail@empresa.com"
                    placeholderTextColor="#94a3b8"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                    editable={!carregando}
                  />
                </View>

                <View className="gap-1.5">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-xs font-bold text-slate-500 uppercase tracking-wider">Senha</Text>
                    <Pressable onPress={() => router.push("/forgot-password")}>
                      <Text className="text-xs text-blue-900 font-semibold hover:underline">Esqueceu?</Text>
                    </Pressable>
                  </View>
                  <TextInput 
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-800 focus:border-blue-900"
                    secureTextEntry
                    placeholder="Digite sua senha"
                    placeholderTextColor="#94a3b8"
                    value={senha}
                    onChangeText={setSenha}
                    editable={!carregando}
                  />
                </View>
              </View>
            </View>

            <View className="gap-3 mt-6">
              <Button className="w-full bg-blue-900 active:bg-blue-950 h-12 rounded-xl shadow-md shadow-blue-900/10" onPress={handleLogin} disabled={carregando}>
                {carregando ? <ActivityIndicator color="#ffffff" size="small" /> : <Text className="text-white font-bold text-sm tracking-wide">Entrar no Sistema</Text>}
              </Button>

              <View className="flex-row justify-center gap-1">
                <Text className="text-xs font-medium text-slate-500">Não tem uma conta?</Text>
                <Pressable onPress={() => router.push("/signup")}>
                  <Text className="text-xs text-blue-900 font-bold underline">Criar conta</Text>
                </Pressable>
              </View>
            </View>

          </View>
        </View>

      </View>
    </SafeAreaView>
  );
}