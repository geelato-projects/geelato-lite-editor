import { ref, computed, watch, onBeforeUnmount } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import { useEditor as useTiptapEditor } from '@tiptap/vue-3'
import type { Editor } from '@tiptap/core'
import { createExtensions, EXTENSION_CONFIGS } from '../extensions'
import { convertToInlineStyles } from '../utils/htmlInlineStyles'
import type {
  SelectionState,
  GeelatoEditorState,
  ExtensionConfig,
} from '../types'

// 编辑器配置接口
interface UseEditorOptions {
  content?: string
  editable?: boolean
  placeholder?: string
  autoFocus?: boolean
  extensions?: any
  onUpdate?: (params: { editor: Editor }) => void
  onFocus?: (params: { editor: Editor; event: FocusEvent }) => void
  onBlur?: (params: { editor: Editor; event: FocusEvent }) => void
  onSelectionUpdate?: (params: { editor: Editor }) => void
  onCreate?: (params: { editor: Editor }) => void
  onDestroy?: () => void
}

// 编辑器返回类型接口
export interface UseEditorReturn {
  editor: ComputedRef<any>
  state: Ref<any>
  isEditable: ComputedRef<boolean>
  isFocused: ComputedRef<boolean>
  isReady: ComputedRef<boolean>
  isEmpty: ComputedRef<boolean>
  wordCount: ComputedRef<number>
  characterCount: ComputedRef<number>
  selection: ComputedRef<SelectionState | null>
  contentStats: ComputedRef<{
    words: number
    characters: number
    charactersWithoutSpaces: number
    paragraphs: number
    sentences: number
    readingTime: number
  }>
  canUndo: ComputedRef<boolean>
  canRedo: ComputedRef<boolean>
  getContent: (format?: 'html' | 'json' | 'text') => string | any
  getInlineHTML: () => string
  setContent: (content: string, emitUpdate?: boolean) => void
  clearContent: () => void
  focus: (position?: 'start' | 'end' | number) => void
  blur: () => void
  insertContent: (content: string) => void
  undo: () => void
  redo: () => void
}

