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
  img: {
    height: 'auto',
    display: 'inline-block',
    verticalAlign: 'middle'
  },
  
  // 表格样式
  'table': {
    borderCollapse: 'collapse',
    width: '100%'
  },
  'thead': {
    // 表头样式
  },
  'tbody': {
    // 表体样式
  },
  'tr': {
    // 表行样式
  },
  'th': {
    border: '1px solid #ddd',
    verticalAlign: 'middle'
  },
  'td': {
    border: '1px solid #ddd',
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
 * 合并现有的内联样式和新样式，自动去重
 */
function mergeStyles(existingStyle: string, newStyle: string): string {
  if (!existingStyle) return newStyle
  if (!newStyle) return existingStyle
  
  // 解析现有样式为对象
  const styleMap = new Map<string, string>()
  
  // 解析现有样式
  if (existingStyle) {
    existingStyle.split(';').forEach(rule => {
      const trimmed = rule.trim()
      if (trimmed) {
        const colonIndex = trimmed.indexOf(':')
        if (colonIndex > 0) {
          const property = trimmed.substring(0, colonIndex).trim()
          const value = trimmed.substring(colonIndex + 1).trim()
          styleMap.set(property, value)
        }
      }
    })
  }
  
  // 解析新样式并覆盖重复属性
  if (newStyle) {
    newStyle.split(';').forEach(rule => {
      const trimmed = rule.trim()
      if (trimmed) {
        const colonIndex = trimmed.indexOf(':')
        if (colonIndex > 0) {
          const property = trimmed.substring(0, colonIndex).trim()
          const value = trimmed.substring(colonIndex + 1).trim()
          styleMap.set(property, value)
        }
      }
    })
  }
  
  // 处理边框样式冲突
  const specificBorderProps = ['border-top', 'border-bottom', 'border-left', 'border-right']
  const hasSpecificBorder = specificBorderProps.some(prop => styleMap.has(prop))
  const hasBorderNone = styleMap.get('border') === 'none'
  
  // 如果设置了border: none，移除所有具体的边框属性
  if (hasBorderNone) {
    specificBorderProps.forEach(prop => {
      styleMap.delete(prop)
    })
  } else if (hasSpecificBorder && styleMap.has('border')) {
    // 如果有具体的边框属性，删除通用的border属性
    styleMap.delete('border')
  }
  
  // 重新组合样式字符串
  return Array.from(styleMap.entries())
    .map(([property, value]) => `${property}: ${value}`)
    .join('; ')
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
    
    // 先处理data-border*属性，收集自定义边框样式
    const customBorderStyles: Record<string, string> = {}
    const borderAttributes = [
      'data-border',
      'data-border-top', 
      'data-border-bottom',
      'data-border-left',
      'data-border-right'
    ]
    
    borderAttributes.forEach(attr => {
      const borderValue = element.getAttribute(attr)
      if (borderValue) {
        if (attr === 'data-border') {
          if (borderValue === 'none') {
            customBorderStyles.border = 'none'
          } else if (borderValue.includes(':')) {
            // 处理复合边框样式，如 "top: 2px solid blue; bottom: 2px solid blue"
            const borderParts = borderValue.split(';').map(part => part.trim()).filter(part => part)
            borderParts.forEach(part => {
              const [side, value] = part.split(':').map(s => s.trim())
              if (side && value) {
                if (side === 'top') {
                  customBorderStyles['border-top'] = value
                } else if (side === 'bottom') {
                  customBorderStyles['border-bottom'] = value
                } else if (side === 'left') {
                  customBorderStyles['border-left'] = value
                } else if (side === 'right') {
                  customBorderStyles['border-right'] = value
                }
              }
            })
          } else {
            // 简单的边框样式，如 "1px solid red"
            customBorderStyles.border = borderValue
          }
        } else {
          // 处理单独的边框属性
          const cssProp = attr.replace('data-', '')
          if (borderValue === 'none') {
            customBorderStyles[cssProp] = 'none'
          } else {
            customBorderStyles[cssProp] = borderValue
          }
        }
        
        // 移除data属性
        element.removeAttribute(attr)
      }
    })
    
    // 获取元素现有的内联样式
    const existingStyle = element.getAttribute('style') || ''
    const existingStyleMap: Record<string, string> = {}
    
    // 解析现有样式
    if (existingStyle) {
      existingStyle.split(';').forEach(rule => {
        const [property, value] = rule.split(':').map(s => s.trim())
        if (property && value) {
          existingStyleMap[property] = value
        }
      })
    }
    
    // 获取对应的样式映射，但排除被现有样式覆盖的属性
    const styles = STYLE_MAPPINGS[tagName as keyof typeof STYLE_MAPPINGS]
    let finalStyles: Record<string, string> = {}
    
    if (styles) {
      finalStyles = { ...styles }
      
      // 检查是否有border: none样式（包括data-border="none"）
      const hasBorderNone = existingStyleMap['border'] === 'none' || customBorderStyles['border'] === 'none'
      
      // 如果有border: none，完全不应用任何默认边框样式
      if (hasBorderNone) {
        // 移除所有边框相关的默认样式
        Object.keys(finalStyles).forEach(key => {
          if (key.startsWith('border') || key === 'border') {
            delete finalStyles[key]
          }
        })
      } else {
        // 如果元素已有边框相关的内联样式，移除默认的border样式
        const hasBorderStyles = Object.keys(existingStyleMap).some(prop => 
          prop.startsWith('border')
        ) || Object.keys(customBorderStyles).some(prop => 
          prop.startsWith('border') && customBorderStyles[prop] !== 'none'
        )
        
        if (hasBorderStyles) {
          // 移除可能被覆盖的默认边框样式
          delete finalStyles.border
          delete finalStyles.borderTop
          delete finalStyles.borderBottom
          delete finalStyles.borderLeft
          delete finalStyles.borderRight
        }
      }
    }
    
    // 合并所有样式：现有样式 + 默认样式 + 自定义边框样式
    let allStyles: Record<string, string> = {}
    
    // 1. 先添加现有的内联样式
    Object.assign(allStyles, existingStyleMap)
    
    // 2. 再添加默认样式（不会覆盖现有样式）
    if (Object.keys(finalStyles).length > 0) {
      Object.keys(finalStyles).forEach(prop => {
        if (!allStyles[prop]) {
          allStyles[prop] = finalStyles[prop]
        }
      })
    }
    
    // 3. 最后添加自定义边框样式（会覆盖默认样式和内联样式）
    Object.keys(customBorderStyles).forEach(prop => {
      const value = customBorderStyles[prop]
      
      if (value === 'none') {
        if (prop === 'border') {
          // 如果是border: none，删除所有边框相关样式（包括现有的内联样式）
          const borderProps = ['border', 'border-top', 'border-bottom', 'border-left', 'border-right', 
                               'borderTop', 'borderBottom', 'borderLeft', 'borderRight',
                               'border-top-width', 'border-bottom-width', 'border-left-width', 'border-right-width',
                               'border-top-style', 'border-bottom-style', 'border-left-style', 'border-right-style',
                               'border-top-color', 'border-bottom-color', 'border-left-color', 'border-right-color',
                               'borderTopWidth', 'borderBottomWidth', 'borderLeftWidth', 'borderRightWidth',
                               'borderTopStyle', 'borderBottomStyle', 'borderLeftStyle', 'borderRightStyle',
                               'borderTopColor', 'borderBottomColor', 'borderLeftColor', 'borderRightColor']
          borderProps.forEach(borderProp => {
            delete allStyles[borderProp]
          })
        } else {
          // 如果是单独的边框属性为none，删除对应的样式
          delete allStyles[prop]
          // 同时删除驼峰命名的版本
          const camelCaseProp = prop.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase())
          delete allStyles[camelCaseProp]
        }
      } else {
        // 否则正常设置样式，这会覆盖之前的样式（包括内联样式）
        allStyles[prop] = value
        
        // 如果设置了具体的边框样式，同时删除可能存在的驼峰命名版本
        if (prop.startsWith('border-')) {
          const camelCaseProp = prop.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase())
          delete allStyles[camelCaseProp]
        }
      }
    })
    
    // 应用合并后的样式
    if (Object.keys(allStyles).length > 0) {
      const finalStyleString = styleObjectToString(allStyles)
      element.setAttribute('style', finalStyleString)
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
          // 表格头部单元格样式 - 由于th标签已经有基础样式，这里不需要重复添加
          // 如果需要特殊的头部样式，可以在这里添加
        } else if (className.includes('gl-table-cell')) {
          // 表格数据单元格样式 - 由于td标签已经有基础样式，这里不需要重复添加
          // 如果需要特殊的单元格样式，可以在这里添加
        } else if (className.includes('gl-table-row')) {
          // 表格行样式 - 不添加任何额外样式
        } else if (className === 'gl-table') {
          // 表格主体样式 - 由于table标签已经有基础样式，这里不需要重复添加
          // 如果需要特殊的表格样式，可以在这里添加
        }
      }
      
      // 移除所有CSS类名，只保留内联样式
      element.removeAttribute('class')
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