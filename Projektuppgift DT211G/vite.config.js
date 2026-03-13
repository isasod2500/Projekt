import { defineConfig } from "vite";
import { resolve } from "path";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

export default defineConfig({
    css: {
        devSourcemap: true
    },

    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                inspiration: resolve(__dirname, "inspiration.html"),
                about: resolve(__dirname, "about.html"),
                JSDoc: resolve(__dirname, "out/JSDoc.html"),
            }
        }
    },
    plugins: [
        ViteImageOptimizer({
            png: {
                quality: 75
            },
            svg: {
                quality: 75
            }
        })
    ]
})