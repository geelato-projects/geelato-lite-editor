<template>
  <div ref="editorContainer" :class="editorClass" :style="themeColorVars">
    <div class="editor-container">
      <EditorToolbar v-if="computedToolbarConfig !== 'none' && editor" :editor="editor"
        :config="computedToolbarConfig" :size="size" :show-separator="showToolbarSeparator" :class="toolbarClass" />

      <EditorContent v-if="editor" :editor="editor" :size="size" :showStatusBar="_showStatusBar"
        :placeholder="placeholder" :min-height="minHeight" :max-height="maxHeight" :content-stats="contentStats"
        :readonly="!editable"
        :class="contentClass + (computedToolbarConfig === 'none' ? ' gl-editor-content--no-toolbar' : '')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useEditor } from '../composables/useEditor'
import { useTheme } from '../composables/useTheme'
import EditorToolbar from './toolbar/EditorToolbar.vue'
import EditorContent from './editor/EditorContent.vue'
import type {
  GeelateLiteEditorProps,
  GeelateLiteEditorEmits,
  ThemeType,
  ComponentSize,
  ToolbarMode,
  ToolbarConfig,
  ExtensionConfig
} from '../types'

// 定义组件属性
interface Props extends GeelateLiteEditorProps { }

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  theme: 'auto',
  size: 'small',
  editable: true,
  bordered: true,
  showToolbar: true,
  toolbar: 'simple',
  showToolbarSeparator: true,
  showStatusBar: false,
  placeholder: '请输入内容...',
  minHeight: '200px',
  autoFocus: false,
  extensions: undefined,
  primaryColor: '#1890ff',
})

// 定义组件事件
const emit = defineEmits<GeelateLiteEditorEmits>()

// 模板引用
const editorContainer = ref<HTMLElement>()

// 使用编辑器组合式函数
const {
  editor,
  state,
  isEditable,
  isReady,
  isFocused,
  isEmpty,
  contentStats,
  getContent,
  getInlineHTML,
  setContent,
  clearContent,
  focus,
  blur,
  insertContent,
  undo,
  redo,
  canUndo,
  canRedo,
} = useEditor({
  content: props.modelValue,
  editable: props.editable,
  placeholder: props.placeholder,
  autoFocus: props.autoFocus,
  extensions: props.extensions,
  onUpdate: ({ editor }) => {
    const content = editor.getHTML()
    emit('update:modelValue', content)
    const editorContent = {
      html: content,
      json: editor.getJSON(),
      text: editor.getText()
    }
    emit('change', editorContent)
  },
  onFocus: ({ editor, event }) => {
    emit('focus', event)
  },
  onBlur: ({ editor, event }) => {
    emit('blur', event)
  },
  onSelectionUpdate: ({ editor }) => {
    // 创建符合SelectionState接口的对象
    const selectionState = {
      from: editor.state.selection.from,
      to: editor.state.selection.to,
      empty: editor.state.selection.empty
    }
    emit('selection-change', selectionState)
  },
  onCreate: ({ editor }) => {
    emit('created', editor)
  },
  onDestroy: () => {
    emit('destroyed')
  },
})

// 使用主题组合式函数
const { currentTheme, setTheme, applyThemeVariables } = useTheme()

