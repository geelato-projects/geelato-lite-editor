import { Extension } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import { TableKit } from '@tiptap/extension-table'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { TextAlign } from '@tiptap/extension-text-align'
import { Highlight } from '@tiptap/extension-highlight'
import { TaskList } from '@tiptap/extension-task-list'
import { TaskItem } from '@tiptap/extension-task-item'
import ImageExtension from './image'
import LinkExtension from './link'
// import SelectionExtension from './selection'

import type {
  HeadingConfig,
  LinkConfig,
  TableConfig,
  CodeBlockConfig,
  // ListConfig
} from '../types'

// 列表配置接口
interface ListConfig {
  nested?: boolean
}

// 扩展配置接口
export interface ExtensionConfig {
  heading?: HeadingConfig
  link?: LinkConfig
  table?: TableConfig
  codeBlock?: CodeBlockConfig
  list?: ListConfig
}

// 创建基础扩展
export const createBaseExtensions = (config: ExtensionConfig = {}): Extension[] => {
  return [
    // 使用默认的 StarterKit，但排除Link扩展
    StarterKit.configure({
      // 确保包含基础节点类型
      heading: {
        levels: [1, 2, 3, 4, 5, 6] as any,
      },
      codeBlock: {
        languageClassPrefix: 'language-',
      },
      // 排除默认的Link扩展
      link: false,
    }),
    // 添加自定义的Link扩展
    (LinkExtension as any).configure(config.link || {}),
  ]
}

// 创建表格扩展
export const createTableExtensions = (config: TableConfig = {}): Extension[] => {
  return [
    TableKit.configure({
      table: {
        resizable: config.resizable ?? true,
        cellMinWidth: config.cellMinWidth || 100,
        allowTableNodeSelection: config.allowTableNodeSelection ?? true,
        HTMLAttributes: {
          class: 'gl-table',
        },
      },
      tableRow: {
        HTMLAttributes: {
          class: 'gl-table-row',
        },
      },
      tableHeader: {
        HTMLAttributes: {
          class: 'gl-table-header',
        },
      },
      tableCell: {
        HTMLAttributes: {
          class: 'gl-table-cell',
        },
      },
    }),
  ]
}

// 创建样式扩展
export const createStyleExtensions = (): Extension[] => {
  return [
    TextStyle as any,
    (Color as any).configure({
      types: ['textStyle'],
    }),
    (Highlight as any).configure({
      multicolor: true,
      HTMLAttributes: {
        class: 'gl-highlight',
      },
    }),
    (TextAlign as any).configure({
      types: ['heading', 'paragraph'],
      alignments: ['left', 'center', 'right', 'justify'],
      defaultAlignment: 'left',
    }),
  ]
}

// 创建列表扩展
export const createListExtensions = (config: ListConfig = {}): Extension[] => {
  return [
    (TaskList as any).configure({
      HTMLAttributes: {
        class: 'gl-task-list',
      },
    }),
    (TaskItem as any).configure({
      nested: config.nested ?? true,
      HTMLAttributes: {
        class: 'gl-task-item',
      },
    }),
  ]
}

// 创建完整扩展集合
export const createExtensions = (config: ExtensionConfig = {}): Extension[] => {
  return [
    ...createBaseExtensions(config),
    ...createStyleExtensions(),
    ...createListExtensions(config.list),
    ...createTableExtensions(config.table),
    ...createImageExtensions(),
  ]
}

// 创建图片扩展
export const createImageExtensions = (): Extension[] => {
  return [
    ImageExtension as any,
  ]
}

// 预定义的扩展配置
export const EXTENSION_CONFIGS: Record<string, ExtensionConfig> = {
  minimal: {
    heading: { levels: [1, 2, 3] },
    link: { openOnClick: false },
  },
  simple: {
    heading: { levels: [1, 2, 3, 4] },
    link: { openOnClick: false },
    codeBlock: { defaultLanguage: 'plaintext' },
  },
  full: {
    heading: { levels: [1, 2, 3, 4, 5, 6] },
    link: { openOnClick: false },
    table: { resizable: true, cellMinWidth: 100 },
    codeBlock: { defaultLanguage: 'plaintext' },
  },
}