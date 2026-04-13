import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { ArtworkItem, ArtworkCategory, ArtworkDetailTemplate } from "@/lib/types";

const defaultDataPath = path.resolve(process.cwd(), "..", "data", "portfolio-items.json");
const localDataPath = path.resolve(process.cwd(), "data", "portfolio-items.json");
const legacyRoot = path.resolve(process.cwd(), "..");

const legacyDetailCache = new Map<string, LegacyDetailMeta | null>();

type RawArtworkItem = Partial<ArtworkItem> & {
  slug?: unknown;
  detail_template?: unknown;
  detail_images?: unknown;
  media?: unknown;
  displayType?: unknown;
  columnLayout?: unknown;
  hero_image?: unknown;
  heroImage?: unknown;
};

type LegacyDetailMeta = {
  template: ArtworkDetailTemplate;
  images: string[];
};

function dataPath(): string {
  return process.env.PORTFOLIO_DATA_PATH ?? defaultDataPath;
}

function normalizeCategory(category: string): ArtworkCategory {
  return category === "sculptures" ? "sculptures" : "drawing";
}

function slugify(value: string): string {
  const normalized = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || `item-${randomUUID().slice(0, 8)}`;
}

function basenameWithoutExtension(value: string): string {
  const clean = value.split("?")[0].trim();
  const base = clean.split("/").pop() ?? "";
  return base.replace(/\.html?$/i, "");
}

function normalizeTemplate(value: unknown): ArtworkDetailTemplate | null {
  if (value === "single" || value === "gallery3" || value === "gallery4" || value === "carousel") {
    return value;
  }

  return null;
}

function parseImageList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((entry) => (typeof entry === "string" ? entry.trim() : ""))
      .filter((entry) => entry.length > 0);
  }

  if (typeof value === "string") {
    return value
      .split(/\r?\n|,/)
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0);
  }

  return [];
}

function uniqueStrings(values: string[]): string[] {
  return Array.from(new Set(values.map((value) => value.trim()).filter((value) => value.length > 0)));
}

function normalizeDisplayType(value: unknown, fallback: "single" | "carousel"): "single" | "carousel" {
  return value === "carousel" || value === "single" ? value : fallback;
}

function normalizeColumnLayout(value: unknown, fallback: 1 | 3 | 4): 1 | 3 | 4 {
  const parsed = Number(value);
  return parsed === 4 ? 4 : parsed === 3 ? 3 : parsed === 1 ? 1 : fallback;
}

