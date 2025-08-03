<template>
  <div :class="toolbarClass">
    <template v-for="(item, index) in toolbarItems" :key="index">
      <!-- 分隔符 -->
      <ToolbarSeparator
        v-if="item === '|' && showSeparator"
        :size="size"
      />
      
      <!-- 表格下拉菜单 -->
      <TableDropdown
        v-else-if="item === 'table'"
        :editor="editor"
      />
      
      <!-- 列表下拉菜单 -->
      <ListDropdown
        v-else-if="item === 'list'"
        :editor="editor"
      />
      
      <!-- 标题下拉菜单 -->
      <HeadingDropdown
        v-else-if="item === 'heading'"
        :editor="editor"
      />
      
      <!-- 工具栏按钮 -->
      <ToolbarButton
        v-else-if="item !== '|' && !isTableOperation(item) && !isListOperation(item) && !isHeadingOperation(item)"
        :ref="item === 'highlight' ? (el) => { if (el) highlightButtonRef = (el as any).buttonRef } : item === 'textColor' ? (el) => { if (el) textColorButtonRef = (el as any).buttonRef } : item === 'link' ? (el) => { if (el) linkButtonRef = (el as any).buttonRef } : undefined"
        :icon="getButtonConfig(item)?.icon"
        :title="getButtonConfig(item)?.title"
        :active="isButtonActive(item)"
        :disabled="isButtonDisabled(item)"
        :size="size"
        @click="handleButtonClick(item, $event)"
      />
    </template>
    
    <!-- 链接输入面板 -->
    <LinkPanel
      :visible="linkPanelVisible"
      :reference="linkElementRef || linkButtonRef"
      :default-url="linkData.url"
      @confirm="handleLinkConfirm"
      @delete="handleLinkDelete"
      @close="handleLinkPanelClose"
    />
    

    
    <!-- 高亮颜色选择面板 -->
    <HighlightPanel
      :visible="highlightPanelVisible"
      :reference="highlightButtonRef"
      :current-color="currentHighlightColor"
      @color-select="handleHighlightColorSelect"
      @close="handleHighlightPanelClose"
    />
    
    <!-- 文字颜色选择面板 -->
    <TextColorPanel
      :visible="textColorPanelVisible"
      :reference="textColorButtonRef"
      :current-color="currentTextColor"
      @color-select="handleTextColorSelect"
      @close="handleTextColorPanelClose"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useToolbar } from '../../composables/useToolbar'
import ToolbarButton from '../ui/ToolbarButton.vue'
import ToolbarSeparator from '../ui/ToolbarSeparator.vue'
import InputModal from '../ui/InputModal.vue'
import HighlightPanel from '../../extensions/highlight/HighlightPanel.vue'
import TextColorPanel from '../../extensions/textColor/TextColorPanel.vue'
import LinkPanel from '../../extensions/link/LinkPanel.vue'
import TableDropdown from './TableDropdown.vue'
import ListDropdown from './ListDropdown.vue'
import HeadingDropdown from './HeadingDropdown.vue'
import type {
  ToolbarMode,
  ToolbarConfig,
  ComponentSize
} from '../../types'
import type { Editor } from '@tiptap/vue-3'
import { TextSelection } from '@tiptap/pm/state'

interface Props {
  /** 编辑器实例 */
  editor: Editor | null
  /** 工具栏配置 */
  config?: ToolbarMode | ToolbarConfig | boolean
  /** 工具栏尺寸 */
  size?: ComponentSize
  /** 是否显示分隔符 */
  showSeparator?: boolean
  /** 自定义类名 */
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  config: 'simple',
  size: 'medium',
  showSeparator: true,
})

// 使用工具栏组合式函数
const {
  toolbarItems,
  getButtonConfig,
  isButtonActive,
  isButtonDisabled,
  executeButtonAction,
} = useToolbar(computed(() => props.editor), computed(() => props.config))

// 判断是否为表格操作按钮
const isTableOperation = (item: string) => {
  const tableOperations = [
    'insertTable',
    'addRowBefore', 
    'addRowAfter',
    'deleteRow',
    'addColumnBefore',
    'addColumnAfter', 
    'deleteColumn',
    'deleteTable'
  ]
  return tableOperations.includes(item)
}

// 判断是否为列表操作按钮
const isListOperation = (item: string) => {
  const listOperations = [
    'bulletList',
    'orderedList',
    'taskList'
  ]
  return listOperations.includes(item)
}

