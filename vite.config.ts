// Two configs in one file:
// • DEV / Lovable preview: uses the Lovable TanStack preset (SSR, HMR, sandbox).
// • PRODUCTION (`bun run build`): emits a flat static SPA into ./dist
//   (no client/ or server/ subfolders) so the contents can be uploaded
//   directly into shared-hosting public_html/.

import { defineConfig as defineLovableConfig } from "@lovable.dev/vite-tanstack-config";
import path from "node:path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import type { ConfigEnv, UserConfig } from "vite";

const lovableConfig = defineLovableConfig();

export default async (env: ConfigEnv): Promise<UserConfig> => {
  // Production build: flat static SPA in dist/
  if (env.command === "build") {
    return {
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
        rollupOptions: {
          // Keep SSR-only Supabase helpers out of the SPA bundle
          external: [
            /\.server\.[tj]sx?$/,
            "@/integrations/supabase/auth-middleware",
            "@/integrations/supabase/client.server",
          ],
        },
      },
    };
  }

  // Dev / preview inside Lovable: delegate to the official preset
  return await (lovableConfig as (env: ConfigEnv) => Promise<UserConfig>)(env);
};
