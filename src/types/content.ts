/**
 * 内容格式类型
 * @description 编辑器支持的内容格式
 * @example 'html' | 'markdown' | 'json' | 'text'
 */
export type ContentFormat = 'html' | 'markdown' | 'json' | 'text'

/**
 * 内容验证规则
 * @description 用于验证编辑器内容的规则配置
 * @example
 * ```typescript
 * const rule: ContentValidationRule = {
 *   required: true,
 *   minLength: 10,
 *   maxLength: 1000,
 *   pattern: /^[a-zA-Z0-9\s]+$/
 * }
 * ```
 */
export interface ContentValidationRule {
  /** 
   * 是否必填
   * @default false
   */
  required?: boolean
  /** 
   * 最小长度
   * @example 10
   */
  minLength?: number
  /** 
   * 最大长度
   * @example 1000
   * @dependency 优先级高于编辑器的 maxLength 属性
   */
  maxLength?: number
  /** 
   * 正则表达式验证
   * @example /^[a-zA-Z0-9\s]+$/
   */
  pattern?: RegExp
  /** 
   * 自定义验证函数
   * @param content 待验证的内容
   * @returns true 表示验证通过，string 表示错误信息
   * @dependency 优先级最高，会覆盖其他验证规则
   */
  custom?: (content: string) => boolean | string
}

/**
 * 内容验证结果
 * @description 内容验证的结果信息
 */
export interface ContentValidationResult {
  /** 验证是否通过 */
  valid: boolean
  /** 错误信息列表 */
  errors: string[]
}

/**
 * 内容转换选项
 * @description 不同格式间内容转换的配置
 * @example
 * ```typescript
 * const options: ContentConvertOptions = {
 *   from: 'markdown',
 *   to: 'html',
 *   preserveWhitespace: true,
 *   sanitize: true
 * }
 * ```
 */
export interface ContentConvertOptions {
  /** 源格式 */
  from: ContentFormat
  /** 目标格式 */
  to: ContentFormat
  /** 
   * 是否保留空白字符
   * @default false
   */
  preserveWhitespace?: boolean
  /** 
   * 是否进行内容清理
   * @default true
   * @description 移除潜在的恶意代码
   */
  sanitize?: boolean
}



/**
 * 链接配置
 * @description 编辑器链接功能的配置选项
 * @example
 * ```typescript
 * const config: LinkConfig = {
 *   openOnClick: false,
 *   target: '_blank',
 *   rel: 'noopener noreferrer'
 * }
 * ```
 */
export interface LinkConfig {
  /** 
   * 是否点击时打开链接
   * @default false
   * @description 编辑模式下建议设为 false
   */
  openOnClick?: boolean
  /** 
   * 链接打开方式
   * @default '_blank'
   */
  target?: '_blank' | '_self' | '_parent' | '_top'
  /** 
   * 链接关系属性
   * @example 'noopener noreferrer'
   * @default 'noopener noreferrer'
   */
  rel?: string
  /** 
   * 链接验证函数
   * @param url 待验证的链接
   * @returns 是否为有效链接
   */
  validate?: (url: string) => boolean
}

/**
 * 表格配置
 * @description 编辑器表格功能的配置选项
 * @example
 * ```typescript
 * const config: TableConfig = {
 *   resizable: true,
 *   cellMinWidth: 100,
 *   allowTableNodeSelection: true
 * }
 * ```
 */
export interface TableConfig {
  /** 
   * 是否允许调整列宽
   * @default true
   */
  resizable?: boolean
  /** 
   * 单元格最小宽度
   * @example 100
   * @default 50
   */
  cellMinWidth?: number
  /** 
   * 是否允许选择整个表格节点
   * @default true
   */
  allowTableNodeSelection?: boolean
}

/**
 * 代码块配置
 * @description 编辑器代码块功能的配置选项
 * @example
 * ```typescript
 * const config: CodeBlockConfig = {
 *   languageClassPrefix: 'language-',
 *   exitOnTripleEnter: true,
 *   defaultLanguage: 'javascript'
 * }
 * ```
 */
