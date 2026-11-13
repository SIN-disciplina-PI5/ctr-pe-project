import {
  PDFDocument,
  StandardFonts,
  rgb,
  type PDFFont,
  type PDFPage,
} from "pdf-lib";
import type {
  GeneratedReport,
  ReportChart,
  ReportTable,
} from "./report-agent.service.js";

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const PAGE_MARGIN = 42;
const CONTENT_WIDTH = PAGE_WIDTH - PAGE_MARGIN * 2;
const BOTTOM_MARGIN = 42;
const BODY_FONT_SIZE = 10;
const BODY_LINE_HEIGHT = 14;
const TABLE_PADDING = 4;
const TABLE_MAX_LINES_PER_CELL = 4;
const CHART_HEIGHT = 220;
const CHART_MAX_POINTS = 12;

const COLORS = {
  primary: rgb(0.12, 0.16, 0.32),
  secondary: rgb(0.31, 0.28, 0.71),
  text: rgb(0.14, 0.16, 0.2),
  muted: rgb(0.38, 0.4, 0.45),
  border: rgb(0.8, 0.81, 0.84),
  tableHeader: rgb(0.91, 0.91, 0.98),
  tableAlternate: rgb(0.97, 0.97, 0.99),
  chartPalette: [
    rgb(0.31, 0.28, 0.71),
    rgb(0.06, 0.58, 0.53),
    rgb(0.91, 0.45, 0.13),
    rgb(0.76, 0.18, 0.35),
  ],
} as const;

export interface ReportRendererInput {
  readonly report: GeneratedReport;
  readonly companyName: string;
  readonly generatedAt: Date;
}

export interface RenderedReportFile {
  readonly bytes: Uint8Array;
  readonly contentType: "application/pdf";
  readonly filename: string;
}

export interface ReportRenderer {
  render(input: ReportRendererInput): Promise<RenderedReportFile>;
}

interface RenderContext {
  readonly document: PDFDocument;
  readonly regularFont: PDFFont;
  readonly boldFont: PDFFont;
  page: PDFPage;
  y: number;
}

interface PreparedCell {
  readonly lines: readonly string[];
}

function formatDate(date: Date): string {
  if (Number.isNaN(date.getTime())) return "Data não informada";

  return `${new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(date)} UTC`;
}

function filenameFor(title: string, generatedAt: Date): string {
  const normalizedTitle = title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  const date = Number.isNaN(generatedAt.getTime())
    ? "sem-data"
    : generatedAt.toISOString().slice(0, 10);

  return `${normalizedTitle || "relatorio"}-${date}.pdf`;
}

function formatCell(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "number") {
    return Number.isFinite(value)
      ? new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 }).format(
          value,
        )
      : "—";
  }
  if (typeof value === "boolean") return value ? "Sim" : "Não";
  if (typeof value === "object") return JSON.stringify(value) ?? String(value);
  return String(value);
}

function textSupportedByFont(text: string, font: PDFFont): string {
  let supported = "";

  for (const character of text.normalize("NFC")) {
    try {
      font.encodeText(character);
      supported += character;
    } catch {
      supported += "?";
    }
  }

  return supported;
}

function textWidth(text: string, font: PDFFont, size: number): number {
  return font.widthOfTextAtSize(text, size);
}

function breakLongWord(
  word: string,
  font: PDFFont,
  size: number,
  maxWidth: number,
): string[] {
  const parts: string[] = [];
  let current = "";

  for (const character of word) {
    const candidate = `${current}${character}`;
    if (current && textWidth(candidate, font, size) > maxWidth) {
      parts.push(current);
      current = character;
    } else {
      current = candidate;
    }
  }

  if (current) parts.push(current);
  return parts.length > 0 ? parts : [""];
}

function wrapText(
  value: string,
  font: PDFFont,
  size: number,
  maxWidth: number,
): string[] {
  const supported = textSupportedByFont(value, font);
  const paragraphs = supported.split(/\r?\n/);
  const lines: string[] = [];

  for (const paragraph of paragraphs) {
    if (!paragraph.trim()) {
      lines.push("");
      continue;
    }

    const words = paragraph.trim().split(/\s+/).flatMap((word) =>
      textWidth(word, font, size) > maxWidth
        ? breakLongWord(word, font, size, maxWidth)
        : [word],
    );
    let current = "";

    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word;
      if (current && textWidth(candidate, font, size) > maxWidth) {
        lines.push(current);
        current = word;
      } else {
        current = candidate;
      }
    }

    if (current) lines.push(current);
  }

  return lines.length > 0 ? lines : [""];
}

