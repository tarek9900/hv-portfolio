import { normalizeImagePath } from "@/lib/portfolio-store";
import type { ArtworkColumnLayout } from "@/lib/types";

type CarouselDetailProps = {
  title: string;
  images: string[];
  columnLayout?: ArtworkColumnLayout;
};

export function CarouselDetail({ title, images, columnLayout = 3 }: CarouselDetailProps) {
  const columnClass = columnLayout === 4 ? "four-column" : "three-column";
  const fancyboxGroup = `gallery-${title || "project"}`;

  return (
    <div className="portfolio-area ptb-80" style={{ paddingBottom: "100px" }}>
      <div className="container">
        <div className={`iamge-loaded-active margin-minus-7 ${columnClass} hover-st3 fix`}>
          {images.map((image, index) => (
            <div key={`${image}-${index}`} className="single-item">
              <div className="pro-img">
                <a data-fancybox={fancyboxGroup} href={normalizeImagePath(image)}>
                  <img src={normalizeImagePath(image)} alt={`${title} ${index + 1}`} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
