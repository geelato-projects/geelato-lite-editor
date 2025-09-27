import { ref, computed, watch, unref } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import type { MaybeRef } from 'vue'
import type {
  ToolbarMode,
  ToolbarConfig,
  ToolbarButtonConfig,
  // ComponentSize
} from '../types'

// 工具栏按钮定义
const TOOLBAR_BUTTONS: Record<string, ToolbarButtonConfig> = {
  bold: {
    name: 'bold',
    icon: 'bold',
    title: '粗体 (Ctrl+B)',
    command: 'toggleBold',
    isActive: (editor) => editor.isActive('bold'),
    isDisabled: (editor) => !editor.can().chain().focus().toggleBold().run(),
    action: (editor) => editor.chain().focus().toggleBold().run(),
  },
  italic: {
    name: 'italic',
    icon: 'italic',
    title: '斜体 (Ctrl+I)',
    command: 'toggleItalic',
    isActive: (editor) => editor.isActive('italic'),
    isDisabled: (editor) => !editor.can().chain().focus().toggleItalic().run(),
    action: (editor) => editor.chain().focus().toggleItalic().run(),
  },
  underline: {
    name: 'underline',
    icon: 'underline',
    title: '下划线 (Ctrl+U)',
    command: 'toggleUnderline',
    isActive: (editor) => editor.isActive('underline'),
    isDisabled: (editor) => !editor.can().chain().focus().toggleUnderline().run(),
    action: (editor) => editor.chain().focus().toggleUnderline().run(),
  },
  strike: {
    name: 'strike',
    icon: 'strikethrough',
    title: '删除线',
    command: 'toggleStrike',
    isActive: (editor) => editor.isActive('strike'),
    isDisabled: (editor) => !editor.can().chain().focus().toggleStrike().run(),
    action: (editor) => editor.chain().focus().toggleStrike().run(),
  },
  code: {
    name: 'code',
    icon: 'code',
    title: '行内代码 (Ctrl+`)',
    command: 'toggleCode',
    isActive: (editor) => editor.isActive('code'),
    isDisabled: (editor) => !editor.can().chain().focus().toggleCode().run(),
    action: (editor) => editor.chain().focus().toggleCode().run(),
  },
  heading: {
    name: 'heading',
    icon: 'heading',
    title: '标题',
    command: 'toggleHeading',
    isActive: (editor) => editor.isActive('heading'),
    isDisabled: (editor) => false,
    action: (editor) => {
      // 循环切换标题级别
      if (editor.isActive('heading', { level: 1 })) {
        editor.chain().focus().toggleHeading({ level: 2 }).run()
      } else if (editor.isActive('heading', { level: 2 })) {
        editor.chain().focus().toggleHeading({ level: 3 }).run()
      } else if (editor.isActive('heading', { level: 3 })) {
        editor.chain().focus().setParagraph().run()
      } else {
        editor.chain().focus().toggleHeading({ level: 1 }).run()
      }
    },
  },
  paragraph: {
    name: 'paragraph',
    icon: 'paragraph',
    title: '段落',
    command: 'setParagraph',
    isActive: (editor) => editor.isActive('paragraph'),
    isDisabled: (editor) => !editor.can().chain().focus().setParagraph().run(),
    action: (editor) => editor.chain().focus().setParagraph().run(),
  },
  blockquote: {
    name: 'blockquote',
    icon: 'quote',
    title: '引用块',
    command: 'toggleBlockquote',
    isActive: (editor) => editor.isActive('blockquote'),
    isDisabled: (editor) => !editor.can().chain().focus().toggleBlockquote().run(),
    action: (editor) => editor.chain().focus().toggleBlockquote().run(),
  },
  bulletList: {
    name: 'bulletList',
    icon: 'list-unordered',
    title: '无序列表',
    command: 'toggleBulletList',
    isActive: (editor) => editor.isActive('bulletList'),
    isDisabled: (editor) => !editor.can().chain().focus().toggleBulletList().run(),
    action: (editor) => editor.chain().focus().toggleBulletList().run(),
  },
  orderedList: {
    name: 'orderedList',
    icon: 'list-ordered',
    title: '有序列表',
    command: 'toggleOrderedList',
    isActive: (editor) => editor.isActive('orderedList'),
    isDisabled: (editor) => !editor.can().chain().focus().toggleOrderedList().run(),
    action: (editor) => editor.chain().focus().toggleOrderedList().run(),
  },
  codeBlock: {
    name: 'codeBlock',
    icon: 'code-block',
    title: '代码块',
    command: 'toggleCodeBlock',
    isActive: (editor) => editor.isActive('codeBlock'),
    isDisabled: (editor) => !editor.can().chain().focus().toggleCodeBlock().run(),
    action: (editor) => editor.chain().focus().toggleCodeBlock().run(),
  },
  link: {
    name: 'link',
    icon: 'link',
    title: '链接 (Ctrl+K)',
    command: 'toggleLink',
    isActive: (editor) => editor.isActive('link'),
    isDisabled: (editor) => false,
    action: (editor) => {
      // 这里需要打开链接输入对话框
      // 实际实现会在组件中处理
    },
  },
  image: {
    name: 'image',
    icon: 'image',
    title: '图片',
    command: 'setImage',
    isActive: (editor) => editor.isActive('image'),
    isDisabled: (editor) => !editor.can().chain().focus().setImage({ src: '' }).run(),
    action: (editor) => {
      // 这里需要打开图片选择对话框
      // 实际实现会在组件中处理
    },
  },
  textColor: {
    name: 'textColor',
    icon: 'font-color',
    title: '文字颜色',
    command: 'setColor',
    isActive: (editor) => {
      const textStyle = editor.getAttributes('textStyle')
      return !!textStyle?.color
    },
    isDisabled: (editor) => !editor.can().chain().focus().setColor('#000000').run(),
    action: (editor) => {
      // 这里需要打开颜色选择器
      // 实际实现会在组件中处理
    },
  },
  highlight: {
    name: 'highlight',
    icon: 'highlight',
    title: '高亮标记 (Ctrl+Shift+H)',
    command: 'toggleHighlight',
    isActive: (editor) => editor.isActive('highlight'),
    isDisabled: (editor) => !editor.can().chain().focus().toggleHighlight().run(),
    action: (editor) => editor.chain().focus().toggleHighlight().run(),
  },
  undo: {
    name: 'undo',
    icon: 'undo',
    title: '撤销 (Ctrl+Z)',
    command: 'undo',
    isActive: (editor) => false,
    isDisabled: (editor) => !editor.can().chain().focus().undo().run(),
    action: (editor) => editor.chain().focus().undo().run(),
  },
  redo: {
    name: 'redo',
    icon: 'redo',
    title: '重做 (Ctrl+Y)',
    command: 'redo',
    isActive: (editor) => false,
    isDisabled: (editor) => !editor.can().chain().focus().redo().run(),
    action: (editor) => editor.chain().focus().redo().run(),
  },
  alignLeft: {
    name: 'alignLeft',
    icon: 'align-left',
    title: '左对齐',
    command: 'setAlign',
    isActive: (editor) => {
      // 检查是否选中图片
      if (editor.isActive('image')) {
        return editor.getAttributes('image').align === 'left'
      }
      // 检查文本对齐
      return editor.isActive({ textAlign: 'left' })
    },
    isDisabled: (editor) => {
      // 如果选中图片，检查是否可以更新图片属性
      if (editor.isActive('image')) {
        return !editor.can().chain().focus().updateAttributes('image', { align: 'left' }).run()
      }
      // 检查文本对齐
      return !editor.can().chain().focus().setTextAlign('left').run()
    },
    action: (editor) => {
      // 如果选中图片，设置图片对齐
      if (editor.isActive('image')) {
        editor.chain().focus().updateAttributes('image', { align: 'left' }).run()
      } else {
        // 设置文本对齐
        editor.chain().focus().setTextAlign('left').run()
      }
    },
  },
  alignCenter: {
    name: 'alignCenter',
    icon: 'align-center',
    title: '居中对齐',
    command: 'setAlign',
    isActive: (editor) => {
      // 检查是否选中图片
      if (editor.isActive('image')) {
        return editor.getAttributes('image').align === 'center'
      }
      // 检查文本对齐
      return editor.isActive({ textAlign: 'center' })
    },
    isDisabled: (editor) => {
      // 如果选中图片，检查是否可以更新图片属性
      if (editor.isActive('image')) {
        return !editor.can().chain().focus().updateAttributes('image', { align: 'center' }).run()
      }
      // 检查文本对齐
      return !editor.can().chain().focus().setTextAlign('center').run()
    },
    action: (editor) => {
      // 如果选中图片，设置图片对齐
      if (editor.isActive('image')) {
        editor.chain().focus().updateAttributes('image', { align: 'center' }).run()
      } else {
        // 设置文本对齐
        editor.chain().focus().setTextAlign('center').run()
      }
    },
  },
  alignRight: {
    name: 'alignRight',
    icon: 'align-right',
    title: '右对齐',
    command: 'setAlign',
    isActive: (editor) => {
      // 检查是否选中图片
      if (editor.isActive('image')) {
        return editor.getAttributes('image').align === 'right'
      }
      // 检查文本对齐
      return editor.isActive({ textAlign: 'right' })
    },
    isDisabled: (editor) => {
      // 如果选中图片，检查是否可以更新图片属性
      if (editor.isActive('image')) {
        return !editor.can().chain().focus().updateAttributes('image', { align: 'right' }).run()
      }
      // 检查文本对齐
      return !editor.can().chain().focus().setTextAlign('right').run()
    },
    action: (editor) => {
      // 如果选中图片，设置图片对齐
      if (editor.isActive('image')) {
        editor.chain().focus().updateAttributes('image', { align: 'right' }).run()
      } else {
        // 设置文本对齐
        editor.chain().focus().setTextAlign('right').run()
      }
    },
  },
  alignJustify: {
    name: 'alignJustify',
    icon: 'align-justify',
    title: '两端对齐',
    command: 'setTextAlign',
    isActive: (editor) => {
      // 两端对齐只适用于文本，如果选中图片则不激活
      if (editor.isActive('image')) {
        return false
      }
      return editor.isActive({ textAlign: 'justify' })
    },
    isDisabled: (editor) => {
      // 如果选中图片，禁用两端对齐
      if (editor.isActive('image')) {
        return true
      }
      return !editor.can().chain().focus().setTextAlign('justify').run()
    },
    action: (editor) => {
      // 两端对齐只适用于文本
      if (!editor.isActive('image')) {
        editor.chain().focus().setTextAlign('justify').run()
      }
    },
  },
  taskList: {
    name: 'taskList',
    icon: 'task-list',
    title: '任务列表',
    command: 'toggleTaskList',
    isActive: (editor) => editor.isActive('taskList'),
    isDisabled: (editor) => !editor.can().chain().focus().toggleTaskList().run(),
    action: (editor) => editor.chain().focus().toggleTaskList().run(),
  },
  table: {
    name: 'table',
    icon: 'table',
    title: '表格操作',
    command: 'table',
    isActive: (editor) => editor.isActive('table'),
    isDisabled: () => false,
    action: () => {
      // 这里不执行任何操作，由下拉菜单处理
    },
  },
  list: {
    name: 'list',
    icon: 'list-unordered',
    title: '列表操作',
    command: 'list',
    isActive: (editor) => editor.isActive('bulletList') || editor.isActive('orderedList') || editor.isActive('taskList'),
    isDisabled: () => false,
    action: () => {
      // 这里不执行任何操作，由下拉菜单处理
    },
  },
  insertTable: {
    name: 'insertTable',
    icon: 'table',
    title: '插入表格',
    command: 'insertTable',
    isActive: () => false,
    isDisabled: (editor) => !editor.can().chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
    action: (editor) => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
  },
  addColumnBefore: {
    name: 'addColumnBefore',
    icon: 'column-add-before',
    title: '在前面插入列',
    command: 'addColumnBefore',
    isActive: () => false,
    isDisabled: (editor) => !editor.can().chain().focus().addColumnBefore().run(),
    action: (editor) => editor.chain().focus().addColumnBefore().run(),
  },
  addColumnAfter: {
    name: 'addColumnAfter',
    icon: 'column-add-after',
    title: '在后面插入列',
    command: 'addColumnAfter',
    isActive: () => false,
    isDisabled: (editor) => !editor.can().chain().focus().addColumnAfter().run(),
    action: (editor) => editor.chain().focus().addColumnAfter().run(),
  },
  deleteColumn: {
    name: 'deleteColumn',
    icon: 'column-delete',
    title: '删除列',
    command: 'deleteColumn',
    isActive: () => false,
    isDisabled: (editor) => !editor.can().chain().focus().deleteColumn().run(),
    action: (editor) => editor.chain().focus().deleteColumn().run(),
  },
  addRowBefore: {
    name: 'addRowBefore',
    icon: 'row-add-before',
    title: '在上面插入行',
    command: 'addRowBefore',
    isActive: () => false,
    isDisabled: (editor) => !editor.can().chain().focus().addRowBefore().run(),
    action: (editor) => editor.chain().focus().addRowBefore().run(),
  },
  addRowAfter: {
    name: 'addRowAfter',
    icon: 'row-add-after',
    title: '在下面插入行',
    command: 'addRowAfter',
    isActive: () => false,
    isDisabled: (editor) => !editor.can().chain().focus().addRowAfter().run(),
    action: (editor) => editor.chain().focus().addRowAfter().run(),
  },
  deleteRow: {
    name: 'deleteRow',
    icon: 'row-delete',
    title: '删除行',
    command: 'deleteRow',
    isActive: () => false,
    isDisabled: (editor) => !editor.can().chain().focus().deleteRow().run(),
    action: (editor) => editor.chain().focus().deleteRow().run(),
  },
  deleteTable: {
    name: 'deleteTable',
    icon: 'table-delete',
    title: '删除表格',
    command: 'deleteTable',
    isActive: () => false,
    isDisabled: (editor) => !editor.can().chain().focus().deleteTable().run(),
    action: (editor) => editor.chain().focus().deleteTable().run(),
  },
  mergeCells: {
    name: 'mergeCells',
    icon: 'merge-cells',
    title: '合并单元格',
    command: 'mergeCells',
    isActive: () => false,
    isDisabled: (editor) => !editor.can().chain().focus().mergeCells().run(),
    action: (editor) => editor.chain().focus().mergeCells().run(),
  },
  splitCell: {
    name: 'splitCell',
    icon: 'split-cell',
    title: '拆分单元格',
    command: 'splitCell',
    isActive: () => false,
    isDisabled: (editor) => !editor.can().chain().focus().splitCell().run(),
    action: (editor) => editor.chain().focus().splitCell().run(),
  },
  tableFillColor: {
    name: 'tableFillColor',
    icon: 'fill-color',
    title: '填充颜色',
    command: 'tableFillColor',
    isActive: (editor) => {
      const tableCell = editor.getAttributes('tableCell')
      return !!tableCell?.backgroundColor
    },
    isDisabled: (editor) => !editor.isActive('table'),
    action: () => {
      // 这里会在工具栏组件中处理
    }
  },
}

