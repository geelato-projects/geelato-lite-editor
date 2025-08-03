<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { GeelatoLiteEditor } from './index'

const content = ref('<p>欢迎使用 Geelato Lite Editor！</p><p>这是一个基于 TipTap 的轻量级富文本编辑器。</p>')
const currentView = ref<'demo' | 'test'>('demo')
const theme = ref<'light' | 'dark' | 'auto'>('auto')
const size = ref<'small' | 'medium' | 'large'>('medium')
// 移除mode属性，改用editable控制编辑状态
const toolbarMode = ref<'minimal' | 'simple' | 'full' | 'none'>('full')
const editable = ref(true)
const bordered = ref(true)
const primaryColor = ref('#1890ff')

// 编辑器实例引用
const editorRef = ref()

// 暴露编辑器到全局变量
onMounted(() => {
  if (editorRef.value) {
    ;(window as any).editor = editorRef.value.editor
    console.log('Editor instance exposed to window.editor')
  }
})

const handleUpdate = ({ content: newContent }: { content: string }) => {
  console.log('内容更新:', newContent)
}

const handleFocus = () => {
  console.log('编辑器获得焦点')
}

const handleBlur = () => {
  console.log('编辑器失去焦点')
}

const toggleTheme = () => {
  const themes: Array<'light' | 'dark' | 'auto'> = ['light', 'dark', 'auto']
  const currentIndex = themes.indexOf(theme.value)
  theme.value = themes[(currentIndex + 1) % themes.length]
}

const toggleSize = () => {
  const sizes: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large']
  const currentIndex = sizes.indexOf(size.value)
  size.value = sizes[(currentIndex + 1) % sizes.length]
}

// 移除toggleMode函数，改用editable控制

const toggleToolbar = () => {
  const modes: Array<'minimal' | 'simple' | 'full' | 'none'> = ['minimal', 'simple', 'full', 'none']
  const currentIndex = modes.indexOf(toolbarMode.value)
  toolbarMode.value = modes[(currentIndex + 1) % modes.length]
}

const showStatusBar = ref(true)

const toggleShowStatusBar = () => {
  showStatusBar.value = !showStatusBar.value
}

const toggleBordered = () => {
  bordered.value = !bordered.value
}

// 预设主题色
const presetColors = [
  '#1890ff', // 蓝色（默认）
  '#52c41a', // 绿色
  '#f5222d', // 红色
  '#fa8c16', // 橙色
  '#722ed1', // 紫色
  '#13c2c2', // 青色
  '#eb2f96', // 粉色
  '#666666'  // 灰色
]

const togglePrimaryColor = () => {
  const currentIndex = presetColors.indexOf(primaryColor.value)
  const nextIndex = (currentIndex + 1) % presetColors.length
  primaryColor.value = presetColors[nextIndex]
}
</script>

<template>
  <div class="app">
    <header class="app-header">
      <h1>Geelato Lite Editor 演示</h1>
      <div class="controls">
        <button @click="toggleTheme" class="control-btn">
          主题: {{ theme }}
        </button>
        <button @click="toggleSize" class="control-btn">
          尺寸: {{ size }}
        </button>
        <!-- 移除模式切换按钮，改用editable控制 -->
        <button @click="toggleToolbar" class="control-btn">
          工具栏: {{ toolbarMode }}
        </button>
         <button @click="toggleShowStatusBar" class="control-btn">
          状态栏: {{ showStatusBar }}
        </button>
        <button @click="editable = !editable" class="control-btn">
          {{ editable ? '只读' : '编辑' }}
        </button>
        <button @click="toggleBordered" class="control-btn">
          边框: {{ bordered ? '显示' : '隐藏' }}
        </button>
        <button @click="togglePrimaryColor" class="control-btn" :style="{ color: primaryColor }">
          主题色: {{ primaryColor }}
        </button>
      </div>
    </header>
    
    <main class="app-main">
      <!-- 演示视图 -->
      <div v-if="currentView === 'demo'">
        <div class="editor-container">
          <GeelatoLiteEditor
            ref="editorRef"
            v-model="content"
            :theme="theme"
            :size="size"
            :toolbar="toolbarMode"
            :showStatusBar="showStatusBar"
            :editable="editable"
            :bordered="bordered"
            :primary-color="primaryColor"
            :min-height="'300px'"
            :auto-focus="false"
            placeholder="请输入内容..."
            @update="handleUpdate"
            @focus="handleFocus"
            @blur="handleBlur"
          />
        </div>
        
        <div class="content-preview">
          <h3>内容预览 (HTML)</h3>
          <pre><code>{{ content }}</code></pre>
        </div>
      </div>
      
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  padding: 20px;
  background: var(--gl-bg-color, #ffffff);
  color: var(--gl-text-color, #333333);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--gl-border-color, #e0e0e0);
}

.app-header h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
  color: var(--gl-primary-color, #1890ff);
}

.controls {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.control-btn {
  padding: 8px 16px;
  border: 1px solid var(--gl-border-color, #e0e0e0);
  border-radius: 6px;
  background: var(--gl-bg-color, #ffffff);
  color: var(--gl-text-color, #333333);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.control-btn:hover {
  border-color: var(--gl-primary-color, #1890ff);
  color: var(--gl-primary-color, #1890ff);
}

.view-switch {
  background: var(--gl-primary-color, #1890ff) !important;
  color: white !important;
  border-color: var(--gl-primary-color, #1890ff) !important;
}

.view-switch:hover {
  background: var(--gl-primary-hover-color, #40a9ff) !important;
  border-color: var(--gl-primary-hover-color, #40a9ff) !important;
}

.app-main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  align-items: start;
}

.editor-container {
  min-height: 400px;
}

.content-preview {
  background: var(--gl-editor-readonly-bg, #f8f9fa);
  border: 1px solid var(--gl-border-color, #e0e0e0);
  border-radius: 6px;
  padding: 20px;
}

.content-preview h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--gl-text-color, #333333);
}

.content-preview pre {
  margin: 0;
  padding: 16px;
  background: var(--gl-code-block-bg, #f8f9fa);
  border: 1px solid var(--gl-border-color, #e0e0e0);
  border-radius: 4px;
  overflow-x: auto;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  line-height: 1.4;
  color: var(--gl-text-color, #333333);
}

.content-preview code {
  white-space: pre-wrap;
  word-break: break-all;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .app-main {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .app {
    padding: 16px;
  }
  
  .app-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .controls {
    width: 100%;
    justify-content: flex-start;
  }
  
  .control-btn {
    flex: 1;
    min-width: 80px;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .app {
    padding: 12px;
  }
  
  .app-header h1 {
    font-size: 24px;
  }
  
  .controls {
    grid-template-columns: repeat(2, 1fr);
    display: grid;
    gap: 8px;
  }
  
  .control-btn {
    padding: 6px 12px;
    font-size: 13px;
  }
}
</style>
