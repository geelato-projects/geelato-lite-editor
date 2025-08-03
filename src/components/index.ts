// 主编辑器组件
export { default as GeelatoLiteEditor } from './GeelatoLiteEditor.vue'

// 工具栏组件
export { default as EditorToolbar } from './toolbar/EditorToolbar.vue'

// 编辑器内容组件
export { default as EditorContent } from './editor/EditorContent.vue'

// UI 组件
export { default as ToolbarButton } from './ui/ToolbarButton.vue'
export { default as ToolbarSeparator } from './ui/ToolbarSeparator.vue'
export { default as InputModal } from './ui/InputModal.vue'
export { default as FloatingPanel } from './ui/FloatingPanel.vue'
export { default as ColorPicker } from '../extensions/highlight/ColorPicker.vue'
export { default as HighlightPanel } from '../extensions/highlight/HighlightPanel.vue'

// 编辑器扩展组件

// 类型导出
export type {
  // 编辑器相关类型
  // EditorMode, // 类型不存在，已注释
  ThemeType,
  ComponentSize,
  ToolbarMode,
  ToolbarConfig,
  // EditorContent, // 与组件名冲突，已注释
  SelectionState,
  GeelateLiteEditorProps,
  GeelateLiteEditorEmits,
  ToolbarButtonConfig,
  GeelatoEditorState,
  
  // 内容相关类型
  ContentFormat,
  ContentValidationRule,
  ContentValidationResult,
  ContentConvertOptions,
  LinkConfig,
  TableConfig,
  CodeBlockConfig,
  ListConfig,
  HeadingConfig,
  ExportOptions,
  ContentStats,
  ContentHistory,
  AutoSaveConfig,
  
  // 通用类型
  BaseComponent,
  EventHandler,
  AsyncFunction,
  MaybeAsyncFunction,
  DeepPartial,
  DeepReadonly,
} from '../types'

// 组合式函数导出
export { useEditor } from '../composables/useEditor'
export { useToolbar } from '../composables/useToolbar'
export { useTheme } from '../composables/useTheme'

// 扩展导出
export {
  createBaseExtensions,
  createTableExtensions,
  createStyleExtensions,
  createImageExtensions,
  createExtensions,
  EXTENSION_CONFIGS,
} from '../extensions'

// 工具函数导出（如果有的话）
// export * from '../utils'