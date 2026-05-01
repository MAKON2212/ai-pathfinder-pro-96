import { createServerFn } from "@tanstack/react-start";
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import type { GeneratedReport } from "@/lib/report.functions";

type PDFInput = {
  companyName: string;
  report: GeneratedReport;
};

// Brand palette (matches site)
const BRAND = rgb(0.20, 0.45, 0.95); // tech blue
const INK = rgb(0.13, 0.13, 0.14);
const SUB = rgb(0.42, 0.42, 0.45);
const HAIR = rgb(0.86, 0.86, 0.88);
const SOFT = rgb(0.97, 0.96, 0.95);

const PAGE_W = 595.28; // A4
const PAGE_H = 841.89;
const MARGIN = 56;
const CONTENT_W = PAGE_W - MARGIN * 2;

type Ctx = {
  doc: PDFDocument;
  page: PDFPage;
  y: number;
  font: PDFFont;
  bold: PDFFont;
  pageNumber: number;
};

function newPage(ctx: Ctx) {
  ctx.page = ctx.doc.addPage([PAGE_W, PAGE_H]);
  ctx.pageNumber += 1;
  ctx.y = PAGE_H - MARGIN;
  drawFooter(ctx);
}

function drawFooter(ctx: Ctx) {
  ctx.page.drawText(`ScanAI · pagina ${ctx.pageNumber}`, {
    x: MARGIN,
    y: 28,
    size: 8,
    font: ctx.font,
    color: SUB,
  });
  ctx.page.drawText("scanai.nl", {
    x: PAGE_W - MARGIN - ctx.font.widthOfTextAtSize("scanai.nl", 8),
    y: 28,
    size: 8,
    font: ctx.font,
    color: SUB,
  });
}

function ensureSpace(ctx: Ctx, needed: number) {
  if (ctx.y - needed < MARGIN + 20) newPage(ctx);
}

