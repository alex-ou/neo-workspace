import module from "module";
import { defineConfig } from "vite";
import pkg from "../../package.json";

export default defineConfig({
  root: __dirname,
  plugins: [],
  build: {
    outDir: "../../dist/main",
    emptyOutDir: true,
    minify: process.env./* from mode option */ NODE_ENV === "production",
    sourcemap: true,
    lib: {
      entry: "index.ts",
      formats: ["cjs", "es"],
      fileName: "index",
    },
    rollupOptions: {
      external: [
        "electron",
        ...module.builtinModules,
        ...module.builtinModules.map((e) => `node:${e}`),
        ...Object.keys(pkg.dependencies || {}),
      ],
    },
  },
});
