/**
 * HTML内联样式转换工具
 * 用于将编辑器生成的HTML转换为包含内联样式的HTML，支持邮件场景
 */


// 定义样式映射表
const STYLE_MAPPINGS = {
  // 段落样式
  'p': {
    margin: '0',
  },
  
  // 标题样式
  'h1': {
    margin: '20px 0 12px 0',
    fontWeight: '600',
    lineHeight: '1.3',
    fontSize: '2em'
  },
  'h2': {
    margin: '20px 0 12px 0',
    fontWeight: '600',
    lineHeight: '1.3',
    fontSize: '1.5em'
  },
  'h3': {
    margin: '20px 0 12px 0',
    fontWeight: '600',
    lineHeight: '1.3',
    fontSize: '1.25em'
  },
  'h4': {
    margin: '20px 0 12px 0',
    fontWeight: '600',
    lineHeight: '1.3',
    fontSize: '1.1em'
  },
  'h5': {
    margin: '20px 0 12px 0',
    fontWeight: '600',
    lineHeight: '1.3',
    fontSize: '1em'
  },
  'h6': {
    margin: '20px 0 12px 0',
    fontWeight: '600',
    lineHeight: '1.3',
    fontSize: '0.9em'
  },
  
  // 文本格式样式
  'strong': {
    fontWeight: '600'
  },
  'em': {
    fontStyle: 'italic'
  },
  'u': {
    textDecoration: 'underline'
  },
  's': {
    textDecoration: 'line-through'
  },
  
  // 引用块样式
  'blockquote': {
    borderLeft: '3px solid #4a4a4a',
    margin: '1rem 0',
    padding: '1rem',
    backgroundColor:'#f8f9fa',
    color: '#666666'
  },
  
  // 列表样式
  'ul': {
    margin: '12px 0',
    paddingLeft: '24px'
  },
  'ol': {
    margin: '12px 0',
    paddingLeft: '24px'
  },
  'li': {
    margin: '4px 0'
  },
  
  // 代码样式
  'code': {
    padding: '2px 6px',
    backgroundColor: '#f8f9fa',
    borderRadius: '3px',
    fontFamily: 'Monaco, Consolas, "Lucida Console", monospace',
    fontSize: '0.9em'
  },
  
  // 预格式化代码块
  'pre': {
    backgroundColor: '#f8f9fa',
    border: '1px solid #e9ecef',
    borderRadius: '4px',
    padding: '12px',
    margin: '12px 0',
    overflow: 'auto',
    fontFamily: 'Monaco, Consolas, "Lucida Console", monospace',
    fontSize: '0.9em',
    lineHeight: '1.4'
  },
  
  // 高亮样式
  'mark': {
    backgroundColor: '#fff3cd',
    padding: '1px 2px',
    borderRadius: '2px'
  },
  
  // 链接样式
  'a': {
    color: '#1890ff',
    textDecoration: 'none'
  },
  
  // 图片样式
  'img': {
    maxWidth: '100%',
    height: 'auto',
    display: 'inline-block',
    margin: '8px 0'
  },
  
  // 表格样式
  'table': {
    borderCollapse: 'collapse',
    width: '100%'
  },
  'thead': {
    // 移除背景色
  },
  'tbody': {
    // 移除背景色
  },
  'tr': {
    // 移除边框
  },
  'th': {
    padding: '8px',
    border: '1px solid #ddd'
  },
  'td': {
    padding: '8px',
    border: '1px solid #ddd'
  },
  'colgroup': {
    // colgroup 通常不需要特殊样式
  },
  'col': {
    // col 通常不需要特殊样式
  }
}

/**
 * 将CSS样式对象转换为内联样式字符串
 */
function styleObjectToString(styleObj: Record<string, string>): string {
  return Object.entries(styleObj)
    .map(([property, value]) => {
      // 将驼峰命名转换为短横线命名
      const cssProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase()
      return `${cssProperty}: ${value}`
    })
    .join('; ')
}

/**
 * 合并现有的内联样式和新样式
 */
