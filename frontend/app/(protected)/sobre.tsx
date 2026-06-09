import { useRouter } from "expo-router";
import { ScrollView, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";

const integrantes = [
  { nome: "Andre Luis Gomes da Silva Filho", ra: "00000855160" },
  { nome: "Arthur Azevedo Costa de Paula", ra: "00000016457" },
  { nome: "Dayvson da Conceicao de Moura", ra: "00000855171" },
  { nome: "Hallason Matias da Silva", ra: "00000855277" },
  { nome: "Jose Heitor Felix Guimaraes", ra: "00000855161" },
  { nome: "Vinicius de Almeida Silva", ra: "00000855166" },
];

export default function SobreScreen() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="gap-4 px-4 py-6">
        <View>
          <Text className="text-2xl font-bold text-foreground">Sobre</Text>
          <Text className="text-sm text-muted-foreground">
            Informacoes do projeto e da equipe.
          </Text>
        </View>

        <Card>
          <CardHeader>
            <CardTitle>CTR-PE</CardTitle>
          </CardHeader>
          <CardContent className="gap-3">
            <Text className="text-sm leading-6 text-muted-foreground">
              O CTR-PE é uma plataforma de controle de manutenção desenvolvida
              para gerenciar ativos, empresas, localizações, ordens de serviço,
              paradas, materiais, estoque, alertas e indicadores operacionais.
              O sistema integra um backend em Express com PostgreSQL e um
              frontend mobile/web em Expo, permitindo acompanhar a operação de
              manutenção de forma centralizada.
            </Text>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Equipe</CardTitle>
          </CardHeader>
          <CardContent className="gap-3">
            {integrantes.map((integrante) => (
              <View
                key={integrante.ra}
                className="rounded-md border border-border bg-background px-3 py-3"
              >
                <Text className="font-medium text-foreground">
                  {integrante.nome}
                </Text>
                <Text className="text-sm text-muted-foreground">
                  RA: {integrante.ra}
                </Text>
              </View>
            ))}
          </CardContent>
        </Card>

        <Button variant="outline" onPress={() => router.back()}>
          <Text>Voltar</Text>
        </Button>
      </View>
    </ScrollView>
  );
}