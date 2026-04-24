import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // 基础配置
  base: './',
  
  // 构建配置
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    
    // 代码分割
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        // 代码分割策略
        manualChunks: {
          // 第三方库分离
          'vendor-leaflet': ['leaflet'],
          'vendor-openlayers': ['ol'],
          'vendor-chart': ['chart.js'],
          'vendor-vis': ['vis-network'],
        },
        // 资源文件命名
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          
          if (/\.(css)$/i.test(assetInfo.name)) {
            return 'assets/css/[name]-[hash][extname]';
          }
          
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(assetInfo.name)) {
            return 'assets/images/[name]-[hash][extname]';
          }
          
          if (/\.(woff2?|ttf|otf|eot)$/i.test(assetInfo.name)) {
            return 'assets/fonts/[name]-[hash][extname]';
          }
          
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
    
    // 压缩配置
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    
    // 源映射
    sourcemap: false,
    
    // 资源内联限制
    assetsInlineLimit: 4096,
  },
  
  // 开发服务器配置
  server: {
    port: 3000,
    open: true,
    cors: true,
    
    // 代理配置（用于开发环境）
    proxy: {
      '/api': {
        target: 'http://localhost:8001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  
  // 预览配置
  preview: {
    port: 5000,
    open: true,
  },
  
  // 路径解析
  resolve: {
    alias: {
      '@': resolve(__dirname, 'assets'),
      '@js': resolve(__dirname, 'assets/js'),
      '@css': resolve(__dirname, 'assets/css'),
      '@modules': resolve(__dirname, 'assets/js/modules'),
    },
  },
  
  // CSS配置
  css: {
    devSourcemap: true,
    
    // PostCSS配置
    postcss: {
      plugins: [
        require('autoprefixer'),
        require('cssnano')({
          preset: ['default', {
            discardComments: { removeAll: true },
          }],
        }),
      ],
    },
  },
  
  // 插件
  plugins: [
    // 可以在这里添加自定义插件
  ],
  
  // 优化依赖
  optimizeDeps: {
    include: [
      'leaflet',
      'ol',
      'chart.js',
      'vis-network',
    ],
  },
});
