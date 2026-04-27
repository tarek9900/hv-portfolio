import Link from "next/link";
import { ArtworkItem } from "@/lib/types";
import { normalizeImagePath } from "@/lib/portfolio-store";

type ArtCardProps = {
  item: ArtworkItem;
  showCategory?: boolean;
};

export function ArtCard({ item, showCategory = true }: ArtCardProps) {
  const imageSource = normalizeImagePath(item.thumbnail || item.home_image);
  const detailHref = "/portfolio";

  return (
    <article className="art-card">
      <Link href={detailHref} className="art-media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="art-image" src={imageSource} alt={item.title} loading="lazy" />
      </Link>
      <div className="art-meta">
        <h3 className="art-title">{item.title || "Untitled"}</h3>
        {showCategory ? (
          <span className="art-category">{item.category === "sculptures" ? "Sculptures" : "Drawing"}</span>
        ) : null}
      </div>
    </article>
  );
}
