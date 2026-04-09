import { artworkDetailPath, getFeaturedItems, getPortfolioItems, normalizeImagePath } from "@/lib/portfolio-store";
import { LegacyFooter, LegacyHeader, LegacySearchPanel, inlineImageStyle } from "@/components/legacy-shell";

export default async function HomePage() {
  const [featured, portfolio] = await Promise.all([getFeaturedItems(2), getPortfolioItems()]);

  const selected = [...featured];
  if (selected.length < 2) {
    for (const item of portfolio) {
      if (!selected.some((existing) => existing.id === item.id)) {
        selected.push(item);
      }
      if (selected.length === 2) {
        break;
      }
    }
  }

  const first = selected[0];
  const second = selected[1];

  return (
    <div className="wrapper site-shell">
      <LegacyHeader />
      <LegacySearchPanel />

      <main className="site-main">
        <div className="container-fluid pl-30 pr-30 iamge-loaded-active hover-st3 homest5 pb-70">
          <div className="row">
            {first ? (
              <div className="col-lg-8 col-md-6 mas-item">
                <div className="single-item">
                  <div className="pro-img">
                    <a href={artworkDetailPath(first)}>
                      <img src={normalizeImagePath(first.home_image || first.thumbnail)} alt={first.title} />
                    </a>
                  </div>
                </div>
              </div>
            ) : null}

            {second ? (
              <div className="col-lg-4 col-md-6 mas-item">
                <div className="single-item">
                  <div className="pro-img">
                    <a href={artworkDetailPath(second)}>
                      <img
                        src={normalizeImagePath(second.home_image || second.thumbnail)}
                        style={inlineImageStyle(second.home_image_style)}
                        alt={second.title}
                      />
                    </a>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </main>

      <LegacyFooter />
    </div>
  );
}
