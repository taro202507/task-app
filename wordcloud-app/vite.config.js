import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/task-app/wordcloud-app/",
  plugins: [react()],
});
