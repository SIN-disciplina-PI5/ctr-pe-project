import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { type TextInputProps, View } from "react-native";

import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  multiline?: boolean;
  autoCapitalize?: TextInputProps["autoCapitalize"];
  error?: string;
};

export function ControlledInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  multiline,
  autoCapitalize,
  error,
}: Props<T>) {
  return (
    <View className="gap-2">
      <Text variant="small">{label}</Text>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Input
            placeholder={placeholder}
            multiline={multiline}
            autoCapitalize={autoCapitalize}
            className={multiline ? "h-20" : undefined}
            value={(field.value as string) ?? ""}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
          />
        )}
      />
      {error ? (
        <Text variant="small" className="text-destructive">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
