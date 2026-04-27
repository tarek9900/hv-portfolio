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

## CI/CD to VPS (MicroK8s)

Deployment files are in `k8s/`:
- `k8s/namespace.yaml`
- `k8s/deployment.yaml`
- `k8s/service.yaml`
- `k8s/ingress.yaml`

GitHub Actions workflows:
- `.github/workflows/ci.yml` (typecheck + build)
- `.github/workflows/deploy-microk8s.yml` (build image, push to Repoflow, deploy on VPS)

### VPS prerequisites

Run once on the VPS:

```bash
sudo snap install microk8s --classic
sudo microk8s status --wait-ready
sudo microk8s enable dns ingress
sudo mkdir -p /var/snap/microk8s/common/heidi/data
sudo mkdir -p /var/snap/microk8s/common/heidi/uploads
```

### Required GitHub Secrets

Set these in repository settings:
- `CLUSTER_IP` (Repository variable)
- `CLUSTER_SSH_KEY` (Repository secret, private key content for user `github-actions`)
- `NEXT_ADMIN_PASSWORD`
- `REPOFLOW_TOKEN` (registry token)

### Domain / ingress

Update host in `k8s/ingress.yaml`:
- replace `heidi.example.com` with your real domain
- point your DNS `A` record to the VPS public IP
