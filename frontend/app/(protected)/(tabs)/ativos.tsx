import React from "react";
import { View, ScrollView } from "react-native";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Text } from "@/components/ui/text";

export default function AtivosScreen() {
  const ativos = [
    { tag: "CHILLER-01", nome: "Sistema de Refrigeração Central", status: "Operando", statusColor: "text-emerald-600 bg-emerald-50 border-emerald-200" },
    { tag: "COMP-03", nome: "Compressor de Ar Comprimido 10Bar", status: "Em Manutenção", statusColor: "text-amber-600 bg-amber-50 border-amber-200" },
    { tag: "SUBST-02", nome: "Transformador de Cabine Primária", status: "Operando", statusColor: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  ];

  return (
    <ScrollView className="flex-1 bg-slate-50/80" contentContainerStyle={{ padding: 24 }}>
      <View className="mb-6 mt-4 bg-emerald-800 p-6 rounded-2xl shadow-md">
        <Text className="text-2xl font-bold text-white">Controle de Ativos</Text>
        <Text className="text-sm text-emerald-100 mt-1">Cadastro e acompanhamento de integridade do maquinário.</Text>
      </View>

      <View className="gap-3">
        {ativos.map((ativo, index) => (
          <Card key={index} className="border border-slate-200 bg-white rounded-xl shadow-sm p-4 flex-row justify-between items-center">
            <View>
              <Text className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">{ativo.tag}</Text>
              <CardTitle className="text-sm font-bold text-slate-800 mt-0.5">{ativo.nome}</CardTitle>
            </View>
            <View className={`border px-3 py-1 rounded-md ${ativo.statusColor}`}>
              <Text className="text-[10px] font-bold">{ativo.status}</Text>
            </View>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}