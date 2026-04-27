// Two configs in one file:
// • DEV / Lovable preview: uses the Lovable TanStack preset (SSR, HMR, sandbox).
// • PRODUCTION (`bun run build`): emits a flat static SPA into ./dist
//   (no client/ or server/ subfolders) so the contents can be uploaded
//   directly into shared-hosting public_html/.

import { defineConfig as defineLovableConfig } from "@lovable.dev/vite-tanstack-config";
import { defineConfig } from "vite";
import path from "node:path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

export default ({ command }: { command: "build" | "serve" }) => {
  // Production build: flat static SPA in dist/
  if (command === "build") {
    return defineConfig({
      plugins: [
        tsConfigPaths(),
        tanstackRouter({
          target: "react",
          autoCodeSplitting: true,
          routesDirectory: "./src/routes",
          generatedRouteTree: "./src/routeTree.gen.ts",
        }),
        react(),
        tailwindcss(),
      ],
      resolve: {
        alias: { "@": path.resolve(__dirname, "./src") },
      },
      build: {
        outDir: "dist",
        emptyOutDir: true,
        sourcemap: false,
        // Prevent the SSR-only Supabase helpers from being pulled into the SPA bundle
        rollupOptions: {
          external: [
            /\.server\.[tj]sx?$/,
            "@/integrations/supabase/auth-middleware",
            "@/integrations/supabase/client.server",
          ],
        },
      },
    });
  }

  // Dev / preview inside Lovable: keep the official preset
  return defineLovableConfig();
};
