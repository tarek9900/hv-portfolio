# Heidi Next Site (Legacy HTML Refactor)

This Next.js app keeps the original Heidi website design and refactors the HTML into valid React/Next syntax.

## What is preserved

- Original visual style and layout from legacy HTML
- Original CSS/JS theme assets (`/css`, `/js`, `/lib`, `/style.css`)
- Original detail pages available as static `.html` files in `public/`

## What is modernized

- Home and Portfolio are rendered by Next.js pages
- Detail pages are dynamic at `/portfolio/[slug]`
- Reusable detail templates:
  - `single`
  - `gallery3`
  - `carousel`
- Portfolio data is read/written from `../data/portfolio-items.json`
- Admin panel at `/admin` can manage artworks, template type, detail image lists, and uploads

## Run

```bash
cd /Users/tarek/Documents/Heidi/Heidi-website-v2/next-site
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

- `NEXT_ADMIN_PASSWORD` for `/admin` login
- Optional `PORTFOLIO_DATA_PATH` to override default JSON path
