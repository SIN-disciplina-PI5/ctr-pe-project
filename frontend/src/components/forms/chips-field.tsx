import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { Pressable, View } from "react-native";

import { Text } from "@/components/ui/text";

type Props<T extends FieldValues, V extends string> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  options: V[];
  labels: Record<V, string>;
};

export function ChipsField<T extends FieldValues, V extends string>({
  control,
  name,
  label,
  options,
  labels,
}: Props<T, V>) {
  return (
    <View className="gap-2">
      <Text variant="small">{label}</Text>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <View className="flex-row flex-wrap gap-2">
            {options.map((option) => {
              const selected = field.value === option;
              return (
                <Pressable
                  key={option}
                  onPress={() => field.onChange(option)}
                  className={
                    selected
                      ? "rounded-full bg-primary px-3 py-1"
                      : "rounded-full border border-border bg-background px-3 py-1"
                  }
                >
                  <Text
                    variant="small"
                    className={selected ? "text-primary-foreground" : "text-foreground"}
                  >
                    {labels[option]}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}
      />
    </View>
  );
}
