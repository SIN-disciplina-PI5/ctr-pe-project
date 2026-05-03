import { Tabs } from "expo-router";

export default function ProtectedTabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="dashboard" options={{ title: "Dashboard" }} />
      <Tabs.Screen name="ordens-servico" options={{ title: "O.S." }} />
      <Tabs.Screen name="ativos" options={{ title: "Ativos" }} />
      <Tabs.Screen name="alertas" options={{ title: "Alertas" }} />
      <Tabs.Screen name="perfil" options={{ title: "Perfil" }} />
    </Tabs>
  );
}
