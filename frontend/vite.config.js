import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/Blood-Donor-Portal/', // <-- Add this line!
  server: {
    port: 5173
  }
});