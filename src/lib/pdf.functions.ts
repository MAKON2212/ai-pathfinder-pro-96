import { createServerFn } from "@tanstack/react-start";
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage, type Color } from "pdf-lib";
import type { GeneratedReport } from "@/lib/report.functions";

type PDFInput = {
  companyName: string;
  report: GeneratedReport;
};

/* ============================================================
   Apple-gallery palette — mirrors src/styles.css tokens
   ============================================================ */
const FOG = rgb(0.961, 0.961, 0.969);     // #f5f5f7  page background
const SNOW = rgb(1, 1, 1);                // #ffffff  card surface
const INK = rgb(0.114, 0.114, 0.122);     // #1d1d1f  primary text
const GRAPHITE = rgb(0.439, 0.439, 0.439);// #707070  muted text
const SILVER = rgb(0.910, 0.910, 0.929);  // #e8e8ed  border / hairline
const AZURE = rgb(0.0, 0.443, 0.890);     // #0071e3  brand
const AZURE_SOFT = rgb(0.902, 0.945, 0.996); // very light azure tint
const CAUTION = rgb(0.714, 0.267, 0.0);   // #b64400 destructive
const CAUTION_SOFT = rgb(0.984, 0.953, 0.929);

/* ============================================================
   Page geometry — A4
   ============================================================ */
const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 48;
const CONTENT_W = PAGE_W - MARGIN * 2;
const CARD_RADIUS = 18; // pdf-lib has no native rounded rect; we approximate by drawing flat rects
const FOOTER_Y = 30;
const TOP_Y = PAGE_H - MARGIN;

type Ctx = {
  doc: PDFDocument;
  page: PDFPage;
  y: number;
  font: PDFFont;
  bold: PDFFont;
  med: PDFFont;
  pageNumber: number;
};

/* ============================================================
   Page lifecycle — every page gets the Fog background
   ============================================================ */
function paintBackground(ctx: Ctx) {
  ctx.page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: FOG });
}

function drawFooter(ctx: Ctx) {
  ctx.page.drawText(`ScanAI · AI Roadmap`, {
    x: MARGIN,
    y: FOOTER_Y,
    size: 8,
    font: ctx.font,
    color: GRAPHITE,
  });
  const right = `${ctx.pageNumber}`;
  ctx.page.drawText(right, {
    x: PAGE_W - MARGIN - ctx.font.widthOfTextAtSize(right, 8),
    y: FOOTER_Y,
    size: 8,
    font: ctx.font,
    color: GRAPHITE,
  });
}

function newPage(ctx: Ctx) {
  ctx.page = ctx.doc.addPage([PAGE_W, PAGE_H]);
  ctx.pageNumber += 1;
  paintBackground(ctx);
  ctx.y = TOP_Y;
  drawFooter(ctx);
}

function ensureSpace(ctx: Ctx, needed: number) {
  if (ctx.y - needed < MARGIN + 24) newPage(ctx);
}

/* ============================================================
   Text helpers
   ============================================================ */
function sanitize(s: string): string {
  // pdf-lib WinAnsi can't encode all unicode (smart quotes, em-dash, ellipsis, emoji).
  return (s || "")
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/\u00a0/g, " ")
    .replace(/\u20AC/g, "EUR ")
    .replace(/[^\x09\x0A\x0D\x20-\xFF]/g, "");
}

