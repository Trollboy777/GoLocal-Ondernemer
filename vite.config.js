import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/GoLocal-Ondernemer/',  // let op slash aan begin en einde
  plugins: [react()],
})
