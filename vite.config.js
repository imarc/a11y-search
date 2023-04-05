import { defineConfig } from "vite"

export default defineConfig({
    build: {
        manifest: true,
        outDir: 'web/dist',
        assetsDir: '.',
    }
})