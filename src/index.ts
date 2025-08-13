// 主组件导出
export { default as GeelatoLiteEditor } from './components/GeelatoLiteEditor.vue'

// 子组件导出
export {
  EditorToolbar,
  EditorContent,
  ToolbarButton,
  ToolbarSeparator,
  InputModal,
} from './components'

// 组合式函数导出
export {
  useEditor,
  useToolbar,
  useTheme,
} from './composables'

// 扩展导出
export {
  createBaseExtensions,
  createTableExtensions,
  createStyleExtensions,
  createImageExtensions,
  createExtensions,
  EXTENSION_CONFIGS,
} from './extensions'

// 类型导出
export type {
  // 编辑器相关类型
  Editor,
  ThemeType,
  ComponentSize,
  ToolbarMode,
  ToolbarConfig,
  EditorContent as EditorContentType,
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
} from './types'

// Vue 插件安装函数
import type { App } from 'vue'
import GeelatoLiteEditor from './components/GeelatoLiteEditor.vue'

export const install = (app: App) => {
  app.component('GeelatoLiteEditor', GeelatoLiteEditor)
}

// 插件对象类型
export interface GeelatoLiteEditorPlugin {
  install: (app: App) => void
  GeelatoLiteEditor: typeof GeelatoLiteEditor
}

// 默认导出
const plugin: GeelatoLiteEditorPlugin = {
  install,
  GeelatoLiteEditor,
}

export default plugin

// 版本信息
export const version = '1.0.0'