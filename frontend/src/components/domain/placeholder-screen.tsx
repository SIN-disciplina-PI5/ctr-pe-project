import { View } from "react-native";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";

type PlaceholderScreenProps = {
  title: string;
  description: string;
};

export function PlaceholderScreen({
  title,
  description,
}: PlaceholderScreenProps) {
  return (
    <View className="flex-1 bg-background px-4 py-6">
      <View className="mb-4">
        <Text className="text-2xl font-bold">{title}</Text>
        <Text className="text-sm text-muted-foreground">{description}</Text>
      </View>

      <Card>
        <CardHeader>
          <CardTitle>Em construcao</CardTitle>
        </CardHeader>
        <CardContent>
          <Text className="text-muted-foreground">
            Esta tela ainda nao recebeu implementacao funcional nesta branch.
          </Text>
        </CardContent>
      </Card>
    </View>
  );
}
