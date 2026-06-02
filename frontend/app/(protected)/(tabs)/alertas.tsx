import React from "react";
import { View, ScrollView } from "react-native";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Text } from "@/components/ui/text";

export default function AlertasScreen() {
  const alertas = [
    { data: "Hoje às 14:22", msg: "Temperatura elevada detectada no Motor Principal do Chiller-01.", gravidade: "Crítico", lineClass: "bg-rose-500" },
    { data: "Ontem às 08:05", msg: "Troca de filtros pendente na Unidade de Tratamento de Ar.", gravidade: "Aviso", lineClass: "bg-amber-500" },
  ];

  return (
    <ScrollView className="flex-1 bg-slate-50/80" contentContainerStyle={{ padding: 24 }}>
      <View className="mb-6 mt-4 bg-rose-700 p-6 rounded-2xl shadow-md">
        <Text className="text-2xl font-bold text-white">Alertas do Sistema</Text>
        <Text className="text-sm text-rose-100 mt-1">Ocorrências críticas e preventivas que demandam atenção.</Text>
      </View>

      <View className="gap-4">
        {alertas.map((alerta, index) => (
          <Card key={index} className="border border-slate-200 bg-white rounded-xl shadow-sm flex-row overflow-hidden">
            <View className={`w-1.5 ${alerta.lineClass}`} />
            <CardHeader className="p-4 flex-1">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-[10px] font-bold text-slate-400 uppercase">{alerta.data}</Text>
                <Text className={`text-[10px] font-extrabold uppercase ${alerta.gravidade === 'Crítico' ? 'text-rose-600' : 'text-amber-600'}`}>{alerta.gravidade}</Text>
              </View>
              <Text className="text-xs text-slate-700 font-medium leading-relaxed mt-1">{alerta.msg}</Text>
            </CardHeader>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}