// 链接面板状态
const linkPanelVisible = ref(false)
const linkButtonRef = ref<HTMLElement | null>(null)
const linkElementRef = ref<HTMLElement | null>(null)
const linkData = ref({
  url: ''
})


// 高亮面板状态
const highlightPanelVisible = ref(false)
const highlightButtonRef = ref<HTMLElement | null>(null)
const currentHighlightColor = computed(() => {
  if (!props.editor) return null
  const highlight = props.editor.getAttributes('highlight')
  return highlight?.color || null
})

// 文字颜色面板状态
const textColorPanelVisible = ref(false)
const textColorButtonRef = ref<HTMLElement | null>(null)
const currentTextColor = computed(() => {
  if (!props.editor) return null
  const textStyle = props.editor.getAttributes('textStyle')
  return textStyle?.color || null
})

// 工具栏类名
const toolbarClass = computed(() => {
  const classes = [
    'gl-editor-toolbar',
    `gl-editor-toolbar--${props.size}`,
  ]
  
  if (props.class) {
    classes.push(props.class)
  }
  
  return classes.join(' ')
})

// 检查是否为标题操作
const isHeadingOperation = (item: string) => {
  return item === 'heading'
}

// 处理按钮点击
const handleButtonClick = (buttonName: string, event?: Event) => {
  if (!props.editor) return
  
  // 特殊处理需要对话框的按钮
  if (buttonName === 'link') {
    handleLinkButtonClick()
  } else if (buttonName === 'image') {
    handleImageButtonClick()
  } else if (buttonName === 'highlight') {
    handleHighlightButtonClick(event)
  } else if (buttonName === 'textColor') {
    handleTextColorButtonClick(event)
  } else {
    // 执行默认动作
    executeButtonAction(buttonName)
  }
}

// 处理链接按钮点击
const handleLinkButtonClick = () => {
  if (!props.editor) return
  
  // 如果当前选中的是链接，获取链接URL并打开编辑面板
  if (props.editor.isActive('link')) {
    const linkAttrs = props.editor.getAttributes('link')
    linkData.value = {
      url: linkAttrs.href || ''
    }
  } else {
    // 设置默认值
    linkData.value = {
      url: ''
    }
  }
  
  // 确保reference已设置后再显示面板
  if (linkButtonRef.value) {
    linkPanelVisible.value = true
  }
}

// 处理图片按钮点击
const handleImageButtonClick = () => {
  // 创建文件选择器
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.multiple = false
  
  input.onchange = async (event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file) {
      try {
        // 将文件转换为 base64
        const reader = new FileReader()
        reader.onload = () => {
          const src = reader.result as string
          if (props.editor) {
            props.editor
              .chain()
              .focus()
              .setImage({ src, alt: file.name })
              .run()
          }
        }
        reader.readAsDataURL(file)
      } catch (error) {
        console.error('图片插入失败:', error)
      }
    }
  }
  
  input.click()
}

// 处理链接确认
const handleLinkConfirm = (url: string) => {
  if (!props.editor) return
  
  const { selection } = props.editor.state
  const { from, to } = selection
  
  // 如果没有选中文本，插入链接URL作为显示文本
  if (from === to) {
    props.editor
      .chain()
      .focus()
      .insertContent(`<a href="${url}">${url}</a>`)
      .run()
  } else {
    // 有选中文本，直接为选中的文本设置链接
    props.editor.chain().focus().setLink({ href: url }).run()
  }
  
  linkPanelVisible.value = false
}

