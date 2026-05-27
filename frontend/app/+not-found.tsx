import { Link } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";

export default function NotFoundScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-6">
        <View className="w-full max-w-sm">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-center text-2xl text-foreground">
                404
              </CardTitle>
            </CardHeader>
            <CardContent className="items-center gap-4">
              <Text className="text-center text-muted-foreground">
                Pagina nao encontrada
              </Text>

              <Link href="/(auth)/login" asChild>
                <Button className="w-full">
                  <Text>Voltar</Text>
                </Button>
              </Link>
            </CardContent>
          </Card>
        </View>
      </View>
    </SafeAreaView>
  );
}
