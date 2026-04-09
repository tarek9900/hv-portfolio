import { normalizeImagePath } from "@/lib/portfolio-store";

type CarouselDetailProps = {
  title: string;
  images: string[];
};

export function CarouselDetail({ title, images }: CarouselDetailProps) {
  return (
    <div className="portfolio-area ptb-100" style={{ paddingBottom: "100px" }}>
      <div className="container">
        <div className="pro-details-active owl-carousel carousel-style-two">
          {images.map((image, index) => (
            <div key={`${image}-${index}`} className="pro-details-images">
              <img src={normalizeImagePath(image)} alt={`${title} ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
