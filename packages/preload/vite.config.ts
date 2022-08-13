import { join } from "path";
import module from "module";
import { defineConfig } from "vite";
import pkg from "../../package.json";

export default defineConfig({
  root: __dirname,
  build: {
    outDir: "../../dist/preload",
    emptyOutDir: true,
    minify: process.env.NODE_ENV === "production",
    sourcemap: false,
    rollupOptions: {
      input: {
        // multiple entry
        index: join(__dirname, "index.ts"),
      },
      output: {
        format: "cjs",
        entryFileNames: "index.cjs",
        manualChunks: {},
      },
      external: [
        "electron",
        ...module.builtinModules,
        ...Object.keys(pkg.dependencies || {}),
      ],
    },
  },
});
