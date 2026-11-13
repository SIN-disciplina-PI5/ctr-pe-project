import { Pressable, View } from "react-native";

import { Text } from "@/components/ui/text";
import { useToastStore } from "@/store/toast-store";

export function ToastHost() {
  const toasts = useToastStore((state) => state.toasts);
  const dismiss = useToastStore((state) => state.dismiss);

  if (toasts.length === 0) return null;

  return (
    <View
      className="pointer-events-none absolute bottom-6 left-0 right-0 items-center gap-2 px-4"
      style={{ zIndex: 50 }}
    >
      {toasts.map((toast) => (
        <Pressable
          key={toast.id}
          onPress={() => dismiss(toast.id)}
          className="pointer-events-auto w-full max-w-md flex-row items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-lg"
        >
          <View
            className={
              toast.variant === "success"
                ? "mt-1.5 h-2.5 w-2.5 rounded-full bg-emerald-500"
                : "mt-1.5 h-2.5 w-2.5 rounded-full bg-destructive"
            }
          />
          <View className="flex-1">
            <Text className="font-semibold">{toast.title}</Text>
            {toast.message ? (
              <Text className="text-sm text-muted-foreground">{toast.message}</Text>
            ) : null}
          </View>
        </Pressable>
      ))}
    </View>
  );
}