export interface CodeBlockConfig {
  /** 
   * 语言类名前缀
   * @example 'language-'
   * @default 'language-'
   */
  languageClassPrefix?: string
  /** 
   * 是否允许三次回车退出代码块
   * @default true
   */
  exitOnTripleEnter?: boolean
  /** 
   * 是否允许向下箭头退出代码块
   * @default true
   */
  exitOnArrowDown?: boolean
  /** 
   * 默认编程语言
   * @example 'javascript'
   * @default 'text'
   */
  defaultLanguage?: string
}

/**
 * 列表配置
 * @description 编辑器列表功能的配置选项
 * @example
 * ```typescript
 * const config: ListConfig = {
 *   itemTypeName: 'listItem',
 *   keepMarks: true,
 *   keepAttributes: false
 * }
 * ```
 */
export interface ListConfig {
  /** 
   * 列表项类型名称
   * @example 'listItem'
   * @default 'listItem'
   */
  itemTypeName?: string
  /** 
   * 是否保留标记格式
   * @default true
   */
  keepMarks?: boolean
  /** 
   * 是否保留属性
   * @default false
   */
  keepAttributes?: boolean
}

/**
 * 标题配置
 * @description 编辑器标题功能的配置选项
 * @example
 * ```typescript
 * const config: HeadingConfig = {
 *   levels: [1, 2, 3, 4, 5, 6]
 * }
 * ```
 */
export interface HeadingConfig {
  /** 
   * 允许的标题级别
   * @example [1, 2, 3, 4, 5, 6]
   * @default [1, 2, 3, 4, 5, 6]
   */
  levels?: number[]
}

/**
 * 内容导出选项
 * @description 内容导出功能的配置选项
 * @example
 * ```typescript
 * const options: ExportOptions = {
 *   format: 'html',
 *   filename: 'document.html',
 *   includeStyles: true
 * }
 * ```
 */
export interface ExportOptions {
  /** 导出格式 */
  format: ContentFormat
  /** 
   * 文件名
   * @example 'document.html'
   * @dependency 当未提供时，将根据 format 自动生成
   */
  filename?: string
  /** 
   * 是否包含样式
   * @default true
   * @dependency 仅对 html 格式有效
   */
  includeStyles?: boolean
  /** 
   * 自定义样式
   * @example 'body { font-family: Arial; }'
   * @dependency 仅当 includeStyles 为 true 时有效
   */
  customStyles?: string
}

/**
 * 内容统计信息
 * @description 编辑器内容的统计信息
 */
export interface ContentStats {
  /** 字符数（包含空格） */
  characters: number
  /** 字符数（不包含空格） */
  charactersWithoutSpaces: number
  /** 单词数 */
  words: number
  /** 段落数 */
  paragraphs: number
  /** 句子数 */
  sentences: number
  /** 
   * 预估阅读时间（分钟）
   * @description 基于平均阅读速度计算
   */
  readingTime: number
}

/**
 * 内容历史记录
 * @description 编辑器内容的历史记录
 */
export interface ContentHistory {
  /** 历史记录唯一标识 */
  id: string
  /** 历史内容 */
  content: string
  /** 时间戳 */
  timestamp: number
  /** 
   * 历史记录描述
   * @example '自动保存' | '手动保存'
   */
  description?: string
}

/**
 * 自动保存配置
 * @description 编辑器自动保存功能的配置选项
 * @example
 * ```typescript
 * const config: AutoSaveConfig = {
 *   enabled: true,
 *   interval: 30000, // 30秒
 *   key: 'editor-content'
 * }
 * ```
 */
export interface AutoSaveConfig {
  /** 
   * 是否启用自动保存
   * @default false
   */
  enabled: boolean
  /** 
   * 自动保存间隔（毫秒）
   * @example 30000 // 30秒
   * @default 60000 // 1分钟
   * @dependency 仅当 enabled 为 true 时有效
   */
  interval: number
  /** 
   * 本地存储键名
   * @example 'editor-content'
   * @default 'geelato-editor-content'
   */
  key?: string
  /** 
   * 保存回调
   * @param content 保存的内容
   */
  onSave?: (content: string) => void
  /** 
   * 恢复回调
   * @param content 恢复的内容
   */
  onRestore?: (content: string) => void
}