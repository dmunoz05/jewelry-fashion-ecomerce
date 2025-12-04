import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import clerk from "@clerk/astro";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [clerk(), react()],
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
});