// 处理链接删除
const handleLinkDelete = () => {
  console.log('EditorToolbar handleLinkDelete 函数被调用')
  
  if (!props.editor) {
    console.log('编辑器不存在，无法删除链接')
    return
  }
  
  try {
    console.log('开始删除链接')
    
    // 获取当前状态
    const { state } = props.editor
    const { selection } = state
    console.log('删除前选择范围:', { from: selection.from, to: selection.to })
    console.log('删除前HTML:', props.editor.getHTML())
    
    // 查找完整的链接范围
    let linkStart = selection.from
    let linkEnd = selection.to
    
    // 使用更可靠的方法查找链接范围
    const doc = state.doc
    let foundLinkRange: { start: number; end: number; href: string } | null = null
    
    // 遍历文档查找包含当前位置的链接
    doc.descendants((node, pos) => {
      if (node.isText && node.marks) {
        const linkMark = node.marks.find(mark => mark.type === state.schema.marks.link)
        if (linkMark) {
          const nodeStart = pos
          const nodeEnd = pos + node.nodeSize
          
          // 检查当前光标位置是否在这个链接节点内
          if (selection.from >= nodeStart && selection.from <= nodeEnd) {
            // 找到包含当前位置的链接，现在查找完整的链接范围
            let rangeStart = nodeStart
            let rangeEnd = nodeEnd
            
            // 向前查找相同链接的其他文本节点
            let prevPos = nodeStart
            while (prevPos > 0) {
              let foundPrev = false
              doc.nodesBetween(prevPos - 1, prevPos, (prevNode, prevNodePos) => {
                if (prevNode.isText && prevNode.marks) {
                  const prevLinkMark = prevNode.marks.find(mark => 
                    mark.type === state.schema.marks.link && 
                    mark.attrs.href === linkMark.attrs.href
                  )
                  if (prevLinkMark) {
                    rangeStart = prevNodePos
                    foundPrev = true
                  }
                }
              })
              if (!foundPrev) break
              prevPos--
            }
            
            // 向后查找相同链接的其他文本节点
            let nextPos = nodeEnd
            while (nextPos < doc.content.size) {
              let foundNext = false
              doc.nodesBetween(nextPos, nextPos + 1, (nextNode, nextNodePos) => {
                if (nextNode.isText && nextNode.marks) {
                  const nextLinkMark = nextNode.marks.find(mark => 
                    mark.type === state.schema.marks.link && 
                    mark.attrs.href === linkMark.attrs.href
                  )
                  if (nextLinkMark) {
                    rangeEnd = nextNodePos + nextNode.nodeSize
                    foundNext = true
                  }
                }
              })
              if (!foundNext) break
              nextPos++
            }
            
            foundLinkRange = { start: rangeStart, end: rangeEnd, href: linkMark.attrs.href }
            console.log('找到完整链接范围:', foundLinkRange)
            console.log('链接文本:', doc.textBetween(rangeStart, rangeEnd))
            return false // 停止遍历
          }
        }
      }
    })
    
    // 如果找到了链接范围，更新选择
    if (foundLinkRange) {
      linkStart = (foundLinkRange as { start: number; end: number; href: string }).start
      linkEnd = (foundLinkRange as { start: number; end: number; href: string }).end
    }
    
    // 选中完整的链接范围
    if (linkStart !== linkEnd) {
      props.editor.commands.setTextSelection({ from: linkStart, to: linkEnd })
      console.log('已选中完整链接范围:', { from: linkStart, to: linkEnd })
    }
    
    // 使用TipTap内置的unsetLink命令删除链接
    const result = props.editor.chain().focus().unsetLink().run()
    console.log('unsetLink 命令执行结果:', result)
    
    // 检查删除结果
    setTimeout(() => {
      if (!props.editor) return
      const newHTML = props.editor.getHTML()
      const linkCount = (newHTML.match(/<a[^>]*>/g) || []).length
      console.log('删除后HTML:', newHTML)
      console.log('删除后链接数量:', linkCount)
      
      if (linkCount === 0) {
        console.log('✅ 链接删除成功')
      } else {
        console.log('❌ 链接删除失败，仍有残留')
      }
    }, 100)
    
  } catch (error) {
    console.error('删除链接时出错:', error)
  }
  
  linkPanelVisible.value = false
  console.log('链接面板已关闭')
}

// 处理链接面板关闭
const handleLinkPanelClose = () => {
  linkPanelVisible.value = false
  linkData.value = {
    url: ''
  }
  linkElementRef.value = null
}



// 处理高亮按钮点击
const handleHighlightButtonClick = (event?: Event) => {
  if (!props.editor) return
  
  // 确保reference已设置后再显示面板
  if (highlightButtonRef.value) {
    highlightPanelVisible.value = true
  }
}

// 处理高亮颜色选择
const handleHighlightColorSelect = (color: string | null) => {
  if (!props.editor) return
  
  if (color) {
    // 应用高亮颜色
    props.editor.chain().focus().toggleHighlight({ color }).run()
  } else {
    // 取消高亮
    props.editor.chain().focus().unsetHighlight().run()
  }
}

// 处理高亮面板关闭
const handleHighlightPanelClose = () => {
  highlightPanelVisible.value = false
}

// 处理文字颜色按钮点击
const handleTextColorButtonClick = (event?: Event) => {
  if (!props.editor) return
  
  // 确保reference已设置后再显示面板
  if (textColorButtonRef.value) {
    textColorPanelVisible.value = true
  }
}

// 处理文字颜色选择
const handleTextColorSelect = (color: string | null) => {
  if (!props.editor) return
  
  if (color) {
    // 应用文字颜色
    props.editor.chain().focus().setColor(color).run()
  } else {
    // 取消文字颜色
    props.editor.chain().focus().unsetColor().run()
  }
}

