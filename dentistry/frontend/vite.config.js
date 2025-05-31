import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 3000,
    watch: {
      usePolling: true,
    },
    // proxy: {
    //   '/auth': 'http://backend:8000',
    // }
  },
  build: {
    sourcemap: false
  }
});
