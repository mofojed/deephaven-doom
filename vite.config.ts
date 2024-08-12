import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const packagesDir = env.DHC_PACKAGES_PATH;
  const useDhcPackages = env.USE_DHC_PACKAGES === "true";

  return {
    plugins: [react()],
    base: "/deephaven-doom/",
    resolve: {
      alias: useDhcPackages
        ? [
            {
              find: /^@deephaven\/(.*)\/scss\/(.*)/,
              replacement: `${packagesDir}/$1/scss/$2`,
            },
            {
              find: /^@deephaven\/icons$/,
              replacement: `${packagesDir}/icons/dist/index.js`,
            },
            {
              find: /^@deephaven\/(.*)/,
              replacement: `${packagesDir}/$1/src`,
            },
          ]
        : [],
    },
  };
});