// 计算主题色CSS变量
const themeColorVars = computed(() => {
  const primaryColor = props.primaryColor || '#1890ff'
  
  // 将十六进制颜色转换为RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }
  
  // 将RGB转换为十六进制
  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
  }
  
  const rgb = hexToRgb(primaryColor)
  if (!rgb) {
    // 如果无法解析颜色，使用默认的透明度后缀
    return {
      '--gl-primary-color': primaryColor,
      '--gl-primary-color-light': `${primaryColor}33`,
      '--gl-primary-color-dark': primaryColor
    }
  }
  
  // 计算深色版本（降低亮度）
  const darkFactor = 0.8
  const primaryColorDark = rgbToHex(
    Math.floor(rgb.r * darkFactor),
    Math.floor(rgb.g * darkFactor),
    Math.floor(rgb.b * darkFactor)
  )
  
  // 计算浅色版本（使用rgba格式，透明度0.2）
  const primaryColorLight = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`
  
  return {
    '--gl-primary-color': primaryColor,
    '--gl-primary-color-light': primaryColorLight,
    '--gl-primary-color-dark': primaryColorDark,
    // 为标题下拉组件提供兼容的变量名
    '--gl-color-primary-light-1': primaryColorLight,
    '--gl-color-primary-6': primaryColor
  }
})

// 计算工具栏配置，使其与 editable 和 toolbar 关联
const computedToolbarConfig = computed(() => {
  // 只读模式下仍然显示工具栏，但按钮会被禁用
  // 工具栏的显示与否由 toolbar 属性控制，而不是 editable 属性
  return props.toolbar
})

const _showStatusBar = computed(() => props.showStatusBar)

// 监听主题变化
watch(
  () => props.theme,
  (newTheme) => {
    setTheme(newTheme)
  },
  { immediate: true }
)

// 监听 modelValue 变化
watch(
  () => props.modelValue,
  (newValue) => {
    console.log()
    if (editor.value && newValue !== getContent()) {
      setContent(newValue)
    }
  }
)

// 监听 editable 变化
watch(
  () => props.editable,
  (newEditable) => {
    if (editor.value) {
      editor.value.setEditable(newEditable)
    }
  }
)

// 编辑器容器类名
const editorClass = computed(() => {
  const classes = [
    'gl-lite-editor',
    `gl-lite-editor--${props.size}`,
    `gl-theme-${currentTheme.value}`,
  ]

  if (!props.editable) {
    classes.push('gl-lite-editor--readonly')
  }

  if (isFocused.value) {
    classes.push('gl-lite-editor--focused')
  }

  if (isEmpty.value) {
    classes.push('gl-lite-editor--empty')
  }

  if (!props.bordered) {
    classes.push('gl-lite-editor--borderless')
  }

  if (props.class) {
    classes.push(props.class)
  }

  return classes.join(' ')
})

// 工具栏类名
const toolbarClass = computed(() => {
  const classes = []

  if (props.toolbarClass) {
    classes.push(props.toolbarClass)
  }

  return classes.join(' ')
})

// 内容区域类名
const contentClass = computed(() => {
  const classes = []

  if (props.contentClass) {
    classes.push(props.contentClass)
  }

  return classes.join(' ')
})

// 暴露给父组件的方法和属性
defineExpose({
  // 编辑器实例
  editor: editor,

  // 状态
  isReady,
  isFocused,
  isEmpty,
  contentStats,

  // 内容操作
  getContent,
  getInlineHTML,
  setContent,
  clearContent,

  // 焦点操作
  focus,
  blur,

  // 内容插入
  insertContent,

  // 撤销重做
  undo,
  redo,
  canUndo,
  canRedo,

  // 主题操作
  setTheme,
})

// 组件挂载时应用主题变量
onMounted(() => {
  if (editorContainer.value) {
    applyThemeVariables(editorContainer.value)
  }
})

// 组件卸载时清理
onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy()
  }
})
</script>

<style lang="less">
@import '../assets/styles/editor.css';

.gl-lite-editor {
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 0;
  overflow: hidden;

  // 尺寸变体
  &--small {
    font-size: 13px;
  }

  &--medium {
    font-size: 14px;
  }

  &--large {
    font-size: 15px;
  }

  // 状态变体
  &--readonly {
    .gl-editor-toolbar {
      opacity: 0.6;
      pointer-events: none;
    }
  }

  &--focused {
    // 聚焦状态样式由 editor.css 统一管理
  }

  &--empty {
    // 空内容状态的样式
  }

  &--borderless {
    border-radius: 0;

    .gl-editor-toolbar {
      border: none;
      border-radius: 0;
    }

    .gl-editor-content {
      border: none;
      border-radius: 0;
    }
  }
}

/* 组件级别的响应式调整 */
@media (max-width: 768px) {
  .gl-lite-editor {
    &--small {
      font-size: 13px;
    }

    &--medium {
      font-size: 14px;
    }

    &--large {
      font-size: 15px;
    }
  }
}

@media (max-width: 480px) {
  .gl-lite-editor {
    border-radius: 4px;

    &--small {
      font-size: 12px;
    }

    &--medium {
      font-size: 13px;
    }

    &--large {
      font-size: 14px;
    }
  }
}
</style>