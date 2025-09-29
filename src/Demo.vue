<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import { GeelatoLiteEditor } from './index'
import { convertToInlineStyles, createEmailHtml } from './utils/htmlInlineStyles'

const content = ref('<p>欢迎使用 Geelato Lite Editor！</p><p>这是一个基于 TipTap 的轻量级富文本编辑器。</p>')
const currentView = ref<'demo' | 'test' | 'height-test' | 'preview-test'>('demo')

// 高度测试相关状态
const heightTestContent = ref(`
<h1>高度和滚动条测试</h1>
<p>这是一个用于测试编辑器高度限制和滚动条功能的长内容。</p>
<h2>第一部分</h2>
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
<p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
<h2>第二部分</h2>
<p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
<p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
<h2>第三部分</h2>
<p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</p>
<p>Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?</p>
<h2>第四部分</h2>
<p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.</p>
<p>Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.</p>
<h2>第五部分</h2>
<p>Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.</p>
<p>Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.</p>
<h2>第六部分</h2>
<p>Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.</p>
<p>这里还有更多内容来测试滚动条的出现...</p>
<p>更多的段落内容...</p>
<p>继续添加内容以确保超出最大高度限制...</p>
<p>最后一段内容，用于测试滚动到底部的效果。</p>
`)

// 预览测试相关状态
const previewTestContent = ref(`
<h2>HTML预览测试内容</h2>
<p>这是一段用于测试HTML预览功能的<strong>富文本内容</strong>。</p>
<ul>
  <li>支持<em>斜体</em>和<strong>粗体</strong>文字</li>
  <li>支持有序和无序列表</li>
  <li>支持<a href="#" style="color: #1890ff;">链接</a>功能</li>
</ul>
<blockquote>
  <p>这是一个引用块，用于测试样式渲染效果。</p>
</blockquote>
<p style="color: #1890ff; font-size: 16px;">这是一段带颜色的文字，测试样式是否正确应用。</p>
<div style="background: #f0f0f0; padding: 12px; border-radius: 4px; margin: 12px 0;">
  <p style="margin: 0;">这是一个自定义样式的div块，测试复杂HTML结构的渲染效果。</p>
</div>
`)

// 预览相关
const previewIframe = ref<HTMLIFrameElement>()
const emailPreviewIframe = ref<HTMLIFrameElement>()
const previewMode = ref<'normal' | 'email'>('normal')

