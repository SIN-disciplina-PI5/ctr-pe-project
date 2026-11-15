import { useMemo } from "react";
import { ScrollView, View } from "react-native";

import { Text } from "@/components/ui/text";
import type {
  GeneratedReport,
  QueryResultBlock,
  QueryRow,
} from "@/features/assistente/assistente.types";
import { formatCell } from "@/features/assistente/assistente.utils";

export function DataTable({
  id,
  rows,
  columns: configuredColumns,
}: {
  id: string;
  rows: QueryRow[];
  columns?: string[];
}) {
  const columns = useMemo(
    () =>
      configuredColumns?.length
        ? configuredColumns
        : Array.from(new Set(rows.flatMap((row) => Object.keys(row)))),
    [configuredColumns, rows],
  );

  if (rows.length === 0) return null;

  return (
    <ScrollView horizontal className="rounded-md border border-border">
      <View>
        <View className="flex-row bg-muted">
          {columns.map((column) => (
            <View
              key={column}
              className="min-w-32 border-r border-border px-3 py-2"
            >
              <Text className="text-xs font-semibold text-foreground">
                {column}
              </Text>
            </View>
          ))}
        </View>
        {rows.map((row, rowIndex) => (
          <View
            key={`${id}-${rowIndex}`}
            className="flex-row border-t border-border"
          >
            {columns.map((column) => (
              <View
                key={column}
                className="min-w-32 border-r border-border px-3 py-2"
              >
                <Text className="text-xs text-foreground">
                  {formatCell(row[column])}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

export function QueryTable({ block }: { block: QueryResultBlock }) {
  return (
    <View className="gap-2">
      {block.purpose ? (
        <Text className="text-xs font-medium text-muted-foreground">
          {block.purpose}
        </Text>
      ) : null}
      <DataTable id={block.id} rows={block.rowsUsed} />
    </View>
  );
}

export function GeneratedReportView({ report }: { report: GeneratedReport }) {
  return (
    <View className="gap-3 rounded-lg border border-border bg-background px-3 py-3">
      <Text className="font-semibold text-foreground">{report.title}</Text>
      {report.sections.map((section) => (
        <View key={section.id} className="gap-2">
          <Text className="text-sm font-semibold text-foreground">
            {section.title}
          </Text>
          <Text className="text-sm leading-5 text-muted-foreground">
            {section.narrative}
          </Text>
          {section.table ? (
            <DataTable
              id={`report-${section.id}`}
              rows={section.table.rows}
              columns={section.table.columns}
            />
          ) : null}
          {section.chart?.series.map((series) => (
            <View key={series.name} className="gap-1">
              <Text className="text-xs font-semibold text-muted-foreground">
                {series.name}
              </Text>
              {series.data.map((point) => (
                <View
                  key={`${series.name}-${point.label}`}
                  className="flex-row justify-between gap-4"
                >
                  <Text className="text-xs text-foreground">{point.label}</Text>
                  <Text className="text-xs font-medium text-foreground">
                    {formatCell(point.value)}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}