/** Word-wrap a string into lines that fit `maxWidth` at `size`. */
function wrap(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = text.replace(/\s+/g, " ").split(" ");
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const trial = line ? `${line} ${w}` : w;
    if (font.widthOfTextAtSize(trial, size) <= maxWidth) {
      line = trial;
    } else {
      if (line) lines.push(line);
      line = w;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function sanitize(s: string): string {
  // pdf-lib's WinAnsi cannot encode all unicode (e.g. some dashes, smart quotes, emoji).
  return s
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/\u00a0/g, " ")
    .replace(/\u20AC/g, "EUR ")
    // strip anything else outside latin-1
    .replace(/[^\x09\x0A\x0D\x20-\xFF]/g, "");
}

function drawText(ctx: Ctx, text: string, opts: { size: number; font?: PDFFont; color?: ReturnType<typeof rgb>; lineHeight?: number; maxWidth?: number }) {
  const size = opts.size;
  const font = opts.font || ctx.font;
  const color = opts.color || INK;
  const lh = opts.lineHeight || size * 1.45;
  const maxW = opts.maxWidth || CONTENT_W;
  const lines = wrap(sanitize(text), font, size, maxW);
  for (const line of lines) {
    ensureSpace(ctx, lh);
    ctx.page.drawText(line, { x: MARGIN, y: ctx.y - size, size, font, color });
    ctx.y -= lh;
  }
}

function drawHairline(ctx: Ctx) {
  ensureSpace(ctx, 12);
  ctx.page.drawLine({
    start: { x: MARGIN, y: ctx.y - 4 },
    end: { x: PAGE_W - MARGIN, y: ctx.y - 4 },
    thickness: 0.5,
    color: HAIR,
  });
  ctx.y -= 12;
}

function drawPill(ctx: Ctx, label: string) {
  ensureSpace(ctx, 22);
  const padX = 10;
  const h = 18;
  const txtSize = 8.5;
  const w = ctx.bold.widthOfTextAtSize(sanitize(label), txtSize) + padX * 2;
  ctx.page.drawRectangle({
    x: MARGIN, y: ctx.y - h, width: w, height: h,
    color: SOFT, borderColor: HAIR, borderWidth: 0.5,
  });
  ctx.page.drawText(sanitize(label), {
    x: MARGIN + padX, y: ctx.y - h + 5, size: txtSize, font: ctx.bold, color: SUB,
  });
  ctx.y -= h + 10;
}

function drawValueCard(ctx: Ctx, value: string, breakdown: { label: string; value: string }[]) {
  const cardH = 150;
  ensureSpace(ctx, cardH + 20);
  const y0 = ctx.y - cardH;
  // Card background
  ctx.page.drawRectangle({
    x: MARGIN, y: y0, width: CONTENT_W, height: cardH,
    color: SOFT, borderColor: HAIR, borderWidth: 0.5,
  });
  // Label
  ctx.page.drawText("GESCHATTE JAARLIJKSE WAARDE", {
    x: MARGIN + 22, y: ctx.y - 28, size: 8, font: ctx.bold, color: BRAND,
  });
  // Big value
  ctx.page.drawText(sanitize(value), {
    x: MARGIN + 22, y: ctx.y - 70, size: 36, font: ctx.bold, color: INK,
  });
  // Breakdown grid
  const colW = (CONTENT_W - 44) / 4;
  breakdown.forEach((b, i) => {
    const x = MARGIN + 22 + i * colW;
    ctx.page.drawText(sanitize(b.label).toUpperCase(), {
      x, y: ctx.y - 100, size: 7, font: ctx.bold, color: SUB,
    });
    ctx.page.drawText(sanitize(b.value), {
      x, y: ctx.y - 118, size: 12, font: ctx.bold, color: INK,
    });
  });
  ctx.y = y0 - 16;
}

function drawScoreBars(ctx: Ctx, scores: { label: string; value: number }[]) {
  for (const s of scores) {
    ensureSpace(ctx, 36);
    ctx.page.drawText(sanitize(s.label), {
      x: MARGIN, y: ctx.y - 10, size: 10, font: ctx.bold, color: INK,
    });
    ctx.page.drawText(`${s.value}%`, {
      x: PAGE_W - MARGIN - 30, y: ctx.y - 10, size: 10, font: ctx.bold, color: BRAND,
    });
    // Bar background
    ctx.page.drawRectangle({
      x: MARGIN, y: ctx.y - 22, width: CONTENT_W, height: 4,
      color: HAIR,
    });
    // Bar fill
    ctx.page.drawRectangle({
      x: MARGIN, y: ctx.y - 22, width: (CONTENT_W * Math.max(0, Math.min(100, s.value))) / 100, height: 4,
      color: BRAND,
    });
    ctx.y -= 32;
  }
}

function drawChapter(ctx: Ctx, idx: number, title: string, body: string) {
  ensureSpace(ctx, 60);
  ctx.page.drawText(`HOOFDSTUK ${String(idx).padStart(2, "0")}`, {
    x: MARGIN, y: ctx.y - 10, size: 8, font: ctx.bold, color: BRAND,
  });
  ctx.y -= 22;
  drawText(ctx, title, { size: 18, font: ctx.bold });
  ctx.y -= 6;
  drawText(ctx, body, { size: 10.5, color: INK, lineHeight: 16 });
  ctx.y -= 14;
}

function drawRoadmapItem(ctx: Ctx, phase: string, title: string, desc: string) {
  ensureSpace(ctx, 70);
  ctx.page.drawText(sanitize(phase).toUpperCase(), {
    x: MARGIN, y: ctx.y - 10, size: 8, font: ctx.bold, color: BRAND,
  });
  ctx.y -= 18;
  drawText(ctx, title, { size: 13, font: ctx.bold });
  ctx.y -= 2;
  drawText(ctx, desc, { size: 10, color: SUB, lineHeight: 14.5 });
  drawHairline(ctx);
}

function drawToolCard(ctx: Ctx, t: { name: string; category: string; description: string; useCase: string }) {
  ensureSpace(ctx, 70);
  ctx.page.drawText(sanitize(t.category).toUpperCase(), {
    x: MARGIN, y: ctx.y - 10, size: 7.5, font: ctx.bold, color: BRAND,
  });
  ctx.y -= 16;
  drawText(ctx, t.name, { size: 13, font: ctx.bold });
  drawText(ctx, t.description, { size: 9.5, color: INK, lineHeight: 13.5 });
  drawText(ctx, `Use-case: ${t.useCase}`, { size: 9, color: SUB, lineHeight: 13 });
  drawHairline(ctx);
}

export const generatePDF = createServerFn({ method: "POST" })
  .inputValidator((input: PDFInput) => {
    if (!input?.report) throw new Error("Report ontbreekt");
    return input;
  })
  .handler(async ({ data }): Promise<{ base64: string; filename: string }> => {
    const { companyName, report } = data;

    const doc = await PDFDocument.create();
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const bold = await doc.embedFont(StandardFonts.HelveticaBold);

    const ctx: Ctx = {
      doc,
      page: doc.addPage([PAGE_W, PAGE_H]),
      y: PAGE_H - MARGIN,
      font,
      bold,
      pageNumber: 1,
    };
    drawFooter(ctx);

    // ===== COVER =====
    // Brand block
    ctx.page.drawRectangle({
      x: 0, y: PAGE_H - 6, width: PAGE_W, height: 6, color: BRAND,
    });
    ctx.page.drawText("ScanAI", { x: MARGIN, y: PAGE_H - 90, size: 14, font: bold, color: INK });
    ctx.page.drawText("AI ROADMAP RAPPORT", { x: MARGIN, y: PAGE_H - 110, size: 8, font: bold, color: SUB });

    // Title
    ctx.y = PAGE_H - 220;
    drawText(ctx, `De AI Roadmap voor ${companyName || "jouw bedrijf"}.`, {
      size: 30, font: bold, lineHeight: 36,
    });
    ctx.y -= 6;
    drawText(ctx, sanitize(report.executiveSummary), {
      size: 11, color: SUB, lineHeight: 17,
    });

    ctx.y -= 14;
    drawValueCard(ctx, report.formattedValue, [
      { label: "Loonbesparing", value: fmtEUR(report.valueBreakdown.laborSavings) },
      { label: "Omzet-uplift", value: fmtEUR(report.valueBreakdown.revenueUplift) },
      { label: "Retentie", value: fmtEUR(report.valueBreakdown.retentionGain) },
      { label: "Tooling", value: fmtEUR(report.valueBreakdown.efficiencyGain) },
    ]);

    // ===== SCORES =====
    newPage(ctx);
    drawPill(ctx, "AI MATURITY SCORES");
    drawText(ctx, `Hoe ${companyName || "jouw bedrijf"} scoort.`, { size: 22, font: bold });
    ctx.y -= 8;
    drawScoreBars(ctx, [
      { label: "AI Readiness", value: report.scores.readiness },
      { label: "Automation Potential", value: report.scores.automation },
      { label: "Business Impact", value: report.scores.impact },
    ]);
    ctx.y -= 10;
    drawHairline(ctx);

    // Radar as table fallback (pdf-lib heeft geen radar)
    drawPill(ctx, "BENCHMARK PER AS");
    for (const r of report.radar) {
      ensureSpace(ctx, 26);
      ctx.page.drawText(sanitize(r.axis), { x: MARGIN, y: ctx.y - 10, size: 10, font: bold, color: INK });
      ctx.page.drawText(`${r.value} vs ${r.benchmark}`, {
        x: PAGE_W - MARGIN - 80, y: ctx.y - 10, size: 10, font: bold, color: SUB,
      });
      ctx.y -= 14;
      ctx.page.drawRectangle({ x: MARGIN, y: ctx.y - 6, width: CONTENT_W, height: 3, color: HAIR });
      ctx.page.drawRectangle({ x: MARGIN, y: ctx.y - 6, width: (CONTENT_W * r.benchmark) / 100, height: 3, color: SUB });
      ctx.page.drawRectangle({ x: MARGIN, y: ctx.y - 6, width: (CONTENT_W * r.value) / 100, height: 3, color: BRAND });
      ctx.y -= 14;
    }

    // ===== CHAPTERS =====
    newPage(ctx);
    drawPill(ctx, "VOLLEDIG RAPPORT");
    drawText(ctx, "Vier hoofdstukken op maat.", { size: 22, font: bold });
    ctx.y -= 10;
    report.chapters.forEach((c, i) => drawChapter(ctx, i + 1, c.title, c.body));

    // ===== ROADMAP =====
    newPage(ctx);
    drawPill(ctx, "IMPLEMENTATIE ROADMAP");
    drawText(ctx, "Een gefaseerd plan.", { size: 22, font: bold });
    ctx.y -= 10;
    report.roadmap.forEach((r) => drawRoadmapItem(ctx, r.phase, r.title, r.description));

    // ===== TOOLS =====
    newPage(ctx);
    drawPill(ctx, "AANBEVOLEN TOOLS");
    drawText(ctx, "Geselecteerd op uitdagingen en doelen.", { size: 22, font: bold });
    ctx.y -= 10;
    report.tools.forEach((t) => drawToolCard(ctx, t));

    const bytes = await doc.save();
    let binary = "";
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    const base64 = btoa(binary);
    const safeName = (companyName || "ScanAI").replace(/[^a-zA-Z0-9-_]/g, "_");
    return { base64, filename: `${safeName}_AI_Roadmap.pdf` };
  });

function fmtEUR(n: number): string {
  return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}