// 普通HTML预览（无样式）
const previewHtmlContent = computed(() => {
  return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HTML预览</title>
</head>
<body>
${previewTestContent.value}
</body>
</html>
  `
})

// 邮件HTML预览（内联样式）
const emailHtmlContent = computed(() => {
  return createEmailHtml(previewTestContent.value, 'HTML邮件预览')
})

const onPreviewContentChange = () => {
  // 内容变化时自动更新预览
  nextTick(() => {
    if (previewIframe.value) {
      previewIframe.value.srcdoc = previewHtmlContent.value
    }
    if (emailPreviewIframe.value) {
      emailPreviewIframe.value.srcdoc = emailHtmlContent.value
    }
  })
}

const refreshPreview = () => {
  if (previewIframe.value) {
    previewIframe.value.srcdoc = previewHtmlContent.value
  }
  if (emailPreviewIframe.value) {
    emailPreviewIframe.value.srcdoc = emailHtmlContent.value
  }
}

const switchPreviewMode = (mode: 'normal' | 'email') => {
  previewMode.value = mode
}
const testMinHeight = ref('150px')
const testMaxHeight = ref('300px')
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
    ; (window as any).editor = editorRef.value.editor
  }
})

const handleUpdate = ({ content: newContent }: { content: string }) => {
  // 内容更新
}

const handleFocus = () => {
  // 编辑器获得焦点
}

const handleBlur = () => {
  // 编辑器失去焦点
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

// 视图切换
const switchView = (view: 'demo' | 'test' | 'height-test' | 'preview-test') => {
  currentView.value = view
}

// 高度控制函数
const adjustMinHeight = (delta: number) => {
  const current = parseInt(testMinHeight.value)
  const newHeight = Math.max(100, current + delta)
  testMinHeight.value = `${newHeight}px`
}

const adjustMaxHeight = (delta: number) => {
  const current = parseInt(testMaxHeight.value)
  const newHeight = Math.max(200, current + delta)
  testMaxHeight.value = `${newHeight}px`
}
</script>

<template>
  <div class="app">
    <header class="app-header">
      <h1>Geelato Lite Editor 演示</h1>
      <div class="controls">
        <!-- 视图切换 -->
        <div class="view-controls">
          <button @click="switchView('demo')" :class="['control-btn', { 'view-switch': currentView === 'demo' }]">
            基础演示
          </button>
          <button @click="switchView('height-test')"
            :class="['control-btn', { 'view-switch': currentView === 'height-test' }]">
            高度测试
          </button>
          <button @click="switchView('preview-test')"
            :class="['control-btn', { 'view-switch': currentView === 'preview-test' }]">
            预览测试
          </button>
        </div>

        <!-- 通用控制 -->
        <button @click="toggleTheme" class="control-btn">
          主题: {{ theme }}
        </button>
        <button @click="toggleSize" class="control-btn">
          尺寸: {{ size }}
        </button>
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
      <!-- 基础演示视图 -->
      <div class="demo-view" v-if="currentView === 'demo'">
        <div class="editor-container">
          <GeelatoLiteEditor ref="editorRef" v-model="content" :theme="theme" :size="size" :toolbar="toolbarMode"
            :showStatusBar="showStatusBar" :editable="editable" :bordered="bordered" :primary-color="primaryColor"
            :min-height="'300px'" :auto-focus="false" placeholder="请输入内容..." @update="handleUpdate" @focus="handleFocus"
            @blur="handleBlur" />
        </div>

        <div class="content-preview">
          <h3>内容预览 (HTML)</h3>
          <pre><code>{{ content }}</code></pre>
        </div>
      </div>

      <!-- 高度测试视图 -->
      <div class="height-test-view" v-if="currentView === 'height-test'">
        <div class="height-controls">
          <div class="height-control-group">
            <label>最小高度: {{ testMinHeight }}</label>
            <div class="height-buttons">
              <button @click="adjustMinHeight(-50)" class="height-btn">-50px</button>
              <button @click="adjustMinHeight(50)" class="height-btn">+50px</button>
            </div>
          </div>
          <div class="height-control-group">
            <label>最大高度: {{ testMaxHeight }}</label>
            <div class="height-buttons">
              <button @click="adjustMaxHeight(-50)" class="height-btn">-50px</button>
              <button @click="adjustMaxHeight(50)" class="height-btn">+50px</button>
            </div>
          </div>
        </div>

        <div class="test-editor-container">
          <h3>高度限制测试编辑器</h3>
          <p class="test-description">
            当前设置：最小高度 {{ testMinHeight }}，最大高度 {{ testMaxHeight }}。
            内容超出最大高度时应该出现滚动条。
          </p>
          <GeelatoLiteEditor v-model="heightTestContent" :theme="theme" :size="size" :toolbar-mode="toolbarMode"
            :show-status-bar="showStatusBar" :editable="editable" :bordered="bordered" :primary-color="primaryColor"
            :min-height="testMinHeight" :max-height="testMaxHeight" @focus="handleFocus" @blur="handleBlur" />
        </div>
      </div>

      <!-- 预览测试视图 -->
      <div class="preview-test-view" v-if="currentView === 'preview-test'">
        <div class="preview-controls">
          <div class="preview-options">
            <label class="option-item">
              <input type="checkbox" v-model="bordered" />
              编辑器显示边框
            </label>
            <label class="option-item">
              <input type="checkbox" v-model="showStatusBar" />
              编辑器显示状态栏
            </label>
            <div class="preview-mode-switch">
              <label class="mode-option">
                <input type="radio" value="normal" v-model="previewMode" @change="switchPreviewMode('normal')" />
                IFRAME-普通HTML预览
              </label>
              <label class="mode-option">
                <input type="radio" value="email" v-model="previewMode" @change="switchPreviewMode('email')" />
                IFRAME-邮件HTML预览（内联样式）
              </label>
            </div>
            <button @click="refreshPreview" class="refresh-btn">
              刷新预览
            </button>
          </div>
        </div>

        <div class="preview-container">
          <div class="preview-editor">
            <h4>编辑器</h4>
            <GeelatoLiteEditor v-model="previewTestContent" :theme="theme" :size="size" :toolbar-mode="'simple'"
              :show-status-bar="showStatusBar" :editable="true" :bordered="bordered" :primary-color="primaryColor"
              :min-height="'300px'" :max-height="'500px'" @update:modelValue="onPreviewContentChange" />
          </div>

          <div class="preview-iframe-container">
            <h4>{{ previewMode === 'email' ? '邮件HTML预览效果（内联样式）' : 'HTML预览效果（无外部样式）' }}</h4>
            <iframe v-if="previewMode === 'normal'" ref="previewIframe" class="preview-iframe"
              :srcdoc="previewHtmlContent" sandbox="allow-same-origin allow-scripts"></iframe>
            <iframe v-if="previewMode === 'email'" ref="emailPreviewIframe" class="preview-iframe"
              :srcdoc="emailHtmlContent" sandbox="allow-same-origin allow-scripts"></iframe>
          </div>
        </div>

        <div class="preview-content-display">
          <h4>{{ previewMode === 'email' ? '邮件HTML源码（包含内联样式）' : '原始HTML源码' }}</h4>
          <pre
            class="content-code"><code>{{ previewMode === 'email' ? emailHtmlContent : previewTestContent }}</code></pre>
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

.view-controls {
  display: flex;
  gap: 8px;
  margin-right: 16px;
  padding-right: 16px;
  border-right: 1px solid #e5e7eb;
}

.view-switch {
  background-color: #3b82f6 !important;
  color: white !important;
}

.demo-view {
  min-width: 1240px;
  max-width: 1240px;
}

.height-test-view,
.preview-test-view {
  grid-column: 1 / -1;
}

.height-controls {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding: 16px;
  background: var(--gl-editor-readonly-bg, #f8f9fa);
  border: 1px solid var(--gl-border-color, #e0e0e0);
  border-radius: 6px;
}

.height-control-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.height-control-group label {
  font-weight: 600;
  color: var(--gl-text-color, #333333);
}

.height-buttons {
  display: flex;
  gap: 8px;
}

.height-btn {
  padding: 4px 12px;
  border: 1px solid var(--gl-border-color, #e0e0e0);
  border-radius: 4px;
  background: var(--gl-bg-color, #ffffff);
  color: var(--gl-text-color, #333333);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 12px;
}

.height-btn:hover {
  border-color: var(--gl-primary-color, #1890ff);
  color: var(--gl-primary-color, #1890ff);
}

.test-editor-container {
  margin-top: 20px;
}

.test-editor-container h3 {
  margin: 0 0 12px 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--gl-text-color, #333333);
}

.test-description {
  margin: 0 0 16px 0;
  padding: 12px;
  background: var(--gl-editor-readonly-bg, #f8f9fa);
  border: 1px solid var(--gl-border-color, #e0e0e0);
  border-radius: 4px;
  font-size: 14px;
  color: var(--gl-text-color, #666666);
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

/* 预览测试样式 */
.preview-controls {
  margin-bottom: 24px;
  padding: 20px;
  background: var(--gl-bg-secondary, #f8f9fa);
  border-radius: 8px;
  border: 1px solid var(--gl-border-color, #e0e0e0);
}

.preview-controls h3 {
  margin: 0 0 12px 0;
  color: var(--gl-primary-color, #1890ff);
  font-size: 18px;
}

.preview-options {
  display: flex;
  gap: 20px;
  margin-top: 16px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
}

.option-item input[type="checkbox"] {
  margin: 0;
}

.refresh-btn {
  padding: 6px 12px;
  background: var(--gl-primary-color, #1890ff);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.refresh-btn:hover {
  background: var(--gl-primary-color-hover, #40a9ff);
}

.preview-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

.preview-editor,
.preview-iframe-container {
  padding: 16px;
  border: 1px solid var(--gl-border-color, #e0e0e0);
  border-radius: 8px;
  background: var(--gl-bg-color, #ffffff);
}

.preview-editor h4,
.preview-iframe-container h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: var(--gl-text-color, #333333);
  padding-bottom: 8px;
  border-bottom: 1px solid var(--gl-border-color, #e0e0e0);
}

.preview-iframe {
  width: 100%;
  height: 400px;
  border: 1px solid var(--gl-border-color, #e0e0e0);
  border-radius: 4px;
  background: #fff;
}

.preview-content-display {
  padding: 16px;
  border: 1px solid var(--gl-border-color, #e0e0e0);
  border-radius: 8px;
  background: var(--gl-bg-secondary, #f8f9fa);
}

.preview-content-display h4 {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: var(--gl-text-color, #333333);
}

.content-code {
  background: #f6f8fa;
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  padding: 16px;
  margin: 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  line-height: 1.5;
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.preview-mode-switch {
  display: flex;
  gap: 16px;
  margin: 8px 0;
}

.mode-option {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: var(--gl-text-color, #333333);
  cursor: pointer;
}

.mode-option input[type="radio"] {
  margin: 0;
}

@media (max-width: 768px) {
  .preview-container {
    grid-template-columns: 1fr;
  }

  .preview-options {
    flex-direction: column;
    gap: 12px;
  }

  .preview-mode-switch {
    flex-direction: column;
    gap: 8px;
  }
}
</style>