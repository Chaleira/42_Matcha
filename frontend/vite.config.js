import { defineConfig } from "vite";
import typeComposerPlugin from "typecomposer-plugin";

export default defineConfig({
  plugins: [typeComposerPlugin()],
});