function limitLines(
  lines: readonly string[],
  font: PDFFont,
  size: number,
  maxWidth: number,
  maxLines: number,
): string[] {
  if (lines.length <= maxLines) return [...lines];

  const limited = lines.slice(0, maxLines);
  let last = limited[maxLines - 1] ?? "";
  while (last && textWidth(`${last}...`, font, size) > maxWidth) {
    last = last.slice(0, -1);
  }
  limited[maxLines - 1] = `${last}...`;
  return limited;
}

function addPage(context: RenderContext): void {
  context.page = context.document.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  context.y = PAGE_HEIGHT - PAGE_MARGIN;
}

function ensureSpace(context: RenderContext, requiredHeight: number): void {
  if (context.y - requiredHeight < BOTTOM_MARGIN) addPage(context);
}

function drawWrappedText(
  context: RenderContext,
  text: string,
  options: {
    readonly font?: PDFFont;
    readonly size?: number;
    readonly lineHeight?: number;
    readonly color?: ReturnType<typeof rgb>;
    readonly spacingAfter?: number;
  } = {},
): void {
  const font = options.font ?? context.regularFont;
  const size = options.size ?? BODY_FONT_SIZE;
  const lineHeight = options.lineHeight ?? BODY_LINE_HEIGHT;
  const color = options.color ?? COLORS.text;
  const lines = wrapText(text, font, size, CONTENT_WIDTH);

  for (const line of lines) {
    ensureSpace(context, lineHeight);
    if (line) {
      context.page.drawText(line, {
        x: PAGE_MARGIN,
        y: context.y - size,
        size,
        font,
        color,
      });
    }
    context.y -= lineHeight;
  }

  context.y -= options.spacingAfter ?? 0;
}

function prepareCell(
  value: unknown,
  font: PDFFont,
  size: number,
  width: number,
  maxLines = TABLE_MAX_LINES_PER_CELL,
): PreparedCell {
  const lines = wrapText(
    formatCell(value),
    font,
    size,
    width - TABLE_PADDING * 2,
  );
  return {
    lines: limitLines(
      lines,
      font,
      size,
      width - TABLE_PADDING * 2,
      maxLines,
    ),
  };
}

function drawTableRow(
  context: RenderContext,
  cells: readonly PreparedCell[],
  options: {
    readonly columnWidth: number;
    readonly rowHeight: number;
    readonly font: PDFFont;
    readonly fontSize: number;
    readonly fillColor?: ReturnType<typeof rgb>;
  },
): void {
  const top = context.y;

  for (const [index, cell] of cells.entries()) {
    const x = PAGE_MARGIN + index * options.columnWidth;
    context.page.drawRectangle({
      x,
      y: top - options.rowHeight,
      width: options.columnWidth,
      height: options.rowHeight,
      borderColor: COLORS.border,
      borderWidth: 0.5,
      ...(options.fillColor === undefined
        ? {}
        : { color: options.fillColor }),
    });

    for (const [lineIndex, line] of cell.lines.entries()) {
      context.page.drawText(line, {
        x: x + TABLE_PADDING,
        y:
          top -
          TABLE_PADDING -
          options.fontSize -
          lineIndex * (options.fontSize + 2),
        size: options.fontSize,
        font: options.font,
        color: COLORS.text,
      });
    }
  }

  context.y -= options.rowHeight;
}

function drawTable(context: RenderContext, table: ReportTable): void {
  if (table.columns.length === 0 || table.rows.length === 0) return;

  const columnWidth = CONTENT_WIDTH / table.columns.length;
  const fontSize = Math.max(5, Math.min(8, columnWidth / 8));
  const lineHeight = fontSize + 2;
  const headerCells = table.columns.map((column) =>
    prepareCell(column, context.boldFont, fontSize, columnWidth, 2),
  );
  const headerHeight =
    Math.max(...headerCells.map((cell) => cell.lines.length)) * lineHeight +
    TABLE_PADDING * 2;

  const drawHeader = () => {
    ensureSpace(context, headerHeight);
    drawTableRow(context, headerCells, {
      columnWidth,
      rowHeight: headerHeight,
      font: context.boldFont,
      fontSize,
      fillColor: COLORS.tableHeader,
    });
  };

  drawHeader();
  for (const [rowIndex, row] of table.rows.entries()) {
    const cells = table.columns.map((column) =>
      prepareCell(row[column], context.regularFont, fontSize, columnWidth),
    );
    const rowHeight =
      Math.max(...cells.map((cell) => cell.lines.length)) * lineHeight +
      TABLE_PADDING * 2;

    if (context.y - rowHeight < BOTTOM_MARGIN) {
      addPage(context);
      drawHeader();
    }

    drawTableRow(context, cells, {
      columnWidth,
      rowHeight,
      font: context.regularFont,
      fontSize,
      ...(rowIndex % 2 === 1 ? { fillColor: COLORS.tableAlternate } : {}),
    });
  }

  context.y -= 12;
}

