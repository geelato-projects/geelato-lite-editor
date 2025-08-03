import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isLib = mode === 'lib'
  
  return {
    plugins: [
      vue(),
      ...(isLib ? [dts({
        include: ['src/**/*.ts', 'src/**/*.vue'],
        exclude: ['src/**/*.test.*', 'src/**/*.spec.*', 'src/vite-env.d.ts'],
        outDir: 'dist'
      })] : [])
    ],
    
    // 非库模式的构建配置
    ...(!isLib && {
      build: {
        rollupOptions: {
          output: {
            manualChunks: {
              // 将Vue相关依赖分离到单独的chunk
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
        lib: {
          entry: resolve(fileURLToPath(new URL('.', import.meta.url)), 'src/index.ts'),
          name: 'GeelatoLiteEditor',
          fileName: 'geelato-lite-editor',
          formats: ['es', 'umd']
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
            globals: {
              vue: 'Vue',
              '@tiptap/core': 'TiptapCore',
              '@tiptap/vue-3': 'TiptapVue3'
            }
          }
        },
         cssCodeSplit: false,
         emptyOutDir: true
       }
    })
  }
})
