<template>
  <div :class="contentClass">
    <!-- TipTap 编辑器内容区域 -->
    <TiptapEditorContent
      v-if="editor"
      :editor="editor"
      :class="editorContentClass.class"
      :style="editorContentClass.style"
    />
    
    <!-- 图片工具面板 -->
    <!-- <ImageToolPanelWrapper
      :editor="editor"
    /> -->
    
    <!-- 字数统计 -->
    <div
      v-if="_showStatusBar && contentStats"
      :class="wordCountClass"
    >
      <span class="gl-word-count__item">
        字符: {{ contentStats.characters }}
      </span>
      <span class="gl-word-count__item">
        单词: {{ contentStats.words }}
      </span>
      <span class="gl-word-count__item">
        段落: {{ contentStats.paragraphs }}
      </span>
    </div>
    
    <!-- 占位符 -->
    <div
      v-if="showPlaceholder"
      class="gl-editor-placeholder"
      @click="handlePlaceholderClick"
    >
      {{ placeholder }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { EditorContent as TiptapEditorContent, type Editor } from '@tiptap/vue-3'
import type {
  ComponentSize,
  ContentStats
} from '../../types'

interface Props {
  /** 编辑器实例 */
  editor: Editor | null
  /** 组件尺寸 */
  size?: ComponentSize
  /** 是否显示字数统计 */
  showStatusBar?: boolean
  /** 占位符文本 */
  placeholder?: string
  /** 最小高度 */
  minHeight?: string | number
  /** 最大高度 */
  maxHeight?: string | number
  /** 内容统计 */
  contentStats?: ContentStats
  /** 是否只读 */
  readonly?: boolean
  /** 自定义类名 */
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  showStatusBar: true,
  placeholder: '请输入内容...',
  minHeight: '200px',
  readonly: false,
})

const _showStatusBar = computed(() => props.showStatusBar)

// 内容区域类名
const contentClass = computed(() => {
  const classes = [
    'gl-editor-content',
    `gl-editor-content--${props.size}`,
  ]
  
  if (props.readonly) {
    classes.push('gl-editor-content--readonly')
  }
  
  if (props.class) {
    classes.push(props.class)
  }
  
  return classes.join(' ')
})

// 编辑器内容类名
const editorContentClass = computed(() => {
  const classes = ['gl-editor-content__editor']
  
  const style: Record<string, string> = {}
  
  if (props.minHeight) {
    style.minHeight = typeof props.minHeight === 'number' 
      ? `${props.minHeight}px` 
      : props.minHeight
  }
  
  if (props.maxHeight) {
    style.maxHeight = typeof props.maxHeight === 'number' 
      ? `${props.maxHeight}px` 
      : props.maxHeight
  }
  
  return {
    class: classes.join(' '),
    style,
  }
})

// 字数统计类名
const wordCountClass = computed(() => {
  const classes = [
    'gl-word-count',
    `gl-word-count--${props.size}`,
  ]
  
  return classes.join(' ')
})

// 是否显示占位符
const showPlaceholder = computed(() => {
  if (!props.editor || !props.placeholder) return false
  
  // 检查编辑器是否为空
  const isEmpty = props.editor.isEmpty
  const isFocused = props.editor.isFocused
  
  return isEmpty && !isFocused
})

// 处理占位符点击
const handlePlaceholderClick = () => {
  if (props.editor && !props.readonly) {
    props.editor.commands.focus()
  }
}
</script>

