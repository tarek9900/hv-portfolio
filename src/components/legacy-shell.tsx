import { CSSProperties } from "react";

export function normalizeHref(href: string): string {
  if (!href || href === "#") {
    return "#";
  }

  if (href.startsWith("http://") || href.startsWith("https://")) {
    return href;
  }

  return href.startsWith("/") ? href : `/${href}`;
}

export function inlineImageStyle(style: string): CSSProperties | undefined {
  const raw = style.trim();
  if (!raw) {
    return undefined;
  }

  const widthMatch = raw.match(/width\s*:\s*([^;]+)/i);
  if (widthMatch?.[1]) {
    return { width: widthMatch[1].trim() };
  }

  return undefined;
}

export function LegacyHeader() {
  return (
    <header id="sticky-header" className="header-area header-page homest5">
      <div className="container-fluid pl-30 pr-30">
        <div className="row mega-header">
          <div className="col-lg-4 col-md-3 col-xs-3">
            <div className="logo">
              <a href="/">
                <img
                  srcSet="/images/logo/Logoblackf.svg"
                  style={{ width: "160px" }}
                  alt="Heidi Vestin"
                  src="/images/logo/Logoblackf.svg"
                />
              </a>
            </div>
          </div>
          <div className="col-lg-8 col-md-9 d-none d-lg-block">
            <div className="main-menu-middel">
              <nav id="primary-menu" className="show-menu">
                <ul className="main-menu text-right">
                  <li>
                    <a href="/portfolio">Portfolio</a>
                  </li>
                  <li>
                    <a href="/contact.html">Contact</a>
                  </li>
                </ul>
              </nav>
              <div className="top-right-btn pull-right">
                <button className="menu-toggle" type="button">
                  <i className="icon ion-md-menu" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export function LegacySearchPanel() {
  return (
    <div className="main-search-active">
      <div className="sidebar-search-icon">
        <button className="search-close" type="button">
          <span className="icon ion-md-close" />
        </button>
      </div>
      <div className="sidebar-search-input">
        <form>
          <div className="form-search">
            <input id="search" className="input-text" defaultValue="" placeholder="Search Your Keyword" type="search" />
            <button type="submit">
              <i className="icon ion-md-search" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function LegacyFooter() {
  return (
    <footer className="footer-area compact-footer">
      <div className="copyright-area text-center">
        <div className="container-fluid pl-100 pr-100">
          <div className="footer-text">
            <span className="footer-links">
              <a href="https://www.tiktok.com/@heidivestin">
                <img
                  srcSet="/images/icons/tiktok-svgrepo-com.svg"
                  src="/images/icons/tiktok-svgrepo-com.svg"
                  alt=""
                />
              </a>
              <a href="https://www.instagram.com/heidi_vestin/">
                <img
                  srcSet="/images/icons/instagram-svgrepo-com.svg"
                  src="/images/icons/instagram-svgrepo-com.svg"
                  alt=""
                />
              </a>
            </span>
            <span className="footer-copy">
              Copyright&copy;
              Heidi Vestin
              . All right reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
