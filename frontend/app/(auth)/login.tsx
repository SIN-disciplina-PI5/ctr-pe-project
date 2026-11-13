import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";

import { Logo, LogoIcon } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import {
  authService,
  type RecaptchaPlatform,
} from "@/infrastructure/auth/auth.service";
import {
  getRecaptchaToken,
  isRecaptchaConfigured,
} from "@/infrastructure/auth/recaptcha.service";
import {
  clearSession,
  setRefreshToken,
  setToken,
} from "@/infrastructure/storage/token-storage";
import { useAuthStore } from "@/store/auth-store";

function getRecaptchaPlatform(): RecaptchaPlatform {
  if (Platform.OS === "web") return "web";
  if (Platform.OS === "android") return "android";
  if (Platform.OS === "ios") return "ios";
  throw new Error("Plataforma não suportada pelo reCAPTCHA.");
}

export default function LoginScreen() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const recaptchaConfigured = isRecaptchaConfigured();

  async function handleLogin() {
    if (!email || !senha) {
      Alert.alert("Atenção", "Por favor, preencha todos os campos.");
      return;
    }

    try {
      setCarregando(true);

      const recaptchaToken = await getRecaptchaToken("login");

      const data = await authService.login({
        email: email.trim(),
        password: senha,
        ...(recaptchaToken ? { recaptchaToken } : {}),
        recaptchaPlatform: getRecaptchaPlatform(),
      });

      if (!data.accessToken || !data.refreshToken) {
        throw new Error("Sessão incompleta recebida do servidor.");
      }

      await setToken(data.accessToken);
      await setRefreshToken(data.refreshToken);

      try {
        const user = await authService.me();
        setAuth(data.accessToken, data.refreshToken, user);
      } catch (error) {
        await clearSession();
        throw error;
      }

      router.replace("/dashboard");
    } catch (error: any) {
      Alert.alert(
        "Falha no login",
        error.message || "Não foi possível conectar ao servidor.",
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-[#131316]">
      <View className="flex-1 flex-row">
        <View className="relative hidden flex-1 justify-between overflow-hidden bg-[#131316] p-14 md:flex">
          <View className="absolute inset-0">
            <Svg width="100%" height="100%">
              <Defs>
                <RadialGradient id="brilho" cx="85%" cy="95%" rx="75%" ry="65%">
                  <Stop offset="0" stopColor="#F26A21" stopOpacity="0.55" />
                  <Stop offset="0.5" stopColor="#FFB020" stopOpacity="0.12" />
                  <Stop offset="1" stopColor="#131316" stopOpacity="0" />
                </RadialGradient>
              </Defs>
              <Rect width="100%" height="100%" fill="url(#brilho)" />
            </Svg>
          </View>

          <Logo claro size={44} showName />

          <View className="gap-5">
            <Text className="max-w-[460px] text-5xl font-bold leading-[1.1] tracking-tight text-white">
              Máquina parada custa caro. Veja antes.
            </Text>
            <Text className="max-w-[420px] text-base leading-relaxed text-zinc-400">
              Ordens de serviço, ativos e estoque de peças em um só lugar, com alertas
              para agir antes da parada.
            </Text>
          </View>

          <Text className="text-xs text-zinc-500">MaqControl · Unidade Recife</Text>
        </View>

        <View className="w-full justify-center bg-background px-6 py-10 md:w-[480px] md:px-14">
          <View className="w-full max-w-[380px] gap-8 self-center">
            <View className="items-center md:hidden">
              <LogoIcon size={64} />
              <Text className="mt-2 text-xl font-bold tracking-wide text-foreground">
                MAQCONTROL
              </Text>
            </View>

            <View className="gap-1.5">
              <Text className="text-3xl font-bold tracking-tight text-foreground">
                Bem-vindo de volta
              </Text>
              <Text className="text-sm text-muted-foreground">
                Entre com seu e-mail e senha para continuar.
              </Text>
            </View>

            <View className="gap-4">
              <View className="gap-1.5">
                <Text className="text-sm font-medium text-foreground">E-mail</Text>
                <TextInput
                  className="h-12 w-full rounded-xl border border-border bg-card px-4 text-sm text-foreground focus:border-brand"
                  placeholder="seuemail@empresa.com"
                  placeholderTextColor="#A1A1AA"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  editable={!carregando}
                />
              </View>

              <View className="gap-1.5">
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm font-medium text-foreground">Senha</Text>
                  <Pressable onPress={() => router.push("/forgot-password")}>
                    <Text className="text-sm font-medium text-brand hover:underline">
                      Esqueceu a senha?
                    </Text>
                  </Pressable>
                </View>
                <TextInput
                  className="h-12 w-full rounded-xl border border-border bg-card px-4 text-sm text-foreground focus:border-brand"
                  secureTextEntry
                  placeholder="Digite sua senha"
                  placeholderTextColor="#A1A1AA"
                  value={senha}
                  onChangeText={setSenha}
                  editable={!carregando}
                />
              </View>
            </View>

            <View className="gap-4">
              {!recaptchaConfigured ? (
                <View className="rounded-xl border border-brand/40 bg-brand/10 px-3 py-2">
                  <Text className="text-xs text-foreground">
                    reCAPTCHA não configurado neste ambiente. O login continuará sem
                    validação anti-robô.
                  </Text>
                </View>
              ) : null}

              <Button
                className="h-12 w-full rounded-xl"
                onPress={handleLogin}
                disabled={carregando}
              >
                {carregando ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <Text className="text-sm font-semibold text-primary-foreground">Entrar</Text>
                )}
              </Button>

              <View className="flex-row justify-center gap-1">
                <Text className="text-sm text-muted-foreground">Não tem uma conta?</Text>
                <Pressable onPress={() => router.push("/signup")}>
                  <Text className="text-sm font-semibold text-foreground underline">
                    Criar conta
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
