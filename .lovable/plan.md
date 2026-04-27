# Goal

Make `bun run build` produce a **flat static site** in `dist/` — no `client/` or `server/` subfolders — so you can copy everything inside `dist/` straight into `public_html/` on your shared hosting and have the full site (including `/admin`) work.

# Current situation

- The project uses **TanStack Start** which builds an SSR app for Cloudflare Workers. That's why you see `dist/client/` (browser assets) and `dist/server/` (worker code) after a build.
- Good news: looking through your code, **no route uses server functions or server-side loaders**. Every page (home, services, team, profile, admin, etc.) talks to Lovable Cloud directly from the browser via the Supabase JS client.
- That means the app can run as a pure **client-side SPA** with zero functionality loss. Admin panel, auth, team CRUD, address edits — all of it already runs client-side.

# Plan

### 1. Switch Vite to a static SPA build
Update `vite.config.ts` to override the Lovable TanStack preset so it:
- Disables SSR / Cloudflare Worker output (no more `dist/server`)
- Emits a single `index.html` + hashed assets directly into `dist/` (no `dist/client` subfolder)
- Sets `outDir: "dist"` and `emptyOutDir: true`
- Configures the TanStack Router plugin in **SPA mode** so client-side routing handles every URL

The result: after `bun run build`, `dist/` will contain:
```
dist/
  index.html
  favicon.png
  .htaccess
  assets/
    index-XXXX.js
    index-XXXX.css
    ...
```

### 2. Adjust the root route for SPA rendering
`src/routes/__root.tsx` currently uses `shellComponent` with `<html>`/`<body>` tags — that's an SSR pattern. For a static SPA we'll:
- Keep `head()` (titles & meta still work via TanStack Router's head manager)
- Remove the `shellComponent` wrapper (the `<html>` shell will live in a real `index.html` that Vite emits)
- Add a small `index.html` template at the project root that Vite uses as the SPA entry, with a `<div id="root">` and `<script type="module" src="/src/main.tsx">`
- Add a tiny `src/main.tsx` that bootstraps the router with `RouterProvider` and `createRoot` (the standard SPA entry that Lovable's preset normally hides)

### 3. Keep `.htaccess` for deep-link routing
Your existing `public/.htaccess` already redirects unknown paths to `index.html`. Vite copies `public/` contents into `dist/` automatically, so after the build it will sit right next to `index.html` — perfect for Apache/cPanel/shared hosting. Deep links like `/admin`, `/team/aria-chen`, `/services` will all work after a refresh.

### 4. Remove unused server-side files (optional cleanup)
- `src/integrations/supabase/auth-middleware.ts` and `src/integrations/supabase/client.server.ts` are SSR-only and never imported by any route. They'll just be dead code in a SPA build — safe to leave, but I'll exclude them from the bundle so they don't cause build warnings.
- `wrangler.jsonc` becomes irrelevant for static hosting (it's only used when deploying to Cloudflare). I'll leave it untouched so nothing else breaks.

### 5. Verify with a production build
Run `bun run build` and confirm:
- `dist/` contains `index.html`, `favicon.png`, `.htaccess`, and a single `assets/` folder
- No `dist/client` or `dist/server` directories
- Open `dist/index.html` via a simple static server and check `/`, `/team`, `/admin` all load

# What this means for you

✅ Upload the **contents of `dist/`** to `public_html/` — done.  
✅ Admin panel works (it's purely client-side; auth via Lovable Cloud over HTTPS).  
✅ Deep links and refresh work thanks to `.htaccess`.  
⚠️ The Lovable preview here will keep working the same way — only the production build output changes.  
⚠️ If in the future you add a server function or SSR loader, it won't run on a static host. For now, nothing in the project needs that.

# Files to edit / create

- **edit** `vite.config.ts` — disable SSR, set flat `dist/` output, configure router plugin for SPA
- **edit** `src/routes/__root.tsx` — drop `shellComponent`, keep head/meta
- **create** `index.html` (project root) — SPA HTML entry
- **create** `src/main.tsx` — client bootstrap with `RouterProvider`
- **keep as-is** `public/.htaccess`, all route files, all components, Supabase client