<style lang="less">
.gl-editor-content {
  position: relative;
  background: var(--gl-editor-bg, #ffffff);
  border: 1px solid var(--gl-border-color, #e0e0e0);
  border-top: none;
  overflow: hidden;
  
  &--small {
    .gl-editor-content__editor {
      padding: 0px;
      font-size: 13px;
      line-height: 1.4;
    }
  }
  
  &--medium {
    .gl-editor-content__editor {
      padding: 0px;
      font-size: 14px;
      line-height: 1.5;
    }
  }
  
  &--large {
    .gl-editor-content__editor {
      padding: 0px;
      font-size: 15px;
      line-height: 1.6;
    }
  }
  
  &--readonly {
    background: var(--gl-editor-bg, #ffffff);
    
    .gl-editor-content__editor {
      cursor: default;
    }
  }
   
  &--no-toolbar {
    border-top: 1px solid var(--gl-border-color, #e0e0e0);
  }
}

.gl-editor-content__editor {
  outline: none;
  overflow-y: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  // TipTap 编辑器样式
  .ProseMirror {
    outline: none;
    flex: 1;
    min-height: 100%;
    padding: 0;
    margin: 1em;
    box-sizing: border-box;
    border: none;
    
    // 基础文本样式
    p {
      margin: 0;
      line-height: 1;
      
      &:not(:last-child) {
        margin-bottom: 12px;
      }
      
      &:first-child {
        margin-top: 0;
        padding-top: 0;
      }
      
      &.is-editor-empty:first-child::before {
        content: attr(data-placeholder);
        float: left;
        color: var(--gl-text-color-placeholder, #999999);
        pointer-events: none;
        height: 0;
      }
    }
    
    // 标题样式
    h1, h2, h3, h4, h5, h6 {
      margin: 20px 0 12px 0;
      font-weight: 600;
      line-height: 1.3;
      
      &:first-child {
        margin-top: 0;
      }
    }
    
    h1 { font-size: 2em; }
    h2 { font-size: 1.5em; }
    h3 { font-size: 1.25em; }
    h4 { font-size: 1.1em; }
    h5 { font-size: 1em; }
    h6 { font-size: 0.9em; }
    
    // 列表样式
    ul, ol {
      margin: 12px 0;
      padding-left: 24px;
      
      li {
        margin: 4px 0;
        
        p {
          margin: 0;
        }
      }
    }
    
    // 引用块样式
    blockquote {
      border-left: 3px solid #4a4a4a;
      margin: 1.5rem 0;
      padding: 1rem;
      background: var(--gl-blockquote-bg, #f8f9fa);
      color: var(--gl-text-color-secondary, #666666);
      
      p {
        margin: 0;
      }
    }
    
    // 代码样式
    code {
      padding: 2px 6px;
      background: var(--gl-code-bg, #f1f3f4);
      border-radius: 3px;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 0.9em;
    }
    
    // 代码块样式
    pre {
      margin: 16px 0;
      padding: 16px;
      background: var(--gl-code-block-bg, #f8f9fa);
      border-radius: 6px;
      overflow-x: auto;
      
      code {
        padding: 0;
        background: none;
        font-size: 13px;
        line-height: 1.4;
      }
    }
    
    // 链接样式
    a {
      color: var(--gl-primary-color, #1890ff);
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
    
    // 高亮样式
    mark,
    .gl-highlight {
      background: var(--gl-highlight-bg, #fff3cd);
      color: var(--gl-highlight-color, #856404);
      padding: 1px 2px;
      border-radius: 2px;
    }
    
    // 图片样式
    img {
      max-width: 100%;
      height: auto;
      border-radius: 0;
    }
    
    // 表格样式
    table {
      width: 100%;
      margin: 16px 0;
      border-collapse: collapse;
      border: 1px solid var(--gl-border-color, #e0e0e0);
      
      th, td {
        padding: 8px 12px;
        border: 1px solid var(--gl-border-color, #e0e0e0);
        text-align: left;
      }
      
      th {
        background: var(--gl-table-header-bg, #f8f9fa);
        font-weight: 600;
      }
    }
    
    // 水平分割线
    hr {
      margin: 24px 0;
      border: none;
      border-top: 1px solid var(--gl-border-color, #e0e0e0);
    }
    
    // 文本样式
    strong {
      font-weight: 600;
    }
    
    em {
      font-style: italic;
    }
    
    u {
      text-decoration: underline;
    }
    
    s {
      text-decoration: line-through;
    }
    
    // 高亮样式
    mark {
      background: var(--gl-highlight-bg, #fff3cd);
      padding: 1px 2px;
      border-radius: 2px;
    }
  }
}

// 占位符样式
.gl-editor-placeholder {
  position: absolute;
  top: 12px;
  left: 16px;
  color: var(--gl-text-color-placeholder, #999999);
  pointer-events: none;
  user-select: none;
  z-index: 1;
}

// 字数统计样式
.gl-word-count {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px 16px;
  background: var(--gl-word-count-bg, #f8f9fa);
  font-size: 12px;
  color: var(--gl-text-color-secondary, #666666);
  
  &--small {
    padding: 6px 12px;
    font-size: 11px;
    gap: 12px;
  }
  
  &--medium {
    padding: 8px 16px;
    font-size: 12px;
    gap: 16px;
  }
  
  &--large {
    padding: 10px 20px;
    font-size: 13px;
    gap: 20px;
  }
}

.gl-word-count__item {
  white-space: nowrap;
}

// 暗色主题
.gl-theme-dark {
  .gl-editor-content {
    background: var(--gl-editor-bg, #1e1e1e);
    border-color: var(--gl-border-color, #404040);
    
    &--readonly {
      background: var(--gl-editor-readonly-bg, #2d2d2d);
    }
  }
  
  .gl-editor-content__editor .ProseMirror {
    color: var(--gl-text-color, #ffffff);
    
    blockquote {
      background: var(--gl-blockquote-bg, #2d2d2d);
      color: var(--gl-text-color-secondary, #cccccc);
    }
    
    code {
      background: var(--gl-code-bg, #404040);
      color: var(--gl-text-color, #ffffff);
    }
    
    pre {
      background: var(--gl-code-block-bg, #2d2d2d);
    }
    
    table {
      border-color: var(--gl-border-color, #404040);
      
      th, td {
        border-color: var(--gl-border-color, #404040);
      }
      
      th {
        background: var(--gl-table-header-bg, #404040);
      }
    }
    
    mark {
      background: var(--gl-highlight-bg, #4a4a00);
      color: var(--gl-text-color, #ffffff);
    }
  }
  
  .gl-editor-placeholder {
    color: var(--gl-text-color-placeholder, #666666);
  }
  
  .gl-word-count {
    background: var(--gl-word-count-bg, #2d2d2d);
    border-top-color: var(--gl-border-color, #404040);
    color: var(--gl-text-color-secondary, #cccccc);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .gl-editor-content__editor {
    padding: 8px 12px;
    font-size: 14px;
  }
  
  .gl-editor-placeholder {
    top: 8px;
    left: 12px;
  }
  
  .gl-word-count {
    padding: 6px 12px;
    font-size: 11px;
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .gl-editor-content__editor {
    padding: 6px 8px;
  }
  
  .gl-editor-placeholder {
    top: 6px;
    left: 8px;
  }
  
  .gl-word-count {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    padding: 8px;
  }
}
</style>