function chartLabels(chart: ReportChart): {
  readonly labels: readonly string[];
  readonly sampled: boolean;
} {
  const allLabels = [
    ...new Set(
      chart.series.flatMap((series) =>
        series.data.map((point) => point.label),
      ),
    ),
  ];
  if (allLabels.length <= CHART_MAX_POINTS) {
    return { labels: allLabels, sampled: false };
  }

  const sampledIndexes = new Set<number>();
  for (let index = 0; index < CHART_MAX_POINTS; index += 1) {
    sampledIndexes.add(
      Math.round((index * (allLabels.length - 1)) / (CHART_MAX_POINTS - 1)),
    );
  }

  return {
    labels: [...sampledIndexes].map((index) => allLabels[index]!),
    sampled: true,
  };
}

function truncateText(
  value: string,
  font: PDFFont,
  size: number,
  maxWidth: number,
): string {
  const supported = textSupportedByFont(value, font);
  if (textWidth(supported, font, size) <= maxWidth) return supported;

  let truncated = supported;
  while (
    truncated &&
    textWidth(`${truncated}...`, font, size) > maxWidth
  ) {
    truncated = truncated.slice(0, -1);
  }
  return `${truncated}...`;
}

function chartColor(index: number) {
  return COLORS.chartPalette[index % COLORS.chartPalette.length]!;
}

function chartValueAt(
  chart: ReportChart,
  seriesIndex: number,
  label: string,
): number | null {
  return (
    chart.series[seriesIndex]?.data.find((point) => point.label === label)
      ?.value ?? null
  );
}

function drawChartLegend(
  context: RenderContext,
  chart: ReportChart,
  top: number,
): void {
  let x = PAGE_MARGIN + 45;
  const maxX = PAGE_WIDTH - PAGE_MARGIN;

  for (const [index, series] of chart.series.entries()) {
    const name = truncateText(
      series.name,
      context.regularFont,
      7,
      Math.max(30, maxX - x - 18),
    );
    const itemWidth = 14 + textWidth(name, context.regularFont, 7) + 12;
    if (x + itemWidth > maxX) break;

    context.page.drawRectangle({
      x,
      y: top - 7,
      width: 8,
      height: 8,
      color: chartColor(index),
    });
    context.page.drawText(name, {
      x: x + 12,
      y: top - 7,
      size: 7,
      font: context.regularFont,
      color: COLORS.text,
    });
    x += itemWidth;
  }
}

function drawChart(context: RenderContext, chart: ReportChart): void {
  const { labels, sampled } = chartLabels(chart);
  const values = chart.series.flatMap((_, seriesIndex) =>
    labels.flatMap((label) => {
      const value = chartValueAt(chart, seriesIndex, label);
      return value === null || !Number.isFinite(value) ? [] : [value];
    }),
  );
  if (labels.length === 0 || values.length === 0) return;

  ensureSpace(context, CHART_HEIGHT + 18);
  const top = context.y;
  const plotLeft = PAGE_MARGIN + 45;
  const plotRight = PAGE_WIDTH - PAGE_MARGIN - 6;
  const plotTop = top - 24;
  const plotBottom = top - CHART_HEIGHT + 38;
  const plotWidth = plotRight - plotLeft;
  const plotHeight = plotTop - plotBottom;
  const minimum = Math.min(0, ...values);
  const maximum = Math.max(0, ...values);
  const range = maximum - minimum || 1;
  const yFor = (value: number) =>
    plotBottom + ((value - minimum) / range) * plotHeight;
  const zeroY = yFor(0);

  drawChartLegend(context, chart, top - 2);

  for (let index = 0; index <= 4; index += 1) {
    const value = minimum + (range * index) / 4;
    const y = yFor(value);
    context.page.drawLine({
      start: { x: plotLeft, y },
      end: { x: plotRight, y },
      thickness: index === 0 ? 0.8 : 0.35,
      color: index === 0 ? COLORS.border : COLORS.tableHeader,
    });
    const label = formatCell(value);
    context.page.drawText(label, {
      x: plotLeft - textWidth(label, context.regularFont, 7) - 5,
      y: y - 2,
      size: 7,
      font: context.regularFont,
      color: COLORS.muted,
    });
  }

  context.page.drawLine({
    start: { x: plotLeft, y: plotBottom },
    end: { x: plotLeft, y: plotTop },
    thickness: 0.8,
    color: COLORS.border,
  });
  context.page.drawLine({
    start: { x: plotLeft, y: zeroY },
    end: { x: plotRight, y: zeroY },
    thickness: 0.8,
    color: COLORS.muted,
  });

  const groupWidth = plotWidth / labels.length;
  if (chart.type === "bar") {
    const barWidth = Math.max(
      2,
      Math.min(22, (groupWidth * 0.72) / chart.series.length),
    );

    for (const [labelIndex, label] of labels.entries()) {
      const groupStart = plotLeft + labelIndex * groupWidth;
      const barsWidth = barWidth * chart.series.length;
      const firstBarX = groupStart + (groupWidth - barsWidth) / 2;

      for (const [seriesIndex] of chart.series.entries()) {
        const value = chartValueAt(chart, seriesIndex, label);
        if (value === null || !Number.isFinite(value)) continue;
        const valueY = yFor(value);
        context.page.drawRectangle({
          x: firstBarX + seriesIndex * barWidth,
          y: Math.min(zeroY, valueY),
          width: Math.max(1, barWidth - 1),
          height: Math.max(0.7, Math.abs(valueY - zeroY)),
          color: chartColor(seriesIndex),
        });
      }
    }
  } else {
    for (const [seriesIndex] of chart.series.entries()) {
      let previous: { x: number; y: number } | null = null;

      for (const [labelIndex, label] of labels.entries()) {
        const value = chartValueAt(chart, seriesIndex, label);
        if (value === null || !Number.isFinite(value)) {
          previous = null;
          continue;
        }
        const point = {
          x: plotLeft + labelIndex * groupWidth + groupWidth / 2,
          y: yFor(value),
        };
        if (previous) {
          context.page.drawLine({
            start: previous,
            end: point,
            thickness: 1.5,
            color: chartColor(seriesIndex),
          });
        }
        context.page.drawCircle({
          x: point.x,
          y: point.y,
          size: 2.5,
          color: chartColor(seriesIndex),
        });
        previous = point;
      }
    }
  }

  for (const [index, label] of labels.entries()) {
    const maxLabelWidth = Math.max(12, groupWidth - 3);
    const displayed = truncateText(
      label,
      context.regularFont,
      6,
      maxLabelWidth,
    );
    const center = plotLeft + index * groupWidth + groupWidth / 2;
    context.page.drawText(displayed, {
      x: center - textWidth(displayed, context.regularFont, 6) / 2,
      y: plotBottom - 11,
      size: 6,
      font: context.regularFont,
      color: COLORS.muted,
    });
  }

  if (sampled) {
    const note = `Visualização com ${labels.length} de todos os pontos; a tabela mantém os dados completos.`;
    context.page.drawText(textSupportedByFont(note, context.regularFont), {
      x: plotLeft,
      y: plotBottom - 25,
      size: 7,
      font: context.regularFont,
      color: COLORS.muted,
    });
  }

  context.y = top - CHART_HEIGHT - 12;
}

