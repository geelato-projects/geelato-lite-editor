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
      // 添加边框相关属性
      borderStyle: {
        default: null,
        parseHTML: element => element.style.borderStyle || element.getAttribute('data-border-style'),
        renderHTML: attributes => {
          if (!attributes.borderStyle) {
            return {}
          }
          return {
            'data-border-style': attributes.borderStyle,
          }
        },
      },
      borderColor: {
        default: null,
        parseHTML: element => element.getAttribute('data-border-color'),
        renderHTML: attributes => {
          if (!attributes.borderColor) {
            return {}
          }
          return {
            'data-border-color': attributes.borderColor,
          }
        },
      },
      borderWidth: {
        default: null,
        parseHTML: element => element.getAttribute('data-border-width'),
        renderHTML: attributes => {
          if (!attributes.borderWidth) {
            return {}
          }
          return {
            'data-border-width': attributes.borderWidth,
          }
        },
      },
      border: {
        default: null,
        parseHTML: element => element.getAttribute('data-border'),
        renderHTML: attributes => {
          if (!attributes.border) {
            return {}
          }
          
          // 直接生成内联样式而不是data属性
          const style = `border: ${attributes.border};`
          return {
            'data-border': attributes.border,
            style: style,
          }
        },
      },
      borderTop: {
        default: null,
        parseHTML: element => element.getAttribute('data-border-top'),
        renderHTML: attributes => {
          if (!attributes.borderTop) {
            return {}
          }
          
          // 直接生成内联样式
          const style = `border-top: ${attributes.borderTop};`
          return {
            'data-border-top': attributes.borderTop,
            style: style,
          }
        },
      },
      borderBottom: {
        default: null,
        parseHTML: element => element.getAttribute('data-border-bottom'),
        renderHTML: attributes => {
          if (!attributes.borderBottom) {
            return {}
          }
          
          // 直接生成内联样式
          const style = `border-bottom: ${attributes.borderBottom};`
          return {
            'data-border-bottom': attributes.borderBottom,
            style: style,
          }
        },
      },
      borderLeft: {
        default: null,
        parseHTML: element => element.getAttribute('data-border-left'),
        renderHTML: attributes => {
          if (!attributes.borderLeft) {
            return {}
          }
          
          // 直接生成内联样式
          const style = `border-left: ${attributes.borderLeft};`
          return {
            'data-border-left': attributes.borderLeft,
            style: style,
          }
        },
      },
      borderRight: {
        default: null,
        parseHTML: element => element.getAttribute('data-border-right'),
        renderHTML: attributes => {
          if (!attributes.borderRight) {
            return {}
          }
          
          // 直接生成内联样式
          const style = `border-right: ${attributes.borderRight};`
          return {
            'data-border-right': attributes.borderRight,
            style: style,
          }
        },
      },
    }
  },

  renderHTML({ HTMLAttributes, node }) {
    const colwidth = node.attrs.colwidth;
    const backgroundColor = node.attrs.backgroundColor;
    const borderStyle = node.attrs.borderStyle;
    const borderColor = node.attrs.borderColor;
    const borderWidth = node.attrs.borderWidth;
    const border = node.attrs.border;
    const borderTop = node.attrs.borderTop;
    const borderBottom = node.attrs.borderBottom;
    const borderLeft = node.attrs.borderLeft;
    const borderRight = node.attrs.borderRight;
    
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

    const styles: string[] = [];
    const dataAttributes: Record<string, string> = {};
    
    if (backgroundColor) {
      styles.push(`background-color: ${backgroundColor}`);
    }
    
    // 直接将边框样式添加到内联样式中，确保在编辑器中正确显示
    if (border) {
      styles.push(`border: ${border}`);
      dataAttributes['data-border'] = border;
    }
    
    if (borderTop) {
      styles.push(`border-top: ${borderTop}`);
      dataAttributes['data-border-top'] = borderTop;
    }
    if (borderBottom) {
      styles.push(`border-bottom: ${borderBottom}`);
      dataAttributes['data-border-bottom'] = borderBottom;
    }
    if (borderLeft) {
      styles.push(`border-left: ${borderLeft}`);
      dataAttributes['data-border-left'] = borderLeft;
    }
    if (borderRight) {
      styles.push(`border-right: ${borderRight}`);
      dataAttributes['data-border-right'] = borderRight;
    }
    
    if (fixedWidth && totalWidth > 0) {
      styles.push(`width: ${totalWidth}px`);
    }

    return [
      'td',
      {
        ...HTMLAttributes,
        ...dataAttributes,
        colwidth: colwidth ? colwidth.join(',') : null,
        style: styles.length > 0 ? styles.join('; ') : null,
      },
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
      // 添加边框相关属性
      borderStyle: {
        default: null,
        parseHTML: element => element.style.borderStyle || element.getAttribute('data-border-style'),
        renderHTML: attributes => {
          // 不再输出data属性，边框样式直接在renderHTML中处理
          return {}
        },
      },
      borderColor: {
        default: null,
        parseHTML: element => element.style.borderColor || element.getAttribute('data-border-color'),
        renderHTML: attributes => {
          // 不再输出data属性，边框样式直接在renderHTML中处理
          return {}
        },
      },
      borderWidth: {
        default: null,
        parseHTML: element => element.style.borderWidth || element.getAttribute('data-border-width'),
        renderHTML: attributes => {
          // 不再输出data属性，边框样式直接在renderHTML中处理
          return {}
        },
      },
      border: {
        default: null,
        parseHTML: element => element.style.border || element.getAttribute('data-border'),
        renderHTML: attributes => {
          if (attributes.border) {
            return { 'data-border': attributes.border }
          }
          return {}
        },
      },
      // 添加单独的边框位置属性
      borderTop: {
        default: null,
        parseHTML: element => element.style.borderTop || element.getAttribute('data-border-top'),
        renderHTML: attributes => {
          if (attributes.borderTop) {
            return { 'data-border-top': attributes.borderTop }
          }
          return {}
        },
      },
      borderBottom: {
        default: null,
        parseHTML: element => element.style.borderBottom || element.getAttribute('data-border-bottom'),
        renderHTML: attributes => {
          if (attributes.borderBottom) {
            return { 'data-border-bottom': attributes.borderBottom }
          }
          return {}
        },
      },
      borderLeft: {
        default: null,
        parseHTML: element => element.style.borderLeft || element.getAttribute('data-border-left'),
        renderHTML: attributes => {
          if (attributes.borderLeft) {
            return { 'data-border-left': attributes.borderLeft }
          }
          return {}
        },
      },
      borderRight: {
        default: null,
        parseHTML: element => element.style.borderRight || element.getAttribute('data-border-right'),
        renderHTML: attributes => {
          if (attributes.borderRight) {
            return { 'data-border-right': attributes.borderRight }
          }
          return {}
        },
      },
    }
  },

  renderHTML({ HTMLAttributes, node }) {
    const colwidth = node.attrs.colwidth;
    const backgroundColor = node.attrs.backgroundColor;
    const borderStyle = node.attrs.borderStyle;
    const borderColor = node.attrs.borderColor;
    const borderWidth = node.attrs.borderWidth;
    const border = node.attrs.border;
    const borderTop = node.attrs.borderTop;
    const borderBottom = node.attrs.borderBottom;
    const borderLeft = node.attrs.borderLeft;
    const borderRight = node.attrs.borderRight;
    
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

    const styles: string[] = [];
    const dataAttributes: Record<string, string> = {};
    
    // 处理背景色样式
    if (backgroundColor) {
      styles.push(`background-color: ${backgroundColor}`);
    }
    
    // 直接将边框样式添加到内联样式中，确保在编辑器中正确显示
    if (border) {
      styles.push(`border: ${border}`);
      dataAttributes['data-border'] = border;
    }
    
    if (borderTop) {
      styles.push(`border-top: ${borderTop}`);
      dataAttributes['data-border-top'] = borderTop;
    }
    if (borderBottom) {
      styles.push(`border-bottom: ${borderBottom}`);
      dataAttributes['data-border-bottom'] = borderBottom;
    }
    if (borderLeft) {
      styles.push(`border-left: ${borderLeft}`);
      dataAttributes['data-border-left'] = borderLeft;
    }
    if (borderRight) {
      styles.push(`border-right: ${borderRight}`);
      dataAttributes['data-border-right'] = borderRight;
    }

    // 处理列宽样式
    if (fixedWidth && totalWidth > 0) {
      styles.push(`width: ${totalWidth}px`);
    } else if (totalWidth && totalWidth > 0) {
      styles.push(`min-width: ${totalWidth}px`);
    }

    return [
      'th',
      {
        ...HTMLAttributes,
        ...dataAttributes,
        colwidth: colwidth ? colwidth.join(',') : null,
        style: styles.length > 0 ? styles.join('; ') : null,
      },
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
    }) as Extension,
    TableRow.configure({
      HTMLAttributes: {
        class: 'gl-table-row',
      },
    }) as Extension,
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