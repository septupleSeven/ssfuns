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
    css: {
        preprocessorOptions: {
          scss: {
            api: "modern",
            additionalData: `
                @use "./utils" as *;
                @use "./reset" as *;
            `
          }
        }
      },
      base:"/ssfuns/"
    // css: {
    //     preprocessorOptions: {
    //         scss: {
    //             additionalData: `
    //             @import "./variables";
    //             @import "material-icons/iconfont/material-icons.css";
    //             `
    //         }
    //     }
    // }
    // plugins: [ vitePluginGLSL() ]
})