async function readLegacyDetailMeta(detailUrl: string): Promise<LegacyDetailMeta | null> {
  const cleanPath = detailUrl.split("?")[0].replace(/^\//, "").trim();
  if (!cleanPath.endsWith(".html")) {
    return null;
  }

  if (legacyDetailCache.has(cleanPath)) {
    return legacyDetailCache.get(cleanPath) ?? null;
  }

  const filePath = path.resolve(legacyRoot, cleanPath);

  try {
    const html = await fs.readFile(filePath, "utf8");
    const imageMatches = [...html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)]
      .map((match) => (match[1] ?? "").trim())
      .filter((src) => src.startsWith("images/"))
      .filter((src) => !/images\/(icons|logo|map-marker|favicon)/i.test(src));

    const images = uniqueStrings(imageMatches);
    const hasCarousel = /pro-details-active\s+owl-carousel/.test(html);
    const hasFourColumn = /class=["'][^"']*\bfour-column\b[^"']*["']/i.test(html);
    const template: ArtworkDetailTemplate = hasCarousel
      ? "carousel"
      : hasFourColumn
        ? "gallery4"
        : images.length > 1
          ? "gallery3"
          : "single";
    const meta: LegacyDetailMeta = { template, images };

    legacyDetailCache.set(cleanPath, meta);
    return meta;
  } catch {
    legacyDetailCache.set(cleanPath, null);
    return null;
  }
}

function normalizeBaseItem(input: RawArtworkItem): Omit<ArtworkItem, "slug" | "detail_template" | "detail_images"> {
  const media = uniqueStrings(parseImageList(input.media));
  const detailImages = uniqueStrings(parseImageList(input.detail_images));
  const mergedMedia = media.length > 0 ? media : detailImages;
  const displayType = normalizeDisplayType(input.displayType, input.detail_template === "carousel" ? "carousel" : "single");
  const columnLayout = normalizeColumnLayout(
    input.columnLayout,
    input.detail_template === "gallery4" ? 4 : input.detail_template === "single" ? 1 : 3
  );

  return {
    id: (input.id ?? `item_${randomUUID().slice(0, 8)}`).toString().trim(),
    title: (input.title ?? "Untitled").toString().trim(),
    description: String(input.description ?? "").trim(),
    category: normalizeCategory(String(input.category ?? "drawing")),
    media: mergedMedia,
    displayType,
    columnLayout,
    hero_image: String(input.hero_image ?? input.heroImage ?? "").trim(),
    thumbnail: String(input.thumbnail ?? "").trim(),
    detail_url: String(input.detail_url ?? "#").trim(),
    portfolio_order: Number.isFinite(input.portfolio_order) ? Number(input.portfolio_order) : 0,
    show_in_portfolio: Boolean(input.show_in_portfolio),
    show_on_home: Boolean(input.show_on_home),
    home_order: Number.isFinite(input.home_order) ? Number(input.home_order) : 0,
    home_image: String(input.home_image ?? "").trim(),
    home_image_style: String(input.home_image_style ?? "").trim(),
    active: input.active ?? true
  };
}

function normalizeWithDetails(input: RawArtworkItem, legacyMeta: LegacyDetailMeta | null): ArtworkItem {
  const base = normalizeBaseItem(input);

  const explicitSlug = typeof input.slug === "string" ? input.slug.trim() : "";
  const derivedSlug = basenameWithoutExtension(base.detail_url) || base.id;
  const slug = slugify(explicitSlug || derivedSlug);

  const explicitMedia = parseImageList(input.media);
  const explicitImages = parseImageList(input.detail_images);
  const fallbackImages = legacyMeta?.images ?? [];
  const detailImages = uniqueStrings(
    explicitMedia.length > 0
      ? explicitMedia
      : explicitImages.length > 0
        ? explicitImages
      : fallbackImages.length > 0
        ? fallbackImages
        : base.thumbnail
          ? [base.thumbnail]
          : []
  );

  const explicitTemplate = normalizeTemplate(input.detail_template);
  const detailTemplate: ArtworkDetailTemplate =
    explicitTemplate ?? legacyMeta?.template ?? (detailImages.length > 1 ? "gallery3" : "single");
  const displayType = normalizeDisplayType(input.displayType, detailTemplate === "carousel" ? "carousel" : "single");
  const columnLayout = normalizeColumnLayout(
    input.columnLayout,
    detailTemplate === "gallery4" ? 4 : detailTemplate === "single" ? 1 : 3
  );

  return {
    ...base,
    slug,
    media: detailImages,
    hero_image: base.hero_image || base.thumbnail || detailImages[0] || "",
    thumbnail: base.thumbnail || base.hero_image || detailImages[0] || "",
    displayType,
    columnLayout,
    detail_template: detailTemplate,
    detail_images: detailImages
  };
}

function sortItems(items: ArtworkItem[]): ArtworkItem[] {
  return [...items].sort((a, b) => {
    if (a.portfolio_order !== b.portfolio_order) {
      return a.portfolio_order - b.portfolio_order;
    }
    return a.id.localeCompare(b.id);
  });
}

async function readRawDataFile(): Promise<string> {
  const primary = dataPath();
  try {
    return await fs.readFile(primary, "utf8");
  } catch {
    try {
      return await fs.readFile(localDataPath, "utf8");
    } catch {
      // First boot: no data file yet. Start with an empty portfolio.
      return "[]";
    }
  }
}

function parseRawItems(raw: string): RawArtworkItem[] {
  try {
    return JSON.parse(raw) as RawArtworkItem[];
  } catch {
    const firstBracket = raw.indexOf("[");
    const lastBracket = raw.lastIndexOf("]");
    if (firstBracket !== -1 && lastBracket > firstBracket) {
      const recovered = raw.slice(firstBracket, lastBracket + 1);
      return JSON.parse(recovered) as RawArtworkItem[];
    }
    throw new Error("Invalid portfolio JSON format");
  }
}

export function normalizeImagePath(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

export function artworkDetailPath(item: Pick<ArtworkItem, "slug">): string {
  return `/portfolio/${encodeURIComponent(item.slug)}`;
}

export async function readPortfolioItems(): Promise<ArtworkItem[]> {
  const raw = await readRawDataFile();
  const parsed = parseRawItems(raw);

  const items = await Promise.all(
    parsed.map(async (entry) => {
      const detailUrl = typeof entry.detail_url === "string" ? entry.detail_url : "#";
      const legacyMeta = await readLegacyDetailMeta(detailUrl);
      return normalizeWithDetails(entry, legacyMeta);
    })
  );

  return sortItems(items);
}

export async function writePortfolioItems(items: ArtworkItem[]): Promise<void> {
  const targetPath = dataPath();
  const normalized = items.map((item) => normalizeWithDetails(item, null));
  const payload = JSON.stringify(sortItems(normalized), null, 2);

  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await fs.writeFile(targetPath, `${payload}\n`, "utf8");
}

export async function getPortfolioItems(): Promise<ArtworkItem[]> {
  const items = await readPortfolioItems();
  return items.filter((item) => item.active && item.show_in_portfolio);
}

export async function getFeaturedItems(limit = 2): Promise<ArtworkItem[]> {
  const items = await readPortfolioItems();
  return items
    .filter((item) => item.active && item.show_on_home)
    .sort((a, b) => {
      if (a.home_order !== b.home_order) {
        return a.home_order - b.home_order;
      }
      return a.portfolio_order - b.portfolio_order;
    })
    .slice(0, limit);
}
