import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isHorary = mode === "horary";
  return {
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    {
      name: "html-site-brand",
      transformIndexHtml(html) {
        if (!isHorary) return html;
        return html
          .replace(
            "<title>Peak — Realise your Peak Potential</title>",
            "<title>PeakLife Horary - One question. One number. A verdict.</title>",
          )
          .replace(
            'content="Peak is an AI astrology platform built from India. Hour-by-hour guidance, long-term pattern mapping, and goal-bound advice grounded in jyotisha — not mysticism."',
            'content="PeakLife Horary is a KP horary astrology app. No birth chart needed. Ask one question, pick a number from 1 to 249, and get a clear verdict."',
          );
      },
    },
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
      },
    },
  },
};
});
