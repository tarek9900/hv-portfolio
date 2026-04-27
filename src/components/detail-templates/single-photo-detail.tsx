import { normalizeImagePath } from "@/lib/portfolio-store";

type SinglePhotoDetailProps = {
  title: string;
  images: string[];
};

export function SinglePhotoDetail({ title, images }: SinglePhotoDetailProps) {
  const primary = images[0];
  const fancyboxGroup = `gallery-${title || "project"}`;

  if (!primary) {
    return null;
  }

  return (
    <div className="portfolio-area ptb-80" style={{ paddingBottom: "100px" }}>
      <div className="container">
        <div className="single-item">
          <div className="pro-img">
            <a data-fancybox={fancyboxGroup} href={normalizeImagePath(primary)}>
              <img src={normalizeImagePath(primary)} alt={title} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
