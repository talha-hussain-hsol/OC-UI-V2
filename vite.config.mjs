// vite.config.mjs
import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    define: {
      "process.env.SOME_KEY": JSON.stringify(env.SOME_KEY),
      'process.env': {
        ...env,
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    plugins: [react()],
    css: {
      postcss: {
        plugins: [tailwindcss, autoprefixer],
      },
    },
    server: {
      port: 8002,
      host: '0.0.0.0',
      strictPort: true, // Ensure Vite fails if the port is already in use
      hmr: {
        overlay: false // Disable error overlay if needed
      },
    },
    build: {
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
  };
});
