import * as path from "path"
import {defineConfig} from "vite"
import {VitePWA} from "vite-plugin-pwa"
import mkcert from "vite-plugin-mkcert"
import sveltePreprocess from "svelte-preprocess"
import {svelte} from "@sveltejs/vite-plugin-svelte"
import {nodePolyfills} from "vite-plugin-node-polyfills"

export default defineConfig({
  server: {
    https: false,
  },
  build: {
    sourcemap: true,
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, "src"),
    },
  },
  plugins: [
    mkcert(),
    nodePolyfills({
      protocolImports: true,
    }),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      manifest: {
        name: process.env.VITE_APP_NAME,
        short_name: process.env.VITE_APP_NAME,
        description: "A place for all to share interests and knowledge.",
        theme_color: "#4512a3",
        icons: [
          {type: "image/png", sizes: "192x192", src: "/images/favicon/192.png"},
          {type: "image/png", sizes: "512x512", src: "/images/favicon/512.png"},
        ],
      },
    }),
    svelte({
      preprocess: sveltePreprocess(),
      onwarn: (warning, handler) => {
        if (warning.code.startsWith("a11y-")) return
        if (warning.filename.includes("node_modules")) return

        handler(warning)
      },
    }),
  ],
})
