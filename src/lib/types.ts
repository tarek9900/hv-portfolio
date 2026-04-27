export type ArtworkCategory = "drawing" | "sculptures";
export type ArtworkDetailTemplate = "single" | "gallery3" | "gallery4" | "carousel";
export type ArtworkDisplayType = "single" | "carousel";
export type ArtworkColumnLayout = 1 | 3 | 4;

export interface ArtworkItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: ArtworkCategory;
  media: string[];
  displayType: ArtworkDisplayType;
  columnLayout: ArtworkColumnLayout;
  hero_image: string;
  thumbnail: string;
  detail_url: string;
  detail_template: ArtworkDetailTemplate;
  detail_images: string[];
  portfolio_order: number;
  show_in_portfolio: boolean;
  show_on_home: boolean;
  home_order: number;
  home_image: string;
  home_image_style: string;
  active: boolean;
}
