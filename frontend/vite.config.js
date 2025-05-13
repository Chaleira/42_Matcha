import { defineConfig } from "vite";
import path from "path";
import typeComposerPlugin from "typecomposer-plugin";


//export function ForceChunkPlugin() {
//  return {
//    name: 'force-chunk-plugin',
//    apply: 'build',
//    async resolveDynamicImport(source, importer) {
//      const resolved = await this.resolve(source, importer);
//      if (resolved) {
//      this.emitFile({
//        type: 'chunk',
//        id: resolved.id,
//      });
//      return resolved.id;
//    }},
//  };
//}

export default defineConfig({
  plugins: [typeComposerPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
      },
    },
  },
});
