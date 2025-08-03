import type { Extension, Editor } from '@tiptap/core'
import type { IconName } from '../components/ui/icons'

/**
 * 主题类型
 * @description 编辑器主题配置
 * @example 'light' | 'dark' | 'auto'
 */
export type ThemeType = 'light' | 'dark' | 'auto'

/**
 * 组件尺寸
 * @description 影响工具栏按钮、编辑器高度等UI元素的大小
 * @example 'small' | 'medium' | 'large'
 */
export type ComponentSize = 'small' | 'medium' | 'large'

/**
 * 工具栏模式
 * @description 预定义的工具栏显示模式
 * - 'full': 显示所有工具栏按钮
 * - 'simple': 显示常用工具栏按钮
 * - 'minimal': 显示最少的工具栏按钮
 * - 'none': 不显示工具栏
 * @example 'full'
 */
export type ToolbarMode = 'full' | 'simple' | 'minimal' | 'none'

/**
 * 工具栏配置
 * @description 自定义工具栏的详细配置
 * @dependency 当 mode 为 'none' 时，其他属性将被忽略
 * @dependency 当 items 存在时，mode 属性将被忽略，使用自定义按钮列表
 */
export interface ToolbarConfig {
  /** 工具栏模式，与 items 互斥 */
  mode?: ToolbarMode
  /** 自定义工具栏按钮列表，优先级高于 mode */
  items?: string[]
  /** 工具栏按钮大小 */
  size?: ComponentSize
  /** 是否显示分隔符 */
  showSeparator?: boolean
}

/**
 * 编辑器内容
 * @description 编辑器内容的多种格式表示
 */
export interface EditorContent {
  /** HTML 格式内容 */
  html: string
  /** JSON 格式内容（TipTap 原生格式） */
  json: any
  /** 纯文本内容 */
  text: string
}

/**
 * 编辑器选择状态
 * @description 当前文本选择的位置信息
 */
export interface SelectionState {
  /** 选择开始位置 */
  from: number
  /** 选择结束位置 */
  to: number
  /** 是否为空选择（光标位置） */
  empty: boolean
}

/**
 * 编辑器Props
 * @description Geelato Lite Editor 组件的属性配置
 * @example
 * ```typescript
 * const props: GeelateLiteEditorProps = {
 *   modelValue: '<p>Hello World</p>',
 *   editable: true,
 *   theme: 'light',
 *   toolbar: 'full',
 *   height: '400px'
 * }
 * ```
 */
export interface GeelateLiteEditorProps {
  /** 
   * 编辑器内容，支持双向绑定
   * @example '<p>Hello World</p>'
   */
  modelValue?: string
  
  /** 
   * 是否可编辑
   * @default true
   * @dependency 当为 false 时，toolbar 将被强制隐藏
   */
  editable?: boolean
  
  /** 
   * 占位符文本
   * @example '请输入内容...'
   */
  placeholder?: string
  
  /** 
   * 主题配置
   * @default 'light'
   * @example 'dark'
   */
  theme?: ThemeType
  
  /** 
   * 工具栏配置
   * @description 支持多种配置方式：
   * - boolean: true 显示默认工具栏，false 隐藏工具栏
   * - ToolbarMode: 使用预定义模式
   * - ToolbarConfig: 自定义配置
   * @default true
   * @dependency 当 editable 为 false 时，此属性无效
   * @example 'full' | { mode: 'simple', size: 'small' }
   */
  toolbar?: ToolbarMode | ToolbarConfig | boolean
  
  /** 
   * 编辑器高度
   * @example '400px' | 400
   * @dependency 当设置了 minHeight 或 maxHeight 时，height 值会受到限制
   */
  height?: string | number
  
  /** 
   * 最小高度
   * @example '200px' | 200
   * @dependency 优先级高于 height，当 height 小于 minHeight 时，实际高度为 minHeight
   */
  minHeight?: string | number
  
  /** 
   * 最大高度
   * @example '800px' | 800
   * @dependency 优先级高于 height，当 height 大于 maxHeight 时，实际高度为 maxHeight
   */
  maxHeight?: string | number
  
  /** 
   * 是否自动聚焦
   * @default false
   * @dependency 当 disabled 或 readonly 为 true 时，此属性无效
   */
  autofocus?: boolean
  
  /** 
   * 内容最大长度
   * @example 1000
   * @description 超出长度时会阻止继续输入
   */
  maxLength?: number
  
  /** 
   * 扩展配置
   * @description TipTap 编辑器扩展列表
   * @example [Bold, Italic, Underline]
   */
  extensions?: Extension[]
  
  /** 
   * 编辑器配置
   * @description TipTap 编辑器的原生配置选项
   * @example { handleDOMEvents: { ... } }
   */
  editorProps?: Record<string, any>
  
  /** 
   * 是否禁用
   * @default false
   * @dependency 当为 true 时，editable、autofocus、toolbar 等交互相关属性将被忽略
   */
  disabled?: boolean
  
  /** 
   * 是否只读
   * @default false
   * @dependency 当为 true 时，内容不可编辑但可选择，toolbar 仍可显示
   */
  readonly?: boolean
  
