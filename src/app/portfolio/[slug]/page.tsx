import { notFound } from "next/navigation";
import {
  CarouselDetail,
  FourColumnGalleryDetail,
  SinglePhotoDetail,
  ThreeColumnGalleryDetail
} from "@/components/detail-templates";
import { LegacyFooter, LegacyHeader, LegacySearchPanel } from "@/components/legacy-shell";
import { readPortfolioItems } from "@/lib/portfolio-store";
import type { ArtworkItem } from "@/lib/types";

type DetailPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ filter?: string }>;
};

function filterBackHref(filter: string | undefined): string {
  if (filter === "drawing" || filter === "sculptures") {
    return `/portfolio?filter=${filter}`;
  }
  return "/portfolio";
}

function renderTemplate(item: ArtworkItem) {
  const images = item.detail_images.length > 0 ? item.detail_images : item.thumbnail ? [item.thumbnail] : [];

  if (item.detail_template === "carousel") {
    return <CarouselDetail title={item.title} images={images} />;
  }

  if (item.detail_template === "gallery3") {
    return <ThreeColumnGalleryDetail title={item.title} images={images} />;
  }

  if (item.detail_template === "gallery4") {
    return <FourColumnGalleryDetail title={item.title} images={images} />;
  }

  return <SinglePhotoDetail title={item.title} images={images} />;
}

export default async function PortfolioDetailPage({ params, searchParams }: DetailPageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const items = await readPortfolioItems();
  const item = items.find((entry) => entry.slug === decodeURIComponent(slug));

  if (!item) {
    notFound();
  }

  return (
    <div className="wrapper site-shell">
      <LegacyHeader />
      <LegacySearchPanel />

      <main className="site-main">
        <div className="container" style={{ paddingTop: "28px" }}>
          <div style={{ marginBottom: "14px" }}>
            <a href={filterBackHref(query.filter)} style={{ fontSize: "15px" }}>
              ← Back to portfolio
            </a>
          </div>
        </div>

        {renderTemplate(item)}
      </main>

      <LegacyFooter />
    </div>
  );
}
