import { Table } from '@tiptap/extension-table'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableRow } from '@tiptap/extension-table-row'
import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { columnResizing } from '@tiptap/pm/tables'
import { CustomColumnResizing } from './columnResizing'
import type { TableConfig } from '../../types'

// 注释：使用 @tiptap/pm/tables 而不是直接使用 prosemirror-tables
// 这确保了与 Tiptap 的版本兼容性

// 自定义表格单元格扩展，支持背景色和列宽调整
const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      backgroundColor: {
        default: null,
        parseHTML: element => element.style.backgroundColor || element.getAttribute('data-background-color'),
        renderHTML: attributes => {
          if (!attributes.backgroundColor) {
            return {}
          }
          return {
            style: `background-color: ${attributes.backgroundColor}`,
          }
        },
      },
      colwidth: {
        default: null,
        parseHTML: element => {
          const colwidth = element.getAttribute('colwidth');
          const value = colwidth
            ? colwidth.split(',').map(item => parseInt(item, 10))
            : null;
          return value;
        },
      },
      style: {
        default: null,
      },
    }
  },

  renderHTML({ HTMLAttributes, node }) {
    const colwidth = node.attrs.colwidth;
    const backgroundColor = node.attrs.backgroundColor;
    let totalWidth = 0;
    let fixedWidth = true;

    if (colwidth) {
      colwidth.forEach((col: number) => {
        if (!col) {
          fixedWidth = false;
        } else {
          totalWidth += col;
        }
      });
    } else {
      fixedWidth = false;
    }

    // 处理样式
    let style = '';
    
    // 处理背景色样式
    if (backgroundColor) {
      style += `background-color: ${backgroundColor};`;
    }

    // 处理列宽样式
    if (fixedWidth && totalWidth > 0) {
      style += `width: ${totalWidth}px;`;
    } else if (totalWidth && totalWidth > 0) {
      style += `min-width: ${totalWidth}px;`;
    }

    if (style) {
      HTMLAttributes.style = style;
    }

    // 使用Object.assign代替mergeAttributes
    const attrs = Object.assign({}, this.options.HTMLAttributes, HTMLAttributes);
    
    return [
      'td',
      attrs,
      0,
    ];
  },
})

// 自定义表格头部扩展，支持背景色和列宽调整
const CustomTableHeader = TableHeader.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      backgroundColor: {
        default: null,
        parseHTML: element => element.style.backgroundColor || element.getAttribute('data-background-color'),
        renderHTML: attributes => {
          if (!attributes.backgroundColor) {
            return {}
          }
          return {
            style: `background-color: ${attributes.backgroundColor}`,
          }
        },
      },
      colwidth: {
        default: null,
        parseHTML: element => {
          const colwidth = element.getAttribute('colwidth');
          const value = colwidth
            ? colwidth.split(',').map(item => parseInt(item, 10))
            : null;
          return value;
        },
      },
      style: {
        default: null,
      },
    }
  },

  renderHTML({ HTMLAttributes, node }) {
    const colwidth = node.attrs.colwidth;
    const backgroundColor = node.attrs.backgroundColor;
    let totalWidth = 0;
    let fixedWidth = true;

    if (colwidth) {
      colwidth.forEach((col: number) => {
        if (!col) {
          fixedWidth = false;
        } else {
          totalWidth += col;
        }
      });
    } else {
      fixedWidth = false;
    }

    // 处理样式
    let style = '';
    
    // 处理背景色样式
    if (backgroundColor) {
      style += `background-color: ${backgroundColor};`;
    }

    // 处理列宽样式
    if (fixedWidth && totalWidth > 0) {
      style += `width: ${totalWidth}px;`;
    } else if (totalWidth && totalWidth > 0) {
      style += `min-width: ${totalWidth}px;`;
    }

    if (style) {
      HTMLAttributes.style = style;
    }

    // 使用Object.assign代替mergeAttributes
    const attrs = Object.assign({}, this.options.HTMLAttributes, HTMLAttributes);

    return [
      'th',
      attrs,
      0,
    ];
  },
})

// 创建支持背景颜色的表格扩展
export const createTableExtensions = (config: TableConfig = {}): Extension[] => {
  return [
    Table.configure({
      resizable: true, // 启用列调整功能
      handleWidth: 4, // 调整手柄宽度，与官方保持一致
      cellMinWidth: config.cellMinWidth || 50, // 单元格最小宽度
      lastColumnResizable: true, // 允许最后一列调整大小
      allowTableNodeSelection: config.allowTableNodeSelection ?? true,
      HTMLAttributes: {
        class: 'gl-table',
      },
    }),
    TableRow.configure({
      HTMLAttributes: {
        class: 'gl-table-row',
      },
    }),
    // 添加自定义的TableCell和TableHeader扩展以支持背景颜色
    CustomTableCell.configure({
      HTMLAttributes: {
        class: 'gl-table-cell',
      },
    }) as Extension,
    CustomTableHeader.configure({
      HTMLAttributes: {
        class: 'gl-table-header',
      },
    }) as Extension,
    // 添加自定义列调整功能
    CustomColumnResizing,
  ]
}

export { CustomTableCell, CustomTableHeader }