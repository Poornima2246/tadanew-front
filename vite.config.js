import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/', 
  plugins: [
    react(),
     tailwindcss( {
      config: './tailwind.config.js',
      apply: 'build',
      content: [
        './src/**/*.{js,jsx,ts,tsx}',
        './public/index.html',
        
      ],  
      use: ['style-loader', 'css-loader'],

     }),
  ],
})

 