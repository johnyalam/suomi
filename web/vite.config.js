import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

// Builds one self-contained dist/index.html (JS and CSS inlined),
// so the app can be opened straight from the file system or hosted anywhere.
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  base: "./",
});
