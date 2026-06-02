import React from "react";
import { View, ScrollView } from "react-native";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Text } from "@/components/ui/text";

export default function OrdensServicoScreen() {
  const ordens = [
    { id: "OS-2026-001", titulo: "Manutenção Preventiva - Gerador A", local: "Setor Técnico - Bloco B", tipo: "Preventiva", badgeClass: "bg-blue-100 text-blue-700 border-blue-200" },
    { id: "OS-2026-004", titulo: "Vazamento Crítico Hidráulica", local: "Almoxarifado Geral", tipo: "Corretiva", badgeClass: "bg-rose-100 text-rose-700 border-rose-200" },
    { id: "OS-2026-009", titulo: "Calibração de Sensores de Pressão", local: "Linha de Produção 02", tipo: "Preditiva", badgeClass: "bg-purple-100 text-purple-700 border-purple-200" },
  ];

  return (
    <ScrollView className="flex-1 bg-slate-50/80" contentContainerStyle={{ padding: 24 }}>
      <View className="mb-6 mt-4 bg-amber-600 p-6 rounded-2xl shadow-md">
        <Text className="text-2xl font-bold text-white">Ordens de Serviço</Text>
        <Text className="text-sm text-amber-50 mt-1">Gerencie chamados técnicos e atividades em execução.</Text>
      </View>

      <View className="gap-3">
        {ordens.map((os, index) => (
          <Card key={index} className="border border-slate-200/80 bg-white rounded-xl shadow-sm p-4 flex-row justify-between items-center">
            <View className="flex-1 pr-3">
              <Text className="text-[10px] font-bold text-amber-600 tracking-wider uppercase">{os.id}</Text>
              <CardTitle className="text-sm font-bold text-slate-800 mt-0.5">{os.titulo}</CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-1">{os.local}</CardDescription>
            </View>
            <View className={`border px-2.5 py-1 rounded-full ${os.badgeClass}`}>
              <Text className="text-[10px] font-bold uppercase">{os.tipo}</Text>
            </View>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}