function wrap(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = sanitize(text).replace(/\s+/g, " ").trim().split(" ");
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

type TextOpts = {
  size: number;
  font?: PDFFont;
  color?: Color;
  lineHeight?: number;
  x?: number;
  maxWidth?: number;
  letterSpacing?: number; // applied via manual char drawing only when needed
};

function drawParagraph(ctx: Ctx, text: string, opts: TextOpts) {
  const size = opts.size;
  const font = opts.font || ctx.font;
  const color = opts.color || INK;
  const lh = opts.lineHeight || size * 1.45;
  const x = opts.x ?? MARGIN;
  const maxW = opts.maxWidth ?? CONTENT_W;
  const lines = wrap(text, font, size, maxW);
  for (const line of lines) {
    ensureSpace(ctx, lh);
    ctx.page.drawText(line, { x, y: ctx.y - size, size, font, color });
    ctx.y -= lh;
  }
}

/** Draw text inside a card (no auto page-break / margin tracking) */
function drawTextAt(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  size: number,
  font: PDFFont,
  color: Color,
) {
  page.drawText(sanitize(text), { x, y, size, font, color });
}

function drawWrappedAt(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  size: number,
  font: PDFFont,
  color: Color,
  lineHeight?: number,
): number {
  const lh = lineHeight ?? size * 1.45;
  const lines = wrap(text, font, size, maxWidth);
  let cy = y;
  for (const line of lines) {
    page.drawText(line, { x, y: cy - size, size, font, color });
    cy -= lh;
  }
  return y - cy; // height consumed
}

function measureWrap(text: string, font: PDFFont, size: number, maxWidth: number, lineHeight?: number): number {
  const lh = lineHeight ?? size * 1.45;
  return wrap(text, font, size, maxWidth).length * lh;
}

/* ============================================================
   Visual primitives — pill, card, hairline, score-bar
   ============================================================ */

/** Rounded card (we fake corners with a rect + 4 small rects to mask, but
 * pdf-lib doesn't support clipping. So we just draw a filled rect with a
 * thin border. The Fog background + soft border approximates the look. */
function drawCard(ctx: Ctx, h: number, opts?: { fill?: Color; border?: Color; padX?: number }) {
  ensureSpace(ctx, h + 16);
  const x = MARGIN;
  const y = ctx.y - h;
  ctx.page.drawRectangle({
    x, y, width: CONTENT_W, height: h,
    color: opts?.fill ?? SNOW,
    borderColor: opts?.border ?? SILVER,
    borderWidth: 0.6,
  });
  return { x, y, w: CONTENT_W, h };
}

function drawPill(ctx: Ctx, label: string, opts?: { color?: Color; bg?: Color; border?: Color }) {
  ensureSpace(ctx, 26);
  const padX = 12;
  const h = 20;
  const txtSize = 9;
  const txt = sanitize(`· ${label}`);
  const w = ctx.med.widthOfTextAtSize(txt, txtSize) + padX * 2;
  ctx.page.drawRectangle({
    x: MARGIN, y: ctx.y - h, width: w, height: h,
    color: opts?.bg ?? SNOW,
    borderColor: opts?.border ?? SILVER,
    borderWidth: 0.6,
  });
  ctx.page.drawText(txt, {
    x: MARGIN + padX,
    y: ctx.y - h + 6,
    size: txtSize,
    font: ctx.med,
    color: opts?.color ?? INK,
  });
  ctx.y -= h + 14;
}

function drawMonoLabel(ctx: Ctx, label: string, color: Color = GRAPHITE, x: number = MARGIN) {
  // Mimic font-mono uppercase tracking-[0.2em] via spaced caps
  const text = sanitize(label).toUpperCase().split("").join(" ");
  ctx.page.drawText(text, {
    x, y: ctx.y - 8, size: 7.5, font: ctx.bold, color,
  });
  ctx.y -= 16;
}

function drawHairline(ctx: Ctx, gap = 14) {
  ensureSpace(ctx, gap + 4);
  ctx.page.drawLine({
    start: { x: MARGIN, y: ctx.y - 2 },
    end: { x: PAGE_W - MARGIN, y: ctx.y - 2 },
    thickness: 0.5,
    color: SILVER,
  });
  ctx.y -= gap;
}

/* ============================================================
   Section header (pill + headline + optional subtext)
   ============================================================ */
function sectionHeader(ctx: Ctx, pill: string, headline: string, sub?: string) {
  ensureSpace(ctx, 120);
  drawPill(ctx, pill);
  drawParagraph(ctx, headline, { size: 26, font: ctx.bold, lineHeight: 30 });
  ctx.y -= 4;
  if (sub) {
    drawParagraph(ctx, sub, { size: 11, color: GRAPHITE, lineHeight: 16 });
  }
  ctx.y -= 12;
}

/* ============================================================
   Hero / value card
   ============================================================ */
function drawValueHero(ctx: Ctx, companyName: string, value: string, summary: string) {
  // Pill row
  drawPill(ctx, "Persoonlijke AI-analyse");

  // Title
  drawParagraph(ctx, `De AI Roadmap voor ${companyName || "jouw bedrijf"}.`, {
    size: 32, font: ctx.bold, lineHeight: 36,
  });
  ctx.y -= 6;

  // Summary
  drawParagraph(ctx, summary, { size: 11, color: GRAPHITE, lineHeight: 17 });
  ctx.y -= 18;

  // Value card — large headline number
  const cardH = 150;
  const card = drawCard(ctx, cardH);
  // mono label
  const monoLabel = "GESCHATTE  JAARLIJKSE  WAARDE";
  ctx.page.drawText(monoLabel.split("").join(" ").replace(/    /g, "  "), {
    x: card.x + 24, y: card.y + cardH - 28, size: 7.5, font: ctx.bold, color: AZURE,
  });
  // big value
  ctx.page.drawText(sanitize(value), {
    x: card.x + 24, y: card.y + cardH - 92, size: 44, font: ctx.bold, color: INK,
  });
  ctx.page.drawText(sanitize(`Jaarlijkse waarde voor ${companyName || "jouw bedrijf"}`), {
    x: card.x + 24, y: card.y + 22, size: 10, font: ctx.font, color: GRAPHITE,
  });
  ctx.y = card.y - 18;
}

/* ============================================================
   Value breakdown table (mirrors valueLineItems on results.tsx)
   ============================================================ */
function drawValueBreakdown(ctx: Ctx, items: { label: string; amount: number; formula: string; rationale: string }[], totalLabel: string, totalValue: string) {
  // Pre-compute total height per row
  const padX = 18;
  const rowGap = 10;
  const rowsHeights = items.map((it) => {
    const h1 = 14; // label row
    const h2 = measureWrap(it.formula, ctx.med, 9, CONTENT_W - padX * 2 - 100, 12);
    const h3 = measureWrap(it.rationale, ctx.font, 9.5, CONTENT_W - padX * 2 - 16, 13);
    return h1 + 4 + h2 + 4 + h3 + rowGap * 2;
  });
  const headerH = 32;
  const totalRowH = 38;
  const totalH = headerH + rowsHeights.reduce((a, b) => a + b, 0) + totalRowH;

  // If too tall for one page, draw header+rows splitting onto new page individually
  // Simpler approach: just draw as a card; if it doesn't fit, page-break and redraw.
  if (ctx.y - totalH < MARGIN + 24 && ctx.y < TOP_Y - 40) newPage(ctx);

  // Card
  const card = drawCard(ctx, totalH);
  // Header strip
  ctx.page.drawRectangle({
    x: card.x, y: card.y + totalH - headerH, width: card.w, height: headerH, color: FOG,
  });
  ctx.page.drawLine({
    start: { x: card.x, y: card.y + totalH - headerH },
    end: { x: card.x + card.w, y: card.y + totalH - headerH },
    thickness: 0.5, color: SILVER,
  });
  ctx.page.drawText("ONDERBOUWING  -  ZO  KOMEN  WE  AAN  HET  BEDRAG".split("").join(" ").replace(/    /g, "  "), {
    x: card.x + padX, y: card.y + totalH - headerH + 11, size: 7.5, font: ctx.bold, color: GRAPHITE,
  });

  // Rows
  let cy = card.y + totalH - headerH; // top of next row
  items.forEach((it, idx) => {
    const rh = rowsHeights[idx];
    cy -= rh;
    // separator
    if (idx > 0) {
      ctx.page.drawLine({
        start: { x: card.x, y: cy + rh },
        end: { x: card.x + card.w, y: cy + rh },
        thickness: 0.4, color: SILVER,
      });
    }
    // Label + amount on same baseline
    const labelY = cy + rh - rowGap - 12;
    ctx.page.drawText(sanitize(it.label), {
      x: card.x + padX, y: labelY, size: 11, font: ctx.bold, color: INK,
    });
    const amountText = fmtEUR(it.amount);
    const amountW = ctx.bold.widthOfTextAtSize(amountText, 12);
    ctx.page.drawText(amountText, {
      x: card.x + card.w - padX - amountW, y: labelY, size: 12, font: ctx.bold, color: INK,
    });
    // Formula (azure mono)
    let curY = labelY - 8;
    const formulaH = drawWrappedAt(
      ctx.page, it.formula,
      card.x + padX, curY,
      card.w - padX * 2, 9, ctx.med, AZURE, 12,
    );
    curY -= formulaH;
    // Rationale (graphite)
    drawWrappedAt(
      ctx.page, it.rationale,
      card.x + padX, curY - 2,
      card.w - padX * 2, 9.5, ctx.font, GRAPHITE, 13,
    );
  });
  // Total row (azure tint)
  const totY = card.y;
  ctx.page.drawRectangle({
    x: card.x, y: totY, width: card.w, height: totalRowH, color: AZURE_SOFT,
  });
  ctx.page.drawLine({
    start: { x: card.x, y: totY + totalRowH },
    end: { x: card.x + card.w, y: totY + totalRowH },
    thickness: 0.5, color: SILVER,
  });
  ctx.page.drawText(sanitize(totalLabel), {
    x: card.x + padX, y: totY + totalRowH / 2 - 5, size: 11, font: ctx.bold, color: INK,
  });
  const totW = ctx.bold.widthOfTextAtSize(totalValue, 16);
  ctx.page.drawText(sanitize(totalValue), {
    x: card.x + card.w - padX - totW, y: totY + totalRowH / 2 - 7, size: 16, font: ctx.bold, color: AZURE,
  });

  ctx.y = card.y - 18;
}

/* ============================================================
   Score block (label + big % + bar + rationale + drivers)
   ============================================================ */
function drawScoreBlock(ctx: Ctx, n: string, label: string, value: number, rationale?: string, drivers?: string[]) {
  // measure
  const padX = 20;
  const padY = 18;
  const titleH = 12;
  const numberH = 36;
  const barH = 6;
  const rationaleH = rationale ? measureWrap(rationale, ctx.font, 9.5, CONTENT_W - padX * 2, 13) + 8 : 0;
  const driversH = drivers && drivers.length > 0
    ? drivers.reduce((acc, d) => acc + measureWrap(d, ctx.font, 9, CONTENT_W - padX * 2 - 14, 12) + 4, 6)
    : 0;
  const cardH = padY * 2 + titleH + 14 + numberH + 12 + barH + rationaleH + driversH;

  const card = drawCard(ctx, cardH);
  // top row: label + n
  ctx.page.drawText(sanitize(label).toUpperCase().split("").join(" "), {
    x: card.x + padX, y: card.y + cardH - padY - 8, size: 7.5, font: ctx.bold, color: GRAPHITE,
  });
  const nText = sanitize(n);
  const nW = ctx.med.widthOfTextAtSize(nText, 9);
  ctx.page.drawText(nText, {
    x: card.x + card.w - padX - nW, y: card.y + cardH - padY - 8, size: 9, font: ctx.med, color: AZURE,
  });
  // big number
  const valText = `${value}`;
  ctx.page.drawText(valText, {
    x: card.x + padX, y: card.y + cardH - padY - titleH - 14 - numberH + 8, size: 36, font: ctx.bold, color: INK,
  });
  const valW = ctx.bold.widthOfTextAtSize(valText, 36);
  ctx.page.drawText("%", {
    x: card.x + padX + valW + 4, y: card.y + cardH - padY - titleH - 14 - numberH + 14, size: 16, font: ctx.font, color: GRAPHITE,
  });
  // bar
  const barY = card.y + cardH - padY - titleH - 14 - numberH - 12 - barH;
  ctx.page.drawRectangle({
    x: card.x + padX, y: barY, width: card.w - padX * 2, height: barH, color: SILVER,
  });
  ctx.page.drawRectangle({
    x: card.x + padX, y: barY,
    width: ((card.w - padX * 2) * Math.max(0, Math.min(100, value))) / 100,
    height: barH, color: AZURE,
  });
  // rationale
  let cy = barY - 12;
  if (rationale) {
    drawWrappedAt(ctx.page, rationale, card.x + padX, cy, card.w - padX * 2, 9.5, ctx.font, INK, 13);
    cy -= measureWrap(rationale, ctx.font, 9.5, card.w - padX * 2, 13);
  }
  // drivers as bullet list
  if (drivers && drivers.length > 0) {
    cy -= 6;
    for (const d of drivers) {
      // bullet dot
      ctx.page.drawCircle({ x: card.x + padX + 3, y: cy - 4, size: 1.2, color: AZURE });
      const h = drawWrappedAt(ctx.page, d, card.x + padX + 12, cy, card.w - padX * 2 - 12, 9, ctx.font, INK, 12);
      cy -= h + 4;
    }
  }
  ctx.y = card.y - 14;
}

/* ============================================================
   Benchmark bars (replaces radar chart from results page)
   ============================================================ */
function drawBenchmarkBars(ctx: Ctx, axes: { axis: string; value: number; benchmark: number }[]) {
  const padX = 20;
  const rowH = 38;
  const headerH = 38;
  const cardH = headerH + axes.length * rowH + 18;
  const card = drawCard(ctx, cardH);

  // Header
  ctx.page.drawText("AI  MATURITY  PROFILE".split("").join(" "), {
    x: card.x + padX, y: card.y + cardH - 18, size: 7.5, font: ctx.bold, color: GRAPHITE,
  });
  // Legend dots on right
  const legendY = card.y + cardH - 18;
  const legend1 = "Jouw score";
  const legend2 = "Benchmark";
  let lx = card.x + card.w - padX;
  // benchmark right-most
  const l2W = ctx.font.widthOfTextAtSize(legend2, 8);
  lx -= l2W;
  ctx.page.drawText(legend2, { x: lx, y: legendY, size: 8, font: ctx.font, color: GRAPHITE });
  lx -= 10;
  ctx.page.drawCircle({ x: lx, y: legendY + 3, size: 2.5, color: GRAPHITE });
  lx -= 18;
  const l1W = ctx.font.widthOfTextAtSize(legend1, 8);
  lx -= l1W;
  ctx.page.drawText(legend1, { x: lx, y: legendY, size: 8, font: ctx.font, color: GRAPHITE });
  lx -= 10;
  ctx.page.drawCircle({ x: lx, y: legendY + 3, size: 2.5, color: AZURE });

  // Hairline under header
  ctx.page.drawLine({
    start: { x: card.x + padX, y: card.y + cardH - headerH + 4 },
    end: { x: card.x + card.w - padX, y: card.y + cardH - headerH + 4 },
    thickness: 0.4, color: SILVER,
  });

  // Rows
  for (let i = 0; i < axes.length; i++) {
    const r = axes[i];
    const top = card.y + cardH - headerH - i * rowH - 4;
    // axis label
    ctx.page.drawText(sanitize(r.axis), {
      x: card.x + padX, y: top - 12, size: 10, font: ctx.bold, color: INK,
    });
    // numbers right
    const nums = `${r.value}  vs  ${r.benchmark}`;
    const nW = ctx.med.widthOfTextAtSize(nums, 9);
    ctx.page.drawText(nums, {
      x: card.x + card.w - padX - nW, y: top - 12, size: 9, font: ctx.med, color: GRAPHITE,
    });
    // bar background
    const barY = top - 24;
    const barW = card.w - padX * 2;
    ctx.page.drawRectangle({ x: card.x + padX, y: barY, width: barW, height: 4, color: SILVER });
    // benchmark fill (graphite, slim)
    ctx.page.drawRectangle({
      x: card.x + padX, y: barY,
      width: (barW * r.benchmark) / 100, height: 2, color: GRAPHITE,
    });
    // value fill (azure, full)
    ctx.page.drawRectangle({
      x: card.x + padX, y: barY,
      width: (barW * r.value) / 100, height: 4, color: AZURE,
    });
  }
  ctx.y = card.y - 14;
}

/* ============================================================
   Chapter card
   ============================================================ */
function drawChapter(ctx: Ctx, idx: number, title: string, body: string) {
  const padX = 22;
  const padY = 22;
  const labelH = 14;
  const titleH = measureWrap(title, ctx.bold, 20, CONTENT_W - padX * 2, 24);
  const bodyH = measureWrap(body, ctx.font, 10.5, CONTENT_W - padX * 2, 16);
  const cardH = padY * 2 + labelH + 8 + titleH + 10 + bodyH;

  // If too big for a single page, split: render label+title on current page, body in paragraph mode
  if (cardH > PAGE_H - MARGIN * 2 - 40) {
    // Fallback: render as flowing content with hairline divider
    ensureSpace(ctx, 40);
    ctx.page.drawText(`HOOFDSTUK  ${String(idx).padStart(2, "0")}`.split("").join(" "), {
      x: MARGIN, y: ctx.y - 10, size: 7.5, font: ctx.bold, color: AZURE,
    });
    ctx.y -= 22;
    drawParagraph(ctx, title, { size: 20, font: ctx.bold, lineHeight: 24 });
    ctx.y -= 6;
    drawParagraph(ctx, body, { size: 10.5, color: INK, lineHeight: 16 });
    drawHairline(ctx);
    return;
  }

  const card = drawCard(ctx, cardH);
  ctx.page.drawText(`HOOFDSTUK  ${String(idx).padStart(2, "0")}`.split("").join(" "), {
    x: card.x + padX, y: card.y + cardH - padY - 8, size: 7.5, font: ctx.bold, color: AZURE,
  });
  let cy = card.y + cardH - padY - labelH - 8;
  const tH = drawWrappedAt(ctx.page, title, card.x + padX, cy, card.w - padX * 2, 20, ctx.bold, INK, 24);
  cy -= tH + 8;
  drawWrappedAt(ctx.page, body, card.x + padX, cy, card.w - padX * 2, 10.5, ctx.font, INK, 16);
  ctx.y = card.y - 14;
}

/* ============================================================
   Roadmap card (phase, title, description)
   ============================================================ */
function drawRoadmapCard(ctx: Ctx, phase: string, title: string, desc: string) {
  const padX = 20;
  const padY = 18;
  const labelH = 12;
  const titleH = measureWrap(title, ctx.bold, 16, CONTENT_W - padX * 2, 20);
  const descH = measureWrap(desc, ctx.font, 10, CONTENT_W - padX * 2, 14.5);
  const cardH = padY * 2 + labelH + 8 + titleH + 6 + descH;

  const card = drawCard(ctx, cardH);
  ctx.page.drawText(sanitize(phase).toUpperCase().split("").join(" "), {
    x: card.x + padX, y: card.y + cardH - padY - 8, size: 7.5, font: ctx.bold, color: AZURE,
  });
  let cy = card.y + cardH - padY - labelH - 8;
  const tH = drawWrappedAt(ctx.page, title, card.x + padX, cy, card.w - padX * 2, 16, ctx.bold, INK, 20);
  cy -= tH + 6;
  drawWrappedAt(ctx.page, desc, card.x + padX, cy, card.w - padX * 2, 10, ctx.font, GRAPHITE, 14.5);
  ctx.y = card.y - 12;
}

/* ============================================================
   Tool card
   ============================================================ */
function drawToolCard(ctx: Ctx, t: { name: string; category: string; description: string; useCase: string; pricing?: string; setupTime?: string; firstStep?: string }) {
  const padX = 20;
  const padY = 18;
  const catH = 12;
  const nameH = 18;
  const descH = measureWrap(t.description, ctx.font, 10, CONTENT_W - padX * 2, 14);
  const metaH = (t.pricing || t.setupTime) ? 32 : 0;
  const useH = measureWrap(`Use-case · ${t.useCase}`, ctx.font, 9.5, CONTENT_W - padX * 2, 13);
  const stepH = t.firstStep ? measureWrap(`Eerste stap · ${t.firstStep}`, ctx.font, 9.5, CONTENT_W - padX * 2, 13) + 4 : 0;
  const cardH = padY * 2 + catH + 6 + nameH + 8 + descH + (metaH ? metaH + 8 : 0) + 12 + useH + stepH;

  const card = drawCard(ctx, cardH);
  ctx.page.drawText(sanitize(t.category).toUpperCase().split("").join(" "), {
    x: card.x + padX, y: card.y + cardH - padY - 8, size: 7.5, font: ctx.bold, color: AZURE,
  });
  ctx.page.drawText(sanitize(t.name), {
    x: card.x + padX, y: card.y + cardH - padY - catH - nameH, size: 16, font: ctx.bold, color: INK,
  });
  let cy = card.y + cardH - padY - catH - nameH - 10;
  const dH = drawWrappedAt(ctx.page, t.description, card.x + padX, cy, card.w - padX * 2, 10, ctx.font, GRAPHITE, 14);
  cy -= dH;

  if (t.pricing || t.setupTime) {
    cy -= 8;
    const colW = (card.w - padX * 2 - 10) / 2;
    if (t.pricing) {
      ctx.page.drawRectangle({ x: card.x + padX, y: cy - 24, width: colW, height: 24, borderColor: SILVER, borderWidth: 0.5, color: FOG });
      ctx.page.drawText("PRIJS".split("").join(" "), { x: card.x + padX + 8, y: cy - 10, size: 7, font: ctx.bold, color: GRAPHITE });
      ctx.page.drawText(sanitize(t.pricing), { x: card.x + padX + 8, y: cy - 20, size: 9, font: ctx.bold, color: INK });
    }
    if (t.setupTime) {
      const sx = card.x + padX + colW + 10;
      ctx.page.drawRectangle({ x: sx, y: cy - 24, width: colW, height: 24, borderColor: SILVER, borderWidth: 0.5, color: FOG });
      ctx.page.drawText("SETUP".split("").join(" "), { x: sx + 8, y: cy - 10, size: 7, font: ctx.bold, color: GRAPHITE });
      ctx.page.drawText(sanitize(t.setupTime), { x: sx + 8, y: cy - 20, size: 9, font: ctx.bold, color: INK });
    }
    cy -= 32;
  }

  // Hairline above use-case
  cy -= 4;
  ctx.page.drawLine({ start: { x: card.x + padX, y: cy }, end: { x: card.x + card.w - padX, y: cy }, thickness: 0.4, color: SILVER });
  cy -= 8;
  // Use-case
  ctx.page.drawText("Use-case · ", { x: card.x + padX, y: cy - 9, size: 9.5, font: ctx.bold, color: AZURE });
  const usePrefixW = ctx.bold.widthOfTextAtSize("Use-case · ", 9.5);
  drawWrappedAt(ctx.page, t.useCase, card.x + padX + usePrefixW, cy, card.w - padX * 2 - usePrefixW, 9.5, ctx.font, GRAPHITE, 13);
  cy -= useH;

  if (t.firstStep) {
    cy -= 4;
    ctx.page.drawText("Eerste stap · ", { x: card.x + padX, y: cy - 9, size: 9.5, font: ctx.bold, color: AZURE });
    const stpPrefixW = ctx.bold.widthOfTextAtSize("Eerste stap · ", 9.5);
    drawWrappedAt(ctx.page, t.firstStep, card.x + padX + stpPrefixW, cy, card.w - padX * 2 - stpPrefixW, 9.5, ctx.font, GRAPHITE, 13);
  }
  ctx.y = card.y - 12;
}

/* ============================================================
   Quick win card
   ============================================================ */
function drawQuickWin(ctx: Ctx, q: { title: string; effort: string; impact: string; howTo: string }) {
  const padX = 20;
  const padY = 18;
  const titleH = measureWrap(q.title, ctx.bold, 14, CONTENT_W - padX * 2, 18);
  const tagsH = 22;
  const howH = measureWrap(q.howTo, ctx.font, 10, CONTENT_W - padX * 2, 14);
  const cardH = padY * 2 + 16 + titleH + 10 + tagsH + 10 + howH;

  const card = drawCard(ctx, cardH);
  // lightning glyph (substitute: small azure square)
  ctx.page.drawRectangle({ x: card.x + padX, y: card.y + cardH - padY - 10, width: 10, height: 10, color: AZURE });
  let cy = card.y + cardH - padY - 18;
  const tH = drawWrappedAt(ctx.page, q.title, card.x + padX, cy - 4, card.w - padX * 2, 14, ctx.bold, INK, 18);
  cy -= tH + 10;

  // Tags
  const drawTag = (text: string, x: number, fill: Color, fg: Color, border: Color) => {
    const w = ctx.bold.widthOfTextAtSize(text, 8) + 18;
    ctx.page.drawRectangle({ x, y: cy - 16, width: w, height: 16, color: fill, borderColor: border, borderWidth: 0.5 });
    ctx.page.drawText(text, { x: x + 9, y: cy - 12, size: 8, font: ctx.bold, color: fg });
    return w;
  };
  let tx = card.x + padX;
  tx += drawTag(sanitize(q.effort).toUpperCase(), tx, FOG, GRAPHITE, SILVER) + 6;
  drawTag(sanitize(q.impact).toUpperCase(), tx, AZURE_SOFT, AZURE, AZURE);
  cy -= 26;

  drawWrappedAt(ctx.page, q.howTo, card.x + padX, cy, card.w - padX * 2, 10, ctx.font, GRAPHITE, 14);
  ctx.y = card.y - 12;
}

/* ============================================================
   Weekly plan row (week label + actions checklist)
   ============================================================ */
function drawWeekRow(ctx: Ctx, w: { week: string; focus: string; actions: string[] }) {
  const padX = 20;
  const padY = 18;
  const leftColW = 150;
  const rightX = MARGIN + leftColW + 16;
  const rightW = CONTENT_W - leftColW - 16 - padX;

  const actionsH = w.actions.reduce((acc, a) => acc + measureWrap(a, ctx.font, 10, rightW - 14, 14) + 4, 0);
  const leftH = 12 + 6 + 16; // mono label + focus
  const cardH = padY * 2 + Math.max(actionsH, leftH);

  const card = drawCard(ctx, cardH);
  // Left col
  const leftTop = card.y + cardH - padY - 8;
  ctx.page.drawText(sanitize(w.week).toUpperCase().split("").join(" "), {
    x: card.x + padX, y: leftTop, size: 7.5, font: ctx.bold, color: AZURE,
  });
  ctx.page.drawText(sanitize(w.focus), {
    x: card.x + padX, y: leftTop - 18, size: 11, font: ctx.bold, color: INK,
  });
  // Actions
  let cy = card.y + cardH - padY - 4;
  for (const a of w.actions) {
    // checkmark dot
    ctx.page.drawCircle({ x: card.x + leftColW + 22, y: cy - 6, size: 2, color: AZURE });
    const h = drawWrappedAt(ctx.page, a, card.x + leftColW + 32, cy, rightW - 14, 10, ctx.font, INK, 14);
    cy -= h + 4;
  }
  ctx.y = card.y - 12;
}

/* ============================================================
   Sensitivity card
   ============================================================ */
function drawSensitivity(ctx: Ctx, s: { label: string; estimatedValue: number; multiplier: number; rationale: string }) {
  const padX = 20;
  const padY = 18;
  const isBest = s.label.toLowerCase().includes("best");
  const isWorst = s.label.toLowerCase().includes("worst");
  const fill = isBest ? AZURE_SOFT : isWorst ? CAUTION_SOFT : SNOW;
  const border = isBest ? AZURE : isWorst ? CAUTION : SILVER;

  const valueH = 30;
  const multH = 12;
  const ratH = measureWrap(s.rationale, ctx.font, 10, CONTENT_W - padX * 2, 14);
  const cardH = padY * 2 + 14 + 10 + valueH + 6 + multH + 12 + ratH;

  const card = drawCard(ctx, cardH, { fill, border });
  ctx.page.drawText(sanitize(s.label).toUpperCase().split("").join(" "), {
    x: card.x + padX, y: card.y + cardH - padY - 8, size: 7.5, font: ctx.bold, color: GRAPHITE,
  });
  ctx.page.drawText(fmtEUR(s.estimatedValue), {
    x: card.x + padX, y: card.y + cardH - padY - 14 - valueH + 2, size: 26, font: ctx.bold, color: INK,
  });
  ctx.page.drawText(`× ${s.multiplier.toFixed(2)} multiplier`, {
    x: card.x + padX, y: card.y + cardH - padY - 14 - valueH - 12, size: 9, font: ctx.med, color: AZURE,
  });
  drawWrappedAt(
    ctx.page, s.rationale,
    card.x + padX, card.y + cardH - padY - 14 - valueH - 22,
    card.w - padX * 2, 10, ctx.font, GRAPHITE, 14,
  );
  ctx.y = card.y - 12;
}

/* ============================================================
   Final CTA
   ============================================================ */
function drawCTA(ctx: Ctx, value: string, companyName: string) {
  const cardH = 130;
  const card = drawCard(ctx, cardH);
  drawTextAt(ctx.page, "·  Volgende stap", card.x + 22, card.y + cardH - 24, 9, ctx.med, INK);
  // Headline
  drawWrappedAt(
    ctx.page,
    `Klaar om ${value} per jaar te verzilveren?`,
    card.x + 22, card.y + cardH - 42, card.w - 44, 18, ctx.bold, INK, 22,
  );
  drawWrappedAt(
    ctx.page,
    `Print of bewaar dit rapport voor ${companyName || "jouw bedrijf"}, en plan een vervolggesprek via scanai.nl/contact.`,
    card.x + 22, card.y + 36, card.w - 44, 10, ctx.font, GRAPHITE, 14,
  );
  ctx.y = card.y - 12;
}

/* ============================================================
   Helpers
   ============================================================ */
function fmtEUR(n: number): string {
  return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

/* ============================================================
   Main
   ============================================================ */
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
    const med = await doc.embedFont(StandardFonts.HelveticaOblique);

    const ctx: Ctx = {
      doc,
      page: doc.addPage([PAGE_W, PAGE_H]),
      y: TOP_Y,
      font, bold, med,
      pageNumber: 1,
    };
    paintBackground(ctx);
    drawFooter(ctx);

    // Top brand wordmark
    ctx.page.drawText("ScanAI", { x: MARGIN, y: TOP_Y + 4, size: 13, font: bold, color: INK });
    ctx.page.drawText("AI ROADMAP RAPPORT".split("").join(" "), {
      x: PAGE_W - MARGIN - bold.widthOfTextAtSize("AI ROADMAP RAPPORT".split("").join(" "), 7.5),
      y: TOP_Y + 6, size: 7.5, font: bold, color: GRAPHITE,
    });
    ctx.y = TOP_Y - 18;

    // ============= HERO =============
    drawValueHero(ctx, companyName, report.formattedValue, report.executiveSummary);

    // ============= VALUE BREAKDOWN =============
    drawValueBreakdown(
      ctx,
      report.valueLineItems,
      "Totaal jaarlijkse waarde",
      report.formattedValue,
    );

    // ============= SCORES =============
    newPage(ctx);
    sectionHeader(
      ctx,
      "AI maturity scores",
      `Hoe ${companyName || "jouw bedrijf"} scoort.`,
      "Drie kerndimensies, met onderbouwing en de drivers achter de score.",
    );
    drawScoreBlock(ctx, "01", "AI Readiness", report.scores.readiness, report.scoreDetails?.readiness?.rationale, report.scoreDetails?.readiness?.drivers);
    drawScoreBlock(ctx, "02", "Automation Potential", report.scores.automation, report.scoreDetails?.automation?.rationale, report.scoreDetails?.automation?.drivers);
    drawScoreBlock(ctx, "03", "Business Impact", report.scores.impact, report.scoreDetails?.impact?.rationale, report.scoreDetails?.impact?.drivers);

    // ============= BENCHMARK BARS =============
    newPage(ctx);
    sectionHeader(
      ctx,
      "Benchmark per as",
      `${companyName || "Jouw bedrijf"} vs. branche-benchmark.`,
      "Hoe verder de azuurblauwe balk de grijze passeert, hoe sterker de hefboom.",
    );
    drawBenchmarkBars(ctx, report.radar);

    // ============= CHAPTERS =============
    newPage(ctx);
    sectionHeader(
      ctx,
      "Volledig rapport",
      `${report.chapters.length} hoofdstukken op maat van ${companyName || "jouw bedrijf"}.`,
    );
    report.chapters.forEach((c, i) => drawChapter(ctx, i + 1, c.title, c.body));

    // ============= ROADMAP =============
    newPage(ctx);
    sectionHeader(
      ctx,
      "Implementatie roadmap",
      `Een gefaseerd plan, op maat van ${companyName || "jouw organisatie"}.`,
    );
    report.roadmap.forEach((r) => drawRoadmapCard(ctx, r.phase, r.title, r.description));

    // ============= TOOLS =============
    newPage(ctx);
    sectionHeader(
      ctx,
      "Aanbevolen tools",
      "Geselecteerd op basis van jouw uitdagingen en doelen.",
    );
    report.tools.forEach((t) => drawToolCard(ctx, t));

    // ============= QUICK WINS =============
    if (report.quickWins?.length) {
      newPage(ctx);
      sectionHeader(
        ctx,
        "Quick wins deze week",
        "Drie dingen die je vandaag kunt starten.",
      );
      report.quickWins.forEach((q) => drawQuickWin(ctx, q));
    }

    // ============= WEEKPLAN =============
    if (report.weeklyPlan?.length) {
      newPage(ctx);
      sectionHeader(
        ctx,
        "90-dagen actieplan",
        "Week voor week, wat je concreet doet.",
      );
      report.weeklyPlan.forEach((w) => drawWeekRow(ctx, w));
    }

    // ============= SENSITIVITY =============
    if (report.sensitivity?.length) {
      newPage(ctx);
      sectionHeader(
        ctx,
        "Risico & scenario's",
        "Worst, base & best case — eerlijke onderkant.",
      );
      report.sensitivity.forEach((s) => drawSensitivity(ctx, s));
    }

    // ============= CTA =============
    ctx.y -= 8;
    drawCTA(ctx, report.formattedValue, companyName);

    const bytes = await doc.save();
    let binary = "";
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    const base64 = btoa(binary);
    const safeName = (companyName || "ScanAI").replace(/[^a-zA-Z0-9-_]/g, "_");
    return { base64, filename: `${safeName}_AI_Roadmap.pdf` };
  });