  /** 
   * 组件尺寸
   * @default 'medium'
   * @description 影响编辑器整体大小和工具栏按钮尺寸
   */
  size?: ComponentSize
  
  /** 
   * 是否显示边框
   * @default true
   */
  bordered?: boolean
  
  /** 
   * 主题色配置
   * @default '#1890ff'
   * @description 编辑器的主色调，影响按钮激活状态、链接颜色等
   * @example '#1890ff' | '#52c41a' | '#f5222d'
   */
  primaryColor?: string
  
  /** 
   * 是否显示工具栏
   * @default true
   * @dependency 此属性与 toolbar 属性配合使用，当 toolbar 为 false 时，此属性无效
   * @deprecated 建议使用 toolbar 属性替代
   */
  showToolbar?: boolean
  
  /** 
   * 是否显示状态栏
   * @default false
   * @description 显示字数统计、选择状态等信息
   */
  showStatusBar?: boolean
  

  
  /** 
   * 自定义类名
   * @example 'my-editor custom-style'
   */
  class?: string
  
  /** 
   * 自定义样式
   * @example { backgroundColor: '#f5f5f5' } | 'background-color: #f5f5f5;'
   */
  style?: string | Record<string, any>
  
  /** 
   * 内容区域自定义类名
   * @example 'my-content-class'
   */
  contentClass?: string
  
  /** 
   * 工具栏自定义类名
   * @example 'my-toolbar-class'
   */
  toolbarClass?: string
  
  /** 
   * 自动获取焦点
   * @default false
   */
  autoFocus?: boolean
  
  /** 
   * 是否显示工具栏分隔符
   * @default true
   */
  showToolbarSeparator?: boolean
}

// 编辑器事件
/**
 * 编辑器事件定义
 * @description Geelato Lite Editor 组件的事件回调
 */
export interface GeelateLiteEditorEmits {
  /** 
   * 内容更新事件
   * @description 双向绑定时触发，用于更新 v-model 值
   * @param value 更新后的 HTML 内容
   */
  'update:modelValue': [value: string]
  
  /** 
   * 内容变化事件
   * @description 编辑器内容发生变化时触发
   * @param content 包含多种格式的内容对象
   */
  'change': [content: EditorContent]
  
  /** 
   * 获得焦点事件
   * @description 编辑器获得焦点时触发
   * @param event 原生焦点事件
   */
  'focus': [event: FocusEvent]
  
  /** 
   * 失去焦点事件
   * @description 编辑器失去焦点时触发
   * @param event 原生焦点事件
   */
  'blur': [event: FocusEvent]
  
  /** 
   * 选择变化事件
   * @description 文本选择状态变化时触发
   * @param selection 选择状态信息
   */
  'selection-change': [selection: SelectionState]
  
  /** 
   * 编辑器创建事件
   * @description 编辑器实例创建完成时触发
   * @param editor TipTap 编辑器实例
   */
  'created': [editor: Editor]
  
  /** 
   * 编辑器销毁事件
   * @description 编辑器实例销毁时触发
   */
  'destroyed': []
  
  /** 
   * 错误事件
   * @description 编辑器运行过程中发生错误时触发
   * @param error 错误对象
   */
  'error': [error: Error]
}

// 工具栏按钮配置
/**
 * 工具栏按钮配置
 * @description 自定义工具栏按钮的配置选项
 * @example
 * ```typescript
 * const boldButton: ToolbarButtonConfig = {
 *   name: 'bold',
 *   icon: 'bold',
 *   title: '加粗',
 *   command: 'toggleBold',
 *   isActive: (editor) => editor.isActive('bold')
 * }
 * ```
 */
export interface ToolbarButtonConfig {
  /** 
   * 按钮名称（唯一标识）
   * @example 'bold'
   */
  name: string
  /** 
   * 按钮图标
   * @example 'bold' | 'italic'
   */
  icon?: IconName
  /** 
   * 按钮提示文本
   * @example '加粗'
   */
  title?: string
  /** 
   * 执行的命令名称
   * @example 'toggleBold'
   * @dependency 与 action 互斥，优先使用 action
   */
  command?: string
  /** 
   * 判断按钮是否处于激活状态
   * @param editor TipTap 编辑器实例
   * @returns 是否激活
   */
  isActive?: (editor: Editor) => boolean
  /** 
   * 判断按钮是否被禁用
   * @param editor TipTap 编辑器实例
   * @returns 是否禁用
   */
  isDisabled?: (editor: Editor) => boolean
  /** 
   * 自定义按钮点击行为
   * @param editor TipTap 编辑器实例
   * @dependency 优先级高于 command
   */
  action?: (editor: Editor) => void
}

/**
 * 编辑器状态
 * @description 编辑器当前状态的完整信息
 */
export interface GeelatoEditorState {
  /** TipTap 编辑器实例 */
  editor: Editor | null
  /** 当前内容（HTML 格式） */
  content: string
  /** 是否可编辑 */
  isEditable: boolean
  /** 是否获得焦点 */
  isFocused: boolean
  /** 当前选择状态 */
  selection: SelectionState | null
  /** 字数统计 */
  wordCount: number
  /** 字符数统计 */
  characterCount: number
}