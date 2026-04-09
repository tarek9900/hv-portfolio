import { randomUUID } from "node:crypto";
import { ArtworkDetailTemplate, ArtworkDisplayType, ArtworkItem } from "@/lib/types";

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asNumber(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function asBoolean(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value === "true" || value === "1";
  if (typeof value === "number") return value === 1;
  return false;
}

function asTemplate(value: unknown, fallback: ArtworkDetailTemplate): ArtworkDetailTemplate {
  return value === "single" || value === "gallery3" || value === "gallery4" || value === "carousel"
    ? value
    : fallback;
}

function asDisplayType(value: unknown, fallback: ArtworkDisplayType): ArtworkDisplayType {
  return value === "carousel" || value === "single" ? value : fallback;
}

function asColumnLayout(value: unknown, fallback: 1 | 3 | 4): 1 | 3 | 4 {
  const parsed = Number(value);
  return parsed === 4 ? 4 : parsed === 3 ? 3 : parsed === 1 ? 1 : fallback;
}

function asStringArray(value: unknown): string[] {
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

function unique(values: string[]): string[] {
  return Array.from(new Set(values));
}

function slugify(value: string): string {
  const normalized = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || `item-${randomUUID().slice(0, 8)}`;
}

export function buildArtworkPayload(input: Record<string, unknown>, current?: ArtworkItem): ArtworkItem {
  const description = asString(input.description) || current?.description || "";
  const fallbackDisplayType: ArtworkDisplayType = current?.displayType || "single";
  const displayType = asDisplayType(input.displayType, fallbackDisplayType);
  const columnLayout = asColumnLayout(input.columnLayout, current?.columnLayout || 1);

  const explicitMedia = asStringArray(input.media);
  const explicitImages = asStringArray(input.detail_images);
  const media = unique(
    explicitMedia.length > 0
      ? explicitMedia
      : explicitImages.length > 0
        ? explicitImages
        : current?.media?.length
          ? current.media
          : current?.detail_images?.length
            ? current.detail_images
            : []
  );

  const thumbnail = asString(input.thumbnail) || media[0] || current?.thumbnail || "";
  const homeImage = asString(input.home_image) || current?.home_image || "";
  const detailImages = media.length > 0 ? media : thumbnail ? [thumbnail] : [];

  const title = asString(input.title) || current?.title || "Untitled";
  const id = asString(input.id) || current?.id || `item_${randomUUID().slice(0, 8)}`;
  const slug = slugify(asString(input.slug) || current?.slug || title || id);

  const detailTemplate = displayType === "carousel" ? "carousel" : asTemplate(input.detail_template, "single");

  return {
    id,
    slug,
    title,
    description,
    category: asString(input.category) === "sculptures" ? "sculptures" : "drawing",
    media,
    displayType,
    columnLayout,
    thumbnail,
    detail_url: asString(input.detail_url) || current?.detail_url || "#",
    detail_template: detailTemplate,
    detail_images: detailImages,
    portfolio_order: asNumber(input.portfolio_order ?? current?.portfolio_order),
    show_in_portfolio: asBoolean(input.show_in_portfolio ?? current?.show_in_portfolio),
    show_on_home: asBoolean(input.show_on_home ?? current?.show_on_home),
    home_order: asNumber(input.home_order ?? current?.home_order),
    home_image: homeImage,
    home_image_style: asString(input.home_image_style) || current?.home_image_style || "",
    active: asBoolean(input.active ?? current?.active ?? true)
  };
}
