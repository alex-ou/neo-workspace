import module from "module";
import { defineConfig } from "vite";
import pkg from "../../package.json";

export default defineConfig({
  root: __dirname,
  esbuild: {
    drop: process.env.NODE_ENV === "production" ? ["console", "debugger"] : [],
  },
  plugins: [],
  build: {
    outDir: "../../dist/main",
    emptyOutDir: true,
    minify: process.env./* from mode option */ NODE_ENV === "production",
    sourcemap: false,

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