// 编辑器组合式函数
export function useEditor(options: UseEditorOptions = {}): UseEditorReturn {
  // 响应式状态
  const state = ref<GeelatoEditorState>({
    editor: null,
    content: options.content || '',
    isEditable: options.editable ?? true,
    isFocused: false,
    selection: null,
    wordCount: 0,
    characterCount: 0,
  })

  // 获取扩展配置
  const getExtensionConfig = (): ExtensionConfig => {
    if (typeof options.extensions === 'string') {
      return EXTENSION_CONFIGS[options.extensions as keyof typeof EXTENSION_CONFIGS] || EXTENSION_CONFIGS.simple
    }
    return EXTENSION_CONFIGS.simple
  }

  // 创建编辑器实例
  const editor = useTiptapEditor({
    content: options.content || '',
    extensions: Array.isArray(options.extensions) ? options.extensions : createExtensions(getExtensionConfig()),
    editable: options.editable ?? true,
    autofocus: options.autoFocus ?? false,
    editorProps: {
      attributes: {
        class: 'gl-editor-content',
        'data-placeholder': options.placeholder || '开始编写...',
      },
      // 处理拖拽事件，防止节点复制
      handleDrop(view, event, slice, moved) {
        // 如果是移动操作（moved=true），阻止默认的复制行为
        if (moved) {
          return false // 返回false让ProseMirror处理移动操作
        }
        // 对于外部拖入的内容，使用默认处理
        return false
      },
    },
    onUpdate: ({ editor }) => {
      const content = editor.getHTML()
      state.value.content = content
      options.onUpdate?.({ editor })
      
      // 更新统计信息
      updateStats(editor)
    },
    onFocus: ({ editor, event }) => {
      state.value.isFocused = true
      options.onFocus?.({ editor, event })
    },
    onBlur: ({ editor, event }) => {
      state.value.isFocused = false
      options.onBlur?.({ editor, event })
    },
    onSelectionUpdate: ({ editor }) => {
      const { from, to, empty } = editor.state.selection
      const selection: SelectionState = { from, to, empty }
      state.value.selection = selection
      options.onSelectionUpdate?.({ editor })
    },
    onCreate: ({ editor }) => {
      state.value.editor = editor
      updateStats(editor)
      options.onCreate?.({ editor })
    },
    onDestroy: () => {
      state.value.editor = null
      options.onDestroy?.()
    },
  })

  // 更新统计信息
  const updateStats = (editor: Editor) => {
    const text = editor.getText()
    state.value.characterCount = text.length
    state.value.wordCount = text.trim() ? text.trim().split(/\s+/).length : 0
  }

  // 监听内容变化
  watch(
    () => options.content,
    (newValue) => {
      if (editor.value && newValue !== editor.value.getHTML()) {
        editor.value.commands.setContent(newValue || '', { emitUpdate: false })
      }
    }
  )

  // 监听 editable 变化
  watch(
    () => options.editable,
    (newValue) => {
      if (editor.value) {
        editor.value.setEditable(newValue ?? true)
        state.value.isEditable = newValue ?? true
      }
    }
  )

  // 编辑器方法
  const editorMethods = {
    // 获取内容
    getContent: (format: 'html' | 'json' | 'text' = 'html') => {
      if (!editor.value) return ''
      
      switch (format) {
        case 'html':
          return editor.value.getHTML()
        case 'json':
          return editor.value.getJSON()
        case 'text':
          return editor.value.getText()
        default:
          return editor.value.getHTML()
      }
    },

    // 获取内联样式HTML（适用于邮件等场景）
    getInlineHTML: () => {
      if (!editor.value) return ''
      const html = editor.value.getHTML()
      return convertToInlineStyles(html)
    },

    // 设置内容
    setContent: (content: string, emitUpdate = true) => {
      if (editor.value) {
        editor.value.commands.setContent(content, { emitUpdate })
      }
    },

    // 清空内容
    clearContent: () => {
      if (editor.value) {
        editor.value.commands.clearContent()
      }
    },

    // 聚焦编辑器
    focus: (position?: 'start' | 'end' | number) => {
      if (editor.value) {
        if (position === 'start') {
          editor.value.commands.focus('start')
        } else if (position === 'end') {
          editor.value.commands.focus('end')
        } else if (typeof position === 'number') {
          editor.value.commands.focus(position)
        } else {
          editor.value.commands.focus()
        }
      }
    },

    // 失焦编辑器
    blur: () => {
      if (editor.value) {
        editor.value.commands.blur()
      }
    },

    // 插入内容
    insertContent: (content: string) => {
      if (editor.value) {
        editor.value.commands.insertContent(content)
      }
    },

    // 撤销
    undo: () => {
      if (editor.value) {
        editor.value.commands.undo()
      }
    },

    // 重做
    redo: () => {
      if (editor.value) {
        editor.value.commands.redo()
      }
    },
  }

  // 计算属性
  const editorRef = computed(() => state.value.editor as any)
  const isEditable = computed(() => state.value.isEditable)
  const isFocused = computed(() => state.value.isFocused)
  const isReady = computed(() => !!editor.value)
  const isEmpty = computed(() => {
    if (!editor.value) return true
    return editor.value.isEmpty
  })
  const wordCount = computed(() => state.value.wordCount)
  const characterCount = computed(() => state.value.characterCount)
  const selection = computed(() => state.value.selection)
  const contentStats = computed(() => ({
    words: wordCount.value,
    characters: characterCount.value,
    charactersWithoutSpaces: characterCount.value - (editor.value?.getText().match(/\s/g)?.length || 0),
    paragraphs: editor.value?.getText().split('\n\n').filter(p => p.trim()).length || 0,
    sentences: editor.value?.getText().split(/[.!?]+/).filter(s => s.trim()).length || 0,
    readingTime: Math.ceil(wordCount.value / 200) // 假设每分钟200词
  }))
  const canUndo = computed(() => editor.value?.can().undo() ?? false)
  const canRedo = computed(() => editor.value?.can().redo() ?? false)

  // 清理
  onBeforeUnmount(() => {
    if (editor.value) {
      editor.value.destroy()
    }
  })

  return {
    editor: editorRef,
    state,
    isEditable,
    isFocused,
    isReady,
    isEmpty,
    wordCount,
    characterCount,
    selection,
    contentStats,
    canUndo,
    canRedo,
    ...editorMethods,
  }
}