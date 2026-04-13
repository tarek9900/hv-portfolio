import { normalizeImagePath } from "@/lib/portfolio-store";

type ThreeColumnGalleryDetailProps = {
  title: string;
  images: string[];
};

export function ThreeColumnGalleryDetail({ title, images }: ThreeColumnGalleryDetailProps) {
  const fancyboxGroup = `gallery-${title || "project"}`;

  return (
    <div className="portfolio-area ptb-80" style={{ paddingBottom: "100px" }}>
      <div className="container">
        <div className="iamge-loaded-active margin-minus-7 three-column hover-st3 fix">
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
