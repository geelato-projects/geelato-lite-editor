import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'

// 自定义列调整插件的键
const columnResizingKey = new PluginKey('customColumnResizing')

// 列调整状态接口
interface ResizeState {
  activeHandle: number | null
  startX: number
  startWidth: number
  tableNode: any
  colIndex: number
}

// 创建列调整手柄装饰
function createColumnHandles(doc: any, tablePos: number, table: any): Decoration[] {
  const decorations: Decoration[] = []
  
  // 获取第一行来确定列数
  const firstRow = table.child(0)
  if (!firstRow) return decorations
  
  let colIndex = 0
  firstRow.forEach((cell: any, offset: number) => {
    const cellPos = tablePos + 1 + offset // +1 for table node
    
    // 不为最后一列创建手柄（根据配置）
    if (colIndex < firstRow.childCount - 1) {
      const decoration = Decoration.widget(
        cellPos + cell.nodeSize,
        () => {
          const handle = document.createElement('div')
          handle.className = 'column-resize-handle'
          handle.setAttribute('data-col-index', colIndex.toString())
          handle.style.cssText = `
            position: absolute;
            right: -2px;
            top: 0;
            bottom: 0;
            width: 4px;
            z-index: 20;
            background-color: transparent;
            cursor: col-resize;
            pointer-events: auto;
            transition: background-color 0.2s ease;
          `
          
          // 改进的鼠标悬停效果
          let isHovering = false
          
          const handleMouseEnter = (e: MouseEvent) => {
            e.stopPropagation()
            isHovering = true
            handle.style.backgroundColor = '#4a90e2'
            handle.style.opacity = '0.8'
          }
          
          const handleMouseLeave = (e: MouseEvent) => {
            e.stopPropagation()
            isHovering = false
            // 延迟检查，避免快速移动时闪烁
            setTimeout(() => {
              if (!isHovering) {
                handle.style.backgroundColor = 'transparent'
                handle.style.opacity = '1'
              }
            }, 50)
          }
          
          handle.addEventListener('mouseenter', handleMouseEnter, { passive: false })
          handle.addEventListener('mouseleave', handleMouseLeave, { passive: false })
          
          return handle
        },
        {
          side: 1,
          key: `column-handle-${colIndex}`
        }
      )
      
      decorations.push(decoration)
    }
    
    colIndex++
  })
  
  return decorations
}

// 查找表格节点和位置
function findTable(doc: any, pos: number): { node: any; pos: number } | null {
  let result: { node: any; pos: number } | null = null
  
  doc.nodesBetween(0, doc.content.size, (node: any, nodePos: number) => {
    if (node.type.name === 'table') {
      // 检查位置是否在这个表格内
      if (pos >= nodePos && pos <= nodePos + node.nodeSize) {
        result = { node, pos: nodePos }
        return false // 停止遍历
      }
    }
  })
  
  return result
}

// 获取列宽度
function getColumnWidths(table: any): number[] {
  const widths: number[] = []
  const firstRow = table.child(0)
  
  if (firstRow) {
    firstRow.forEach((cell: any) => {
      const colwidth = cell.attrs.colwidth
      if (colwidth && colwidth.length > 0) {
        widths.push(colwidth[0])
      } else {
        widths.push(50) // 默认宽度
      }
    })
  }
  
  return widths
}

// 更新列宽度
function updateColumnWidth(
  view: any,
  tablePos: number,
  table: any,
  colIndex: number,
  newWidth: number
) {
  const tr = view.state.tr
  
  // 遍历表格的所有行，更新指定列的宽度
  let rowIndex = 0
  table.forEach((row: any, rowOffset: number) => {
    let cellIndex = 0
    row.forEach((cell: any, cellOffset: number) => {
      if (cellIndex === colIndex) {
        const cellPos = tablePos + 1 + rowOffset + cellOffset
        const newColwidth = [newWidth]
        
        tr.setNodeMarkup(cellPos, null, {
          ...cell.attrs,
          colwidth: newColwidth
        })
      }
      cellIndex++
    })
    rowIndex++
  })
  
  view.dispatch(tr)
}

// 自定义列调整扩展
export const CustomColumnResizing = Extension.create({
  name: 'customColumnResizing',
  
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: columnResizingKey,
        
        state: {
          init(): ResizeState {
            return {
              activeHandle: null,
              startX: 0,
              startWidth: 0,
              tableNode: null,
              colIndex: -1
            }
          },
          
          apply(tr, state): ResizeState {
            return state
          }
        },
        
        props: {
          decorations(state) {
            const decorations: Decoration[] = []
            const { doc, selection } = state
            
            // 查找当前选择位置的表格
            const tableInfo = findTable(doc, selection.from)
            if (tableInfo) {
              const handles = createColumnHandles(doc, tableInfo.pos, tableInfo.node)
              decorations.push(...handles)
            }
            
            return DecorationSet.create(doc, decorations)
          },
          
          handleDOMEvents: {
            mousedown(view, event) {
              const target = event.target as HTMLElement
              
              if (target.classList.contains('column-resize-handle')) {
                event.preventDefault()
                event.stopPropagation()
                
                const colIndex = parseInt(target.getAttribute('data-col-index') || '0')
                const startX = event.clientX
                
                // 查找表格
                const { doc, selection } = view.state
                const tableInfo = findTable(doc, selection.from)
                
                if (tableInfo) {
                  const widths = getColumnWidths(tableInfo.node)
                  const startWidth = widths[colIndex] || 50
                  
                  // 更新插件状态
                  const pluginState = columnResizingKey.getState(view.state)
                  pluginState.activeHandle = colIndex
                  pluginState.startX = startX
                  pluginState.startWidth = startWidth
                  pluginState.tableNode = tableInfo
                  pluginState.colIndex = colIndex
                  
                  // 改进的鼠标移动处理
                  const handleMouseMove = (e: MouseEvent) => {
                    e.preventDefault()
                    e.stopPropagation()
                    
                    const deltaX = e.clientX - startX
                    const newWidth = Math.max(25, startWidth + deltaX) // 最小宽度25px
                    
                    // 实时更新列宽
                    updateColumnWidth(
                      view,
                      tableInfo.pos,
                      tableInfo.node,
                      colIndex,
                      newWidth
                    )
                  }
                  
                  // 改进的鼠标释放处理
                  const handleMouseUp = (e: MouseEvent) => {
                    e.preventDefault()
                    e.stopPropagation()
                    
                    document.removeEventListener('mousemove', handleMouseMove, true)
                    document.removeEventListener('mouseup', handleMouseUp, true)
                    
                    // 重置状态
                    pluginState.activeHandle = null
                    
                    // 移除resize cursor
                    document.body.classList.remove('column-resizing')
                  }
                  
                  // 使用捕获模式添加全局事件监听器，提高响应性
                  document.addEventListener('mousemove', handleMouseMove, { capture: true, passive: false })
                  document.addEventListener('mouseup', handleMouseUp, { capture: true, passive: false })
                  
                  // 添加resize cursor
                  document.body.classList.add('column-resizing')
                  
                  return true
                }
              }
              
              return false
            }
          }
        }
      })
    ]
  },
  
  addGlobalAttributes() {
    return [
      {
        types: ['tableCell', 'tableHeader'],
        attributes: {
          colwidth: {
            default: null,
            parseHTML: element => {
              const colwidth = element.getAttribute('colwidth')
              return colwidth ? colwidth.split(',').map(w => parseInt(w, 10)) : null
            },
            renderHTML: attributes => {
              if (!attributes.colwidth) return {}
              return { colwidth: attributes.colwidth.join(',') }
            }
          }
        }
      }
    ]
  }
})