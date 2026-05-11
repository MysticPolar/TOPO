import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,
    // true = listen on 0.0.0.0 so http://localhost:3000/ and LAN both work
    host: true,
    open: true,
    // Allow Cloudflare quick tunnels (trycloudflare.com) and other dev hostnames for phone preview.
    allowedHosts: true,
    // Fast Refresh + HMR are on by default (@vitejs/plugin-react). Do not pin hmr.host to "localhost"
    // or LAN previews (http://192.168.x.x:3000) would break the WebSocket client.
    watch: {
      // Avoid reload churn from the separate Expo wrapper project
      ignored: ["**/expo-app/**", "**/node_modules/**"],
    },
  },
  preview: {
    port: 3000,
    strictPort: true,
    host: true,
  },
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
