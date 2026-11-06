import { View } from "react-native";

// Blocos cinza que imitam a tela enquanto os dados carregam.
export function ChartSkeleton() {
  return (
    <View className="mx-auto w-full max-w-5xl gap-4 px-4 py-6">
      <View className="h-7 w-40 rounded-md bg-muted" />
      <View className="h-4 w-64 rounded-md bg-muted" />
      <View className="flex-row gap-3">
        <View className="h-24 flex-1 rounded-xl bg-muted" />
        <View className="h-24 flex-1 rounded-xl bg-muted" />
      </View>
      <View className="h-64 w-full rounded-xl bg-muted" />
      <View className="h-64 w-full rounded-xl bg-muted" />
    </View>
  );
}