function mergeStyles(existingStyle: string, newStyle: string): string {
  if (!existingStyle) return newStyle
  if (!newStyle) return existingStyle
  
  // 确保样式以分号结尾
  const existing = existingStyle.endsWith(';') ? existingStyle : existingStyle + ';'
  return `${existing} ${newStyle}`
}

/**
 * 将HTML转换为包含内联样式的HTML
 */
export function convertToInlineStyles(html: string): string {
  // 创建一个临时DOM元素来解析HTML
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  
  // 递归处理所有元素
  function processElement(element: Element) {
    const tagName = element.tagName.toLowerCase()
    
    // 获取对应的样式映射
    const styles = STYLE_MAPPINGS[tagName as keyof typeof STYLE_MAPPINGS]
    
    if (styles) {
      const inlineStyle = styleObjectToString(styles)
      const existingStyle = element.getAttribute('style') || ''
      const mergedStyle = mergeStyles(existingStyle, inlineStyle)
      element.setAttribute('style', mergedStyle)
    }
    
    // 处理特殊的类样式
    const className = element.getAttribute('class')
    if (className) {
      // 处理文本对齐
      if (className.includes('text-align-center')) {
        const existingStyle = element.getAttribute('style') || ''
        const newStyle = mergeStyles(existingStyle, 'text-align: center')
        element.setAttribute('style', newStyle)
      } else if (className.includes('text-align-right')) {
        const existingStyle = element.getAttribute('style') || ''
        const newStyle = mergeStyles(existingStyle, 'text-align: right')
        element.setAttribute('style', newStyle)
      } else if (className.includes('text-align-justify')) {
        const existingStyle = element.getAttribute('style') || ''
        const newStyle = mergeStyles(existingStyle, 'text-align: justify')
        element.setAttribute('style', newStyle)
      }
      
      // 处理高亮颜色
      if (className.includes('gl-highlight')) {
        // 如果有自定义颜色，保持原有的内联样式
        // 否则应用默认高亮样式
        const existingStyle = element.getAttribute('style') || ''
        if (!existingStyle.includes('background')) {
          const newStyle = mergeStyles(existingStyle, 'background-color: #fff3cd; padding: 1px 2px; border-radius: 2px')
          element.setAttribute('style', newStyle)
        }
      }
      
      // 处理表格相关类名
      if (className.includes('gl-table')) {
        const existingStyle = element.getAttribute('style') || ''
        
        if (className.includes('gl-table-header')) {
          // 表格头部单元格样式 - 简洁版本
          const headerStyle = 'padding: 8px; border: 1px solid #ddd;'
          const newStyle = mergeStyles(existingStyle, headerStyle)
          element.setAttribute('style', newStyle)
        } else if (className.includes('gl-table-cell')) {
          // 表格数据单元格样式 - 简洁版本
          const cellStyle = 'padding: 8px; border: 1px solid #ddd;'
          const newStyle = mergeStyles(existingStyle, cellStyle)
          element.setAttribute('style', newStyle)
        } else if (className.includes('gl-table-row')) {
          // 表格行样式 - 移除额外样式
          // 不添加任何额外样式
        } else if (className === 'gl-table') {
          // 表格主体样式 - 简洁版本
          const tableStyle = 'border-collapse: collapse; width: 100%;'
          const newStyle = mergeStyles(existingStyle, tableStyle)
          element.setAttribute('style', newStyle)
        }
      }
    }
    
    // 递归处理子元素
    Array.from(element.children).forEach(child => {
      processElement(child)
    })
  }
  
  // 处理body中的所有元素
  const body = doc.body
  if (body) {
    Array.from(body.children).forEach(child => {
      processElement(child)
    })
    
    // 返回body的innerHTML
    return body.innerHTML
  }
  
  return html
}

/**
 * 创建完整的邮件HTML文档
 */
export function createEmailHtml(content: string, title: string = '邮件内容'): string {
  const inlineContent = convertToInlineStyles(content)
  
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
  </style>
</head>
<body>
${inlineContent}
</body>
</html>`
}