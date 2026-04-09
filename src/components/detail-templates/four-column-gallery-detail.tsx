import { normalizeImagePath } from "@/lib/portfolio-store";

type FourColumnGalleryDetailProps = {
  title: string;
  images: string[];
};

export function FourColumnGalleryDetail({ title, images }: FourColumnGalleryDetailProps) {
  return (
    <div className="portfolio-area ptb-100" style={{ paddingBottom: "100px" }}>
      <div className="container">
        <div className="masonry-wrap-active iamge-loaded-active image-loaded-active margin-minus-7 four-column">
          {images.map((image, index) => (
            <div key={`${image}-${index}`} className="single-item">
              <div className="pro-img">
                <img src={normalizeImagePath(image)} alt={`${title} ${index + 1}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
