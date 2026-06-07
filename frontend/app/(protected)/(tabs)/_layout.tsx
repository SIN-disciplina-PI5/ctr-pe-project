import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs 
      screenOptions={{
        tabBarPosition: "top",

        headerShown: false, 
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{ title: "Dashboard" }}
      />
      <Tabs.Screen
        name="home"
        options={{ title: "Home" }}
      />
      <Tabs.Screen
        name="ordens-servico"
        options={{ title: "Ordens de Servico" }}
      />
      <Tabs.Screen
        name="ativos"
        options={{ title: "Ativos" }}
      />
      <Tabs.Screen
        name="paradas"
        options={{ title: "Paradas" }}
      />
      <Tabs.Screen
        name="alertas"
        options={{ title: "Alertas" }}
      />
      <Tabs.Screen
        name="perfil"
        options={{ title: "Perfil" }}
      />
    </Tabs>
  );
}