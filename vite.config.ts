import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/eventregi/',
  define: {
    // 設定画面に表示するビルド日時。更新が反映されたか確認するために使う
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // 登録は src/pwa.ts で自前で行う（iOS 向けの更新処理を挟むため）
      injectRegister: null,
      workbox: {
        // 既定のパターンに webp が含まれておらず、お金のイラストが
        // オフラインで表示できなくなるため明示する。会場は電波が悪いことが多い
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
      },
      manifest: {
        name: 'イベントレジ',
        short_name: 'イベントレジ',
        description: '同人誌イベント用レジアプリ',
        theme_color: '#ff6b9d',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
})
