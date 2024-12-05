import { defineConfig } from 'vite'
// import vitePluginGLSL from 'vite-plugin-glsl'

// https://vite.dev/config/
export default defineConfig({
    root: "src",
    publicDir: "../public",
    build: {
        outDir: "../dist",
        emptyOutDir: true
    },
    // plugins: [ vitePluginGLSL() ]
})