// 预定义工具栏配置
const TOOLBAR_CONFIGS: Record<ToolbarMode, string[]> = {
  full: [
    'undo', 'redo','bold', 'italic', 'underline', 'strike',    'textColor', 'highlight','|',
    'heading', 'paragraph', '|',
    'alignLeft', 'alignCenter', 'alignRight', 'alignJustify', '|',
    'list', 'blockquote', '|',
    'image', 'link','|',
    'table', 'tableFillColor', '|',
    'mergeCells', 'splitCell', '|',
  ],
  simple: [
    'undo', 'redo','bold', 'italic', 'underline', 'textColor',  '|',
    'heading', 'list', '|',
    'alignLeft', 'alignCenter', 'alignRight', '|',
    'link', 'image', 'table', 'tableFillColor'
  ],
  minimal: [
    'bold', 'italic', 'textColor','heading', 'list'
  ],
  none: []
}

// 工具栏组合式函数
export function useToolbar(
  editor: MaybeRef<Editor | null>,
  config: MaybeRef<ToolbarMode | ToolbarConfig | boolean> = 'simple'
) {
  const toolbarConfig = ref<ToolbarConfig>({
    mode: 'simple',
    size: 'medium',
    showSeparator: true,
  })

  // 解析工具栏配置
  const parseConfig = (config: ToolbarMode | ToolbarConfig | boolean) => {
    if (typeof config === 'boolean') {
      return config ? { mode: 'simple' as ToolbarMode } : { mode: 'minimal' as ToolbarMode }
    }
    if (typeof config === 'string') {
      return { mode: config }
    }
    return config
  }

  // 更新配置
  const updateConfig = (newConfig: ToolbarMode | ToolbarConfig | boolean) => {
    const parsed = parseConfig(newConfig)
    toolbarConfig.value = { ...toolbarConfig.value, ...parsed }
  }

  // 初始化配置
  updateConfig(unref(config))

  // 获取工具栏项目
  const toolbarItems = computed(() => {
    const { mode, items } = toolbarConfig.value
    return items || TOOLBAR_CONFIGS[mode || 'simple'] || TOOLBAR_CONFIGS.simple
  })

  // 获取按钮配置
  const getButtonConfig = (name: string): ToolbarButtonConfig | null => {
    return TOOLBAR_BUTTONS[name] || null
  }

  // 检查按钮是否激活
  const isButtonActive = (name: string): boolean => {
    const currentEditor = unref(editor)
    if (!currentEditor) return false
    const button = getButtonConfig(name)
    return button?.isActive?.(currentEditor) ?? false
  }

  // 检查按钮是否禁用
  const isButtonDisabled = (name: string): boolean => {
    const currentEditor = unref(editor)
    if (!currentEditor) return true
    
    // 如果编辑器不可编辑，所有按钮都应该被禁用
    if (!currentEditor.isEditable) return true
    
    const button = getButtonConfig(name)
    return button?.isDisabled?.(currentEditor) ?? false
  }

  // 执行按钮动作
  const executeButtonAction = (name: string) => {
    const currentEditor = unref(editor)
    if (!currentEditor) return
    const button = getButtonConfig(name)
    button?.action?.(currentEditor)
  }

  // 监听配置变化
  watch(
    () => unref(config),
    (newConfig) => {
      updateConfig(newConfig)
    },
    { deep: true }
  )

  // 监听编辑器变化
  watch(
    () => unref(editor),
    (newEditor) => {
      if (newEditor) {
        // 编辑器准备就绪，可以进行操作
      }
    },
    { immediate: true }
  )

  return {
    toolbarConfig,
    toolbarItems,
    updateConfig,
    getButtonConfig,
    isButtonActive,
    isButtonDisabled,
    executeButtonAction,
  }
}