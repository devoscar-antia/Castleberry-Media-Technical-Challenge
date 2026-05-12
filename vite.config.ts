import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: [
      '@capacitor/push-notifications',
      '@capacitor/local-notifications',
      '@capacitor/preferences',
      '@mozartec/capacitor-microphone',
      '@tanstack/react-query',
      '@tanstack/react-query-persist-client',
      '@tanstack/query-sync-storage-persister',
      '@sentry/react',
    ]
  },
  build: {
    // Improve long-term caching: split big vendors into stable chunks so a small
    // app change doesn't bust the entire 260 KB bundle.
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (!id.includes('node_modules')) return undefined;
          // Keep React + anything that imports it directly in the main bundle
          // to avoid dual-React issues across split chunks.
          if (
            id.includes('/react/') ||
            id.includes('/react-dom/') ||
            id.includes('/scheduler/') ||
            id.includes('react-router') ||
            id.includes('@tanstack') ||
            id.includes('@sentry')
          ) {
            return undefined;
          }
          if (id.includes('@supabase')) return 'supabase';
          if (id.includes('@radix-ui')) return 'radix';
          if (id.includes('lucide-react')) return 'icons';
          if (id.includes('date-fns')) return 'date';
          if (id.includes('framer-motion')) return 'motion';
          return 'vendor';
        },
      },
    },
    // Slightly larger inline limit reduces tiny request waterfalls
    chunkSizeWarningLimit: 800,
  },
}));
