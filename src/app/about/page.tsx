export default function AboutPage() {
  return (
    <div className="page-wrap">
      <h1 className="hero-title" style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", marginBottom: "0.4em" }}>
        About
      </h1>
      <div className="hero-copy" style={{ maxWidth: "780px" }}>
        <p className="hero-sub" style={{ marginTop: 0 }}>
          This new Next.js version separates presentation from content, so portfolio updates no longer require editing
          static HTML files. The visual language is intentionally tactile and warm to match the artwork direction.
        </p>
      </div>
    </div>
  );
}
