import { defineConfig } from 'vite'
// 支持 vue
import vue from '@vitejs/plugin-vue'
// 支持 jsx
import vueJsx from '@vitejs/plugin-vue-jsx'
// 压缩
import { compression } from 'vite-plugin-compression2'
// 生成类型声明
import dts from 'vite-plugin-dts'
import { resolve } from 'path'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isLib = mode === 'lib'

  return {
    plugins: [
      vue({
        script: {
          defineModel: true
        }
      }),
      vueJsx(),
      compression(),
      ...(isLib ? [dts({
        // 指定使用的 tsconfig.json
        tsconfigPath: './tsconfig.lib.json',
        // 确保生成声明文件
        include: [
          'src/index.ts',
          'src/types/**/*.ts',
          'src/utils/**/*.ts',
          'src/composables/**/*.ts',
          'src/**/*.d.ts', 
          'src/**/*.tsx', 
          'src/components/**/*.vue',
          'src/extensions/**/*.vue',
          'src/composables/**/*.vue',
          'src/utils/**/*.vue',
          'src/types/**/*.vue'
        ],
        exclude: ['src/App.vue', 'src/Demo.vue', 'src/**/*.demo.vue', 'src/**/*.test.vue'],
        // 过滤掉App.vue和Demo.vue相关的声明文件
        beforeWriteFile: (filePath, content) => {
          if (filePath.includes('App.vue') || filePath.includes('Demo.vue') || filePath.includes('demo.vue')) {
            return false
          }
          return { filePath, content }
        },
        // 输出目录
        outDir: 'dist',
        // 静态导入 vue 文件
        staticImport: true,
        // 禁用合并声明文件
        rollupTypes: false,
        // 生成类型声明入口
        entryRoot: 'src',
        insertTypesEntry: true,
        copyDtsFiles: true,
        compilerOptions: {
          preserveSymlinks: false,
          skipLibCheck: true
        },
        logLevel: 'info'
      })] : [])
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    worker: {
      format: 'es'
    },
    
    // 非库模式的构建配置
    ...(!isLib && {
      build: {
        rollupOptions: {
          output: {
            manualChunks: {
              // 将Vue相关库分离
              vue: ['vue'],
              // 将TipTap核心库分离
              'tiptap-core': [
                '@tiptap/core',
                '@tiptap/vue-3',
                '@tiptap/starter-kit'
              ],
              // 将TipTap扩展分离
              'tiptap-extensions': [
                '@tiptap/extension-blockquote',
                '@tiptap/extension-bold',
                '@tiptap/extension-bullet-list',
                '@tiptap/extension-code',
                '@tiptap/extension-code-block',
                '@tiptap/extension-color',
                '@tiptap/extension-heading',
                '@tiptap/extension-highlight',
                '@tiptap/extension-image',
                '@tiptap/extension-italic',
                '@tiptap/extension-link',
                '@tiptap/extension-list-item',
                '@tiptap/extension-ordered-list',
                '@tiptap/extension-strike',
                '@tiptap/extension-table',
                '@tiptap/extension-table-cell',
                '@tiptap/extension-table-header',
                '@tiptap/extension-table-row',
                '@tiptap/extension-task-item',
                '@tiptap/extension-task-list',
                '@tiptap/extension-text-align',
                '@tiptap/extension-text-style',
                '@tiptap/extension-underline'
              ],
              // 将ProseMirror相关库分离
               'prosemirror': [
                 'prosemirror-model',
                 'prosemirror-state',
                 'prosemirror-view'
               ],
              // 将工具库分离
              'utils': [
                '@floating-ui/vue',
                '@vueuse/core'
              ]
            }
          }
        },
        chunkSizeWarningLimit: 600
      }
    }),
    
    // 库模式的构建配置
    ...(isLib && {
      build: {
        // 清空输出目录
        emptyOutDir: true,
        // 明确指定压缩方式
        minify: 'terser',
        sourcemap: true,
        target: 'es2015',
        lib: {
          entry: resolve(fileURLToPath(new URL('.', import.meta.url)), 'src/index.ts'),
          name: 'GeelatoLiteEditor',
          fileName: (format) => `geelato-lite-editor.${format}.js`,
          formats: ['es', 'umd']
        },
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
            dead_code: true,
            unused: true,
            conditionals: true,
            evaluate: true,
            booleans: true,
            loops: true,
            if_return: true,
            join_vars: true,
            collapse_vars: true,
            reduce_vars: true,
            warnings: false,
            negate_iife: true,
            pure_getters: true,
            keep_fargs: false,
            keep_fnames: false,
            passes: 2
          },
          mangle: {
            safari10: true,
            toplevel: true,
            keep_fnames: false,
            reserved: []
          },
          format: {
            comments: false,
            beautify: false,
            semicolons: true,
            preserve_annotations: false
          }
        },
        rollupOptions: {
          external: [
            'vue',
            '@tiptap/core',
            '@tiptap/vue-3',
            '@tiptap/starter-kit',
            '@tiptap/extension-blockquote',
            '@tiptap/extension-bold',
            '@tiptap/extension-bullet-list',
            '@tiptap/extension-code',
            '@tiptap/extension-code-block',
            '@tiptap/extension-color',
            '@tiptap/extension-heading',
            '@tiptap/extension-highlight',
            '@tiptap/extension-image',
            '@tiptap/extension-italic',
            '@tiptap/extension-link',
            '@tiptap/extension-list-item',
            '@tiptap/extension-ordered-list',
            '@tiptap/extension-strike',
            '@tiptap/extension-table',
            '@tiptap/extension-table-cell',
            '@tiptap/extension-table-header',
            '@tiptap/extension-table-row',
            '@tiptap/extension-task-item',
            '@tiptap/extension-task-list',
            '@tiptap/extension-text-align',
            '@tiptap/extension-text-style',
            '@tiptap/extension-underline',
            '@tiptap/pm',
            '@floating-ui/vue',
            '@vueuse/core',
            'prosemirror-model',
            'prosemirror-state',
            'prosemirror-view'
          ],
          output: {
            exports: 'named',
            compact: true,
            minifyInternalExports: true,
            globals: {
              vue: 'Vue',
              '@tiptap/core': 'TiptapCore',
              '@tiptap/vue-3': 'TiptapVue3',
              '@tiptap/starter-kit': 'TiptapStarterKit',
              '@tiptap/extension-blockquote': 'TiptapBlockquote',
              '@tiptap/extension-bold': 'TiptapBold',
              '@tiptap/extension-bullet-list': 'TiptapBulletList',
              '@tiptap/extension-code': 'TiptapCode',
              '@tiptap/extension-code-block': 'TiptapCodeBlock',
              '@tiptap/extension-color': 'TiptapColor',
              '@tiptap/extension-heading': 'TiptapHeading',
              '@tiptap/extension-highlight': 'TiptapHighlight',
              '@tiptap/extension-image': 'TiptapImage',
              '@tiptap/extension-italic': 'TiptapItalic',
              '@tiptap/extension-link': 'TiptapLink',
              '@tiptap/extension-list-item': 'TiptapListItem',
              '@tiptap/extension-ordered-list': 'TiptapOrderedList',
              '@tiptap/extension-strike': 'TiptapStrike',
              '@tiptap/extension-table': 'TiptapTable',
              '@tiptap/extension-table-cell': 'TiptapTableCell',
              '@tiptap/extension-table-header': 'TiptapTableHeader',
              '@tiptap/extension-table-row': 'TiptapTableRow',
              '@tiptap/extension-task-item': 'TiptapTaskItem',
              '@tiptap/extension-task-list': 'TiptapTaskList',
              '@tiptap/extension-text-align': 'TiptapTextAlign',
              '@tiptap/extension-text-style': 'TiptapTextStyle',
              '@tiptap/extension-underline': 'TiptapUnderline',
              '@tiptap/pm': 'TiptapPm',
              '@floating-ui/vue': 'FloatingUIVue',
              '@vueuse/core': 'VueUseCore',
              'prosemirror-model': 'ProseMirrorModel',
              'prosemirror-state': 'ProseMirrorState',
              'prosemirror-view': 'ProseMirrorView'
            }
          }
        },
        // 禁用资源内联，确保所有资源都会被提取
        assetsInlineLimit: 0
      }
    })
  }
})
