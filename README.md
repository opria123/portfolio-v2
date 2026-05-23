# Senior AI Engineer Portfolio Platform

Cyber-telemetry portfolio starter built with React, Vite, Tailwind CSS, and Framer Motion.

## Architecture

- Frontend: React + Vite static build
- Styling: Tailwind CSS with custom design tokens
- Motion: Framer Motion
- AI Gateway: Cloudflare Worker proxy endpoint
- AI Model: `@cf/meta/llama-3.1-8b-instruct`

## Included Components

- Tachometer page-entry loader with redline behavior
- Hero section and telemetry metric grid
- Interactive systems terminal (`help`, `resume`, `skills`, `sudo rev-engine`)
- Spec-sheet style case-study cards
- Floating `Opria-Bot` panel with SSE streaming client

## Local Development

Install dependencies:

```bash
npm install
```

Run frontend:

```bash
npm run dev
```

Build frontend:

```bash
npm run build
```

## Cloudflare Worker Setup

1. Copy `cloudflare-worker/wrangler.toml.example` to `cloudflare-worker/wrangler.toml`.
2. Update `ALLOWED_ORIGIN` to your deployed site URL.
3. Authenticate Wrangler (`npx wrangler login`).
4. Run locally:

```bash
npm run worker:dev
```

5. Deploy:

```bash
npm run worker:deploy
```

## GitHub Pages Base Path

The Vite base path defaults to `/portfolio-v2/`.

Override if needed:

```bash
VITE_BASE_PATH=/your-repo-name/ npm run build
```

On Windows PowerShell:

```powershell
$env:VITE_BASE_PATH = '/your-repo-name/'; npm run build
```
