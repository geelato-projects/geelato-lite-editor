import { Link } from '@tiptap/extension-link'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import type { Mark } from '@tiptap/pm/model'
import type { EditorState, Transaction } from '@tiptap/pm/state'
import type { ChainedCommands } from '@tiptap/core'
import { TextSelection } from '@tiptap/pm/state'
import { type LinkConfig } from '../../types'

/**
 * 自定义链接扩展
 * 在编辑模式下点击链接时显示链接编辑面板，而不是直接打开链接
 */
export default Link.extend<LinkConfig>({
  name: 'link',

  addOptions() {
    return {
      ...this.parent?.(),
      openOnClick: false,
      HTMLAttributes: {
        target: '_blank',
        rel: 'noopener noreferrer nofollow',
        class: null,
      },
    }
  },

  addProseMirrorPlugins() {
    const plugins = this.parent?.() || []
    
    // 添加自定义点击处理插件
    plugins.push(
      new Plugin({
        key: new PluginKey('linkClickHandler'),
        props: {
          handleClick: (view, pos, event) => {
            const { schema, doc, tr } = view.state
            const range = doc.resolve(pos)
            const link = range.marks().find(mark => mark.type === schema.marks.link)
            
            if (link && event.target instanceof HTMLElement) {
              const linkElement = event.target.closest('a')
              if (linkElement) {
                // 阻止默认的链接打开行为
                event.preventDefault()
                
                // 触发自定义事件，通知编辑器显示链接面板
                const customEvent = new CustomEvent('editor:link:click', {
                  detail: {
                    url: link.attrs.href,
                    target: link.attrs.target,
                    element: linkElement,
                    position: pos
                  }
                })
                
                // 在编辑器容器上触发事件
                const editorElement = view.dom.closest('.gl-lite-editor')
                if (editorElement) {
                  editorElement.dispatchEvent(customEvent)
                }
                
                return true
              }
            }
            
            return false
          }
        }
      })
    )
    
    return plugins
  },

  addCommands() {
    return {
      ...this.parent?.(),
      
      /**
       * 设置链接并选中
       */
      setLinkAndSelect: (attributes: any) => ({ commands, state, dispatch }: { commands: ChainedCommands, state: EditorState, dispatch: (tr: Transaction) => void }) => {
        const { selection } = state
        const { from, to } = selection
        
        // 如果没有选中文本，则选中整个链接
        if (from === to) {
          const $pos = state.doc.resolve(from)
          const link = $pos.marks().find((mark: Mark) => mark.type === state.schema.marks.link)
          
          if (link) {
            // 找到链接的范围
            let start = from
            let end = from
            
            // 向前查找链接开始位置
            while (start > 0) {
              const $start = state.doc.resolve(start - 1)
              const hasLink = $start.marks().some((mark: Mark) => mark.type === state.schema.marks.link && mark.attrs.href === link.attrs.href)
              if (!hasLink) break
              start--
            }
            
            // 向后查找链接结束位置
            while (end < state.doc.content.size) {
              const $end = state.doc.resolve(end)
              const hasLink = $end.marks().some((mark: Mark) => mark.type === state.schema.marks.link && mark.attrs.href === link.attrs.href)
              if (!hasLink) break
              end++
            }
            
            // 选中整个链接
            if (dispatch) {
              const tr = state.tr.setSelection(TextSelection.create(state.doc, start, end))
              dispatch(tr)
            }
          }
        }
        
        return commands.setLink(attributes)
      },
      
      /**
       * 获取当前链接信息
       */
      getCurrentLink: () => ({ state }: { state: EditorState }) => {
        const { selection } = state
        const { from } = selection
        const $pos = state.doc.resolve(from)
        const link = $pos.marks().find((mark: Mark) => mark.type === state.schema.marks.link)
        
        return link ? link.attrs : null
      }
    }
  }
})