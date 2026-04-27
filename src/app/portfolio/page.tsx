import { LegacyFooter, LegacyHeader, LegacySearchPanel } from "@/components/legacy-shell";
import { artworkDetailPath, getPortfolioItems, normalizeImagePath } from "@/lib/portfolio-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type FilterValue = "all" | "drawing" | "sculptures";

function normalizeFilter(value: string | undefined): FilterValue {
  if (value === "drawing" || value === "sculptures") {
    return value;
  }
  return "all";
}

function portfolioFilterHref(filter: FilterValue): string {
  if (filter === "all") {
    return "/portfolio?filter=all";
  }
  return `/portfolio?filter=${filter}`;
}

function detailHrefWithFilter(href: string, filter: FilterValue): string {
  if (filter === "all") {
    return href;
  }
  const separator = href.includes("?") ? "&" : "?";
  return `${href}${separator}filter=${filter}`;
}

export default async function PortfolioPage({
  searchParams
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const params = await searchParams;
  const activeFilter = normalizeFilter(params.filter);
  const items = await getPortfolioItems();
  const filteredItems =
    activeFilter === "all" ? items : items.filter((item) => item.category === activeFilter);

  return (
    <div className="wrapper site-shell">
      <LegacyHeader />
      <LegacySearchPanel />

      <main className="site-main">
        <div className="portfolio-area ptb-100">
          <div className="container">
            <div className="pro-cat-list text-center" style={{ fontSize: "17px" }}>
              <a
                href={portfolioFilterHref("all")}
                className={`portfolio-filter-link ${activeFilter === "all" ? "is-checked" : ""}`}
              >
                All
              </a>
              <a
                href={portfolioFilterHref("drawing")}
                className={`portfolio-filter-link ${activeFilter === "drawing" ? "is-checked" : ""}`}
              >
                Drawings &amp; Collages
              </a>
              <a
                href={portfolioFilterHref("sculptures")}
                className={`portfolio-filter-link ${activeFilter === "sculptures" ? "is-checked" : ""}`}
              >
                Sculptures
              </a>
            </div>

            <div className="portfolio-grid three-column hover-st2">
              {filteredItems.map((item) => {
                const detailHref = detailHrefWithFilter(artworkDetailPath(item), activeFilter);
                return (
                  <div
                    key={item.id}
                    className={`single-item ${item.category === "sculptures" ? "cat-sculptures" : "cat-drawing"}`}
                  >
                    <div className="pro-img">
                      <a href={detailHref}>
                        <img src={normalizeImagePath(item.hero_image || item.thumbnail || item.media?.[0] || "")} alt={item.title} />
                      </a>
                    </div>
                    <div className="pro-content-hover">
                      <h3>
                        <a href={detailHref}>{item.title || "Untitled"}</a>
                      </h3>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <LegacyFooter />
    </div>
  );
}
