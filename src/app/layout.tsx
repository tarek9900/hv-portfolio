import type { Metadata } from "next";
import Script from "next/script";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Heidi Vestin",
  description: "Portfolio"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="shortcut icon" type="image/x-icon" href="/images/favicon.ico" />
        <link rel="stylesheet" href="/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/css/nice-select.css" />
        <link rel="stylesheet" href="/css/jquery.fancybox.css" />
        <link rel="stylesheet" href="/css/ionicons.min.css" />
        <link rel="stylesheet" href="/css/core.css" />
        <link rel="stylesheet" href="/css/shortcode/shortcodes.css" />
        <link rel="stylesheet" href="/style.css" />
        <link rel="stylesheet" href="/css/responsive.css" />
      </head>
      <body>
        {children}

        <Script src="/js/vendor/modernizr-2.8.3.min.js" strategy="afterInteractive" />
        <Script src="/js/vendor/jquery-1.12.4.min.js" strategy="beforeInteractive" />
        <Script src="/js/bootstrap.min.js" strategy="afterInteractive" />
        <Script src="/js/popper.js" strategy="afterInteractive" />
        <Script src="/js/owl.carousel.min.js" strategy="afterInteractive" />
        <Script src="/js/slick.min.js" strategy="afterInteractive" />
        <Script src="/js/jquery.nice-select.min.js" strategy="afterInteractive" />
        <Script src="/js/jquery.fancybox.min.js" strategy="afterInteractive" />
        <Script src="/js/slinky.min.js" strategy="afterInteractive" />
        <Script src="/lib/nivo-slider/js/jquery.nivo.slider.js" strategy="afterInteractive" />
        <Script src="/lib/nivo-slider/home.js" strategy="afterInteractive" />
        <Script src="/js/plugins.js" strategy="afterInteractive" />
        <Script src="/js/jquery.mb.YTPlayer.js" strategy="afterInteractive" />
        <Script src="/js/ajax-mail.js" strategy="afterInteractive" />
        <Script src="/js/jquery.ajaxchimp.min.js" strategy="afterInteractive" />
        <Script src="/js/waypoints.min.js" strategy="afterInteractive" />
        <Script src="/js/main.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
