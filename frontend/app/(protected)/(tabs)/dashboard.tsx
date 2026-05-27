import { ScrollView, View } from "react-native";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";

const indicadores = [
  { label: "Ativos totais", value: "128" },
  { label: "Maquinas paradas", value: "12" },
  { label: "O.S. abertas", value: "18" },
  { label: "O.S. aguardando peca", value: "5" },
];

const alertasRecentes = [
  {
    title: "Ativo parado ha 3h",
    subtitle: "Escavadeira MAQ-014",
    severity: "Alta",
  },
  {
    title: "Estoque abaixo do minimo",
    subtitle: "Rolamento 6205",
    severity: "Media",
  },
  {
    title: "O.S. atrasada",
    subtitle: "OS-0042",
    severity: "Critica",
  },
];

const ordensCriticas = [
  {
    numero: "OS-0042",
    titulo: "Falha no sistema hidraulico",
    prioridade: "Critica",
  },
  {
    numero: "OS-0048",
    titulo: "Motor com superaquecimento",
    prioridade: "Alta",
  },
  {
    numero: "OS-0051",
    titulo: "Troca emergencial de componente",
    prioridade: "Alta",
  },
];

export default function DashboardScreen() {
  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="gap-4 pb-6">
      <View className="flex-row flex-wrap gap-3">
        {indicadores.map((item) => (
          <Card key={item.label} className="min-w-[47%] flex-1 border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {item.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Text className="text-3xl font-semibold text-foreground">{item.value}</Text>
            </CardContent>
          </Card>
        ))}
      </View>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base text-foreground">Alertas recentes</CardTitle>
        </CardHeader>
        <CardContent className="gap-3">
          {alertasRecentes.map((alerta) => (
            <View
              key={`${alerta.title}-${alerta.subtitle}`}
              className="rounded-md border border-border bg-background px-3 py-3"
            >
              <View className="mb-1 flex-row items-center justify-between gap-3">
                <Text className="flex-1 font-medium text-foreground">{alerta.title}</Text>
                <Badge variant="secondary">
                  <Text>{alerta.severity}</Text>
                </Badge>
              </View>
              <Text className="text-sm text-muted-foreground">{alerta.subtitle}</Text>
            </View>
          ))}
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base text-foreground">O.S. criticas</CardTitle>
        </CardHeader>
        <CardContent className="gap-3">
          {ordensCriticas.map((ordem) => (
            <View
              key={ordem.numero}
              className="rounded-md border border-border bg-background px-3 py-3"
            >
              <View className="mb-1 flex-row items-center justify-between gap-3">
                <Text className="font-medium text-foreground">{ordem.numero}</Text>
                <Badge>
                  <Text>{ordem.prioridade}</Text>
                </Badge>
              </View>
              <Text className="text-sm text-muted-foreground">{ordem.titulo}</Text>
            </View>
          ))}
        </CardContent>
      </Card>
    </ScrollView>
  );
}