export class PdfReportRenderer implements ReportRenderer {
  async render(input: ReportRendererInput): Promise<RenderedReportFile> {
    const document = await PDFDocument.create();
    const regularFont = await document.embedFont(StandardFonts.Helvetica);
    const boldFont = await document.embedFont(StandardFonts.HelveticaBold);
    const title = input.report.title.trim() || "Relatório";
    const companyName = input.companyName.trim() || "Empresa não informada";

    document.setTitle(title);
    document.setAuthor("CTR-PE");
    document.setSubject("Relatório de manutenção e gestão de ativos");
    document.setCreator("CTR-PE");
    document.setProducer("CTR-PE");
    if (!Number.isNaN(input.generatedAt.getTime())) {
      document.setCreationDate(input.generatedAt);
      document.setModificationDate(input.generatedAt);
    }

    const firstPage = document.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    const context: RenderContext = {
      document,
      regularFont,
      boldFont,
      page: firstPage,
      y: PAGE_HEIGHT - PAGE_MARGIN,
    };

    drawWrappedText(context, "CTR-PE", {
      font: boldFont,
      size: 12,
      lineHeight: 16,
      color: COLORS.secondary,
      spacingAfter: 4,
    });
    drawWrappedText(context, title, {
      font: boldFont,
      size: 20,
      lineHeight: 24,
      color: COLORS.primary,
      spacingAfter: 8,
    });
    drawWrappedText(context, `Empresa: ${companyName}`, {
      size: 9,
      lineHeight: 12,
      color: COLORS.muted,
    });
    drawWrappedText(context, `Gerado em: ${formatDate(input.generatedAt)}`, {
      size: 9,
      lineHeight: 12,
      color: COLORS.muted,
      spacingAfter: 16,
    });

    for (const section of input.report.sections) {
      ensureSpace(context, 54);
      drawWrappedText(context, section.title, {
        font: boldFont,
        size: 14,
        lineHeight: 18,
        color: COLORS.primary,
        spacingAfter: 5,
      });
      drawWrappedText(context, section.narrative, {
        spacingAfter: section.table || section.chart ? 8 : 14,
      });
      if (section.table) drawTable(context, section.table);
      if (section.chart) drawChart(context, section.chart);
    }

    const bytes = await document.save();
    return {
      bytes,
      contentType: "application/pdf",
      filename: filenameFor(title, input.generatedAt),
    };
  }
}
