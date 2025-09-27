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
  let currentOffset = 1 // 从表格节点后开始
  
  firstRow.forEach((cell: any) => {
    // 不为最后一列创建手柄
    if (colIndex < firstRow.childCount - 1) {
      // 计算手柄位置 - 在单元格的右边界
      const handlePos = tablePos + currentOffset + cell.nodeSize - 1
      
      // 捕获当前的 colIndex 值，避免闭包问题
      const currentColIndex = colIndex
      
      const decoration = Decoration.widget(
        handlePos,
        () => {
          const handle = document.createElement('div')
          handle.className = 'column-resize-handle'
          handle.setAttribute('data-col-index', currentColIndex.toString()) // 使用捕获的 currentColIndex
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
          key: `column-handle-${currentColIndex}-${tablePos}` // 使用捕获的 currentColIndex 确保唯一性
        }
      )
      
      decorations.push(decoration)
    }
    
    currentOffset += cell.nodeSize
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

// 更新列宽度 - 只调整相邻的两列
function updateColumnWidth(
  view: any,
  tablePos: number,
  table: any,
  colIndex: number,
  newWidth: number,
  originalWidth: number
) {
  const tr = view.state.tr
  const firstRow = table.child(0)
  
  // 计算宽度变化
  const widthDelta = newWidth - originalWidth
  
  // 确保有下一列可以调整
  if (colIndex >= firstRow.childCount - 1) {
    return
  }
  
  // 获取下一列的当前宽度
  const nextColCell = firstRow.child(colIndex + 1)
  const nextColCurrentWidth = (nextColCell.attrs.colwidth && nextColCell.attrs.colwidth[0]) || 50
  const nextColNewWidth = Math.max(25, nextColCurrentWidth - widthDelta) // 最小宽度25px
  
  console.log(`更新列宽: 列${colIndex} ${originalWidth}px -> ${newWidth}px, 列${colIndex + 1} ${nextColCurrentWidth}px -> ${nextColNewWidth}px`)
  
  // 批量收集所有需要更新的单元格位置和属性
  const updates: Array<{ pos: number, attrs: any }> = []
  
  // 更新表格中所有行的对应列
  for (let rowIndex = 0; rowIndex < table.childCount; rowIndex++) {
    const row = table.child(rowIndex)
    let cellPos = tablePos + 1 // 表格开始位置 + 1
    
    // 计算到当前行的偏移
    for (let i = 0; i < rowIndex; i++) {
      cellPos += table.child(i).nodeSize
    }
    cellPos += 1 // 行开始标记
    
    // 收集当前行中需要更新的列
    for (let cellIndex = 0; cellIndex < row.childCount; cellIndex++) {
      const cell = row.child(cellIndex)
      
      if (cellIndex === colIndex) {
        // 收集当前列的更新信息
        updates.push({
          pos: cellPos,
          attrs: {
            ...cell.attrs,
            colwidth: [newWidth]
          }
        })
      } else if (cellIndex === colIndex + 1) {
        // 收集下一列的更新信息
        updates.push({
          pos: cellPos,
          attrs: {
            ...cell.attrs,
            colwidth: [nextColNewWidth]
          }
        })
      }
      
      cellPos += cell.nodeSize
    }
  }
  
  // 一次性应用所有更新，减少重渲染次数
  updates.forEach(update => {
    tr.setNodeMarkup(update.pos, null, update.attrs)
  })
  
  // 只分发一次事务
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
                // 阻止默认行为和事件冒泡，防止文本选择
                event.preventDefault()
                event.stopPropagation()
                
                // 阻止文本选择
                document.getSelection()?.removeAllRanges()
                
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
                    // 阻止默认行为和事件冒泡，防止文本选择
                    e.preventDefault()
                    e.stopPropagation()
                    
                    // 持续阻止文本选择 - 使用更强的阻止逻辑
                    const selection = document.getSelection()
                    if (selection) {
                      selection.removeAllRanges()
                      // 额外的阻止逻辑
                      if (selection.rangeCount > 0) {
                        selection.deleteFromDocument()
                      }
                    }
                    
                    // 阻止用户选择
                    document.body.style.userSelect = 'none'
                    document.body.style.webkitUserSelect = 'none'
                    
                    const deltaX = e.clientX - startX
                    const newWidth = Math.max(25, startWidth + deltaX) // 最小宽度25px
                    
                    // 实时更新列宽 - 传入原始宽度参数
                    updateColumnWidth(
                      view,
                      tableInfo.pos,
                      tableInfo.node,
                      colIndex,
                      newWidth,
                      startWidth
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
                    
                    // 恢复用户选择
                    document.body.style.userSelect = ''
                    document.body.style.webkitUserSelect = ''
                    
                    // 清除任何残留的选择
                    const selection = document.getSelection()
                    if (selection) {
                      selection.removeAllRanges()
                    }
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