// 处理文字颜色面板关闭
const handleTextColorPanelClose = () => {
  textColorPanelVisible.value = false
}

// 处理编辑器中链接点击事件
const handleEditorLinkClick = (event: CustomEvent) => {
  console.log('handleEditorLinkClick called:', event.detail)
  if (!props.editor) return
  
  const { url, position, element } = event.detail
  
  // 设置链接数据
  linkData.value = {
    url: url || ''
  }
  
  // 设置链接元素引用
  linkElementRef.value = element || null
  
  // 选中链接位置
  if (position !== undefined) {
    const { state, dispatch } = props.editor.view
    const $pos = state.doc.resolve(position)
    const link = $pos.marks().find(mark => mark.type === state.schema.marks.link)
    
    if (link) {
      // 找到链接的范围
      let start = position
      let end = position
      
      // 向前查找链接开始位置
      while (start > 0) {
        const $start = state.doc.resolve(start - 1)
        const hasLink = $start.marks().some(mark => 
          mark.type === state.schema.marks.link && mark.attrs.href === link.attrs.href
        )
        if (!hasLink) break
        start--
      }
      
      // 向后查找链接结束位置
      while (end < state.doc.content.size) {
        const $end = state.doc.resolve(end)
        const hasLink = $end.marks().some(mark => 
          mark.type === state.schema.marks.link && mark.attrs.href === link.attrs.href
        )
        if (!hasLink) break
        end++
      }
      
      // 选中整个链接
      const tr = state.tr.setSelection(
        // state.selection.constructor.create(state.doc, start, end)
        TextSelection.create(state.doc, start, end)
      )
      dispatch(tr)
    }
  }
  
  // 显示链接面板
  linkPanelVisible.value = true
}

// 绑定事件监听器的函数
const bindEventListener = () => {
  if (props.editor?.view?.dom) {
    const editorElement = props.editor.view.dom.closest('.gl-lite-editor')
    console.log('Binding event listener to:', editorElement)
    if (editorElement) {
      editorElement.addEventListener('editor:link:click', handleEditorLinkClick as EventListener)
      console.log('Event listener bound successfully')
    } else {
      console.warn('Could not find .gl-lite-editor container')
    }
  } else {
    console.warn('Editor view DOM not available')
  }
}

// 监听editor prop变化
watch(() => props.editor, (newEditor) => {
  if (newEditor?.view?.dom) {
    nextTick(() => {
      bindEventListener()
    })
  }
}, { immediate: true })

// 添加事件监听
onMounted(() => {
  // 使用nextTick确保DOM完全渲染后再绑定事件
  nextTick(() => {
    bindEventListener()
  })
})

// 移除事件监听
onUnmounted(() => {
  if (props.editor?.view?.dom) {
    const editorElement = props.editor.view.dom.closest('.gl-lite-editor')
    if (editorElement) {
      editorElement.removeEventListener('editor:link:click', handleEditorLinkClick as EventListener)
    }
  }
})
</script>

<style lang="less">
.gl-editor-toolbar {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 8px 12px;
  background: var(--gl-toolbar-bg, #fafafa);
  border: 1px solid var(--gl-border-color, #e0e0e0);
  flex-wrap: wrap;
  
  &--small {
    padding: 6px 8px;
    gap: 1px;
  }
  
  &--medium {
    padding: 8px 12px;
    gap: 2px;
  }
  
  &--large {
    padding: 10px 16px;
    gap: 4px;
  }
}

// 暗色主题
.gl-theme-dark {
  .gl-editor-toolbar {
    background: var(--gl-toolbar-bg, #2d2d2d);
    border-bottom-color: var(--gl-border-color, #404040);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .gl-editor-toolbar {
    padding: 6px 8px;
    gap: 1px;
    
    // 在小屏幕上隐藏一些不太重要的按钮
    .gl-toolbar-button {
      &[title*="删除线"],
      &[title*="代码块"],
      &[title*="引用块"] {
        display: none;
      }
    }
    
    // 调整分隔符间距
    .gl-toolbar-separator {
      margin: 0 1px;
    }
  }
}

@media (max-width: 480px) {
  .gl-editor-toolbar {
    padding: 4px 6px;
    
    // 在更小的屏幕上进一步简化
    .gl-toolbar-button {
      &[title*="下划线"],
      &[title*="背景颜色"],
      &[title*="文字颜色"] {
        display: none;
      }
    }
  }
}
</style>