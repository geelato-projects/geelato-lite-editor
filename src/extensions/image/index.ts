import Image from '@tiptap/extension-image'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import type { Node as ProseMirrorNode } from '@tiptap/pm/model'
import ImageNodeView from './ImageNodeView.vue'

/**
 * 增强的图片扩展
 * 基于es-drager组件实现图片的拖拽、缩放、旋转功能
 */
export default Image.extend({
  name: 'image',
  
  draggable: true,
  
  addAttributes() {
    return {
      // @ts-ignore
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('width'),
        renderHTML: (attributes: any) => {
          if (!attributes.width) return {}
          return { width: attributes.width }
        },
      },
      height: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('height'),
        renderHTML: (attributes: any) => {
          if (!attributes.height) return {}
          return { height: attributes.height }
        },
      },
      angle: {
        default: 0,
        parseHTML: (element: HTMLElement) => {
          const transform = element.style.transform
          const match = transform.match(/rotate\(([^)]+)deg\)/)
          return match ? parseFloat(match[1]) : 0
        },
        renderHTML: (attributes: any) => {
          if (!attributes.angle) return {}
          return {
            style: `transform: rotate(${attributes.angle}deg)`
          }
        },
      },
      align: {
        default: 'left',
        parseHTML: (element: HTMLElement) => {
          // 从包装div的style中解析对齐方式
          const parent = element.parentElement
          if (parent && parent.style.textAlign) {
            return parent.style.textAlign
          }
          return element.getAttribute('data-align') || 'left'
        },
        renderHTML: (attributes: any) => {
          if (!attributes.align || attributes.align === 'left') return {}
          return { 'data-align': attributes.align }
        },
      },
      proportionLocked: {
        default: false,
        parseHTML: (element: HTMLElement) => element.getAttribute('data-proportion-locked') === 'true',
        renderHTML: (attributes: any) => {
          if (!attributes.proportionLocked) return {}
          return { 'data-proportion-locked': 'true' }
        },
      },
    }
  },
  
  renderHTML({ HTMLAttributes, node }: { HTMLAttributes: any; node: ProseMirrorNode }) {
    const align = node.attrs.align || 'left'
    
    // 创建包装div的HTML
    const wrapperStyle = align !== 'left' ? `text-align: ${align};` : ''
    const imgHTML = ['img', HTMLAttributes]
    
    if (wrapperStyle) {
      return ['div', { style: wrapperStyle }, imgHTML]
    }
    
    return imgHTML
  },
  
  addNodeView() {
    return VueNodeViewRenderer(ImageNodeView)
  },
  
  addOptions() {
    return {
      // @ts-ignore
      ...this.parent?.(),
      // 允许base64图片
      allowBase64: true,
      // 设置为块级元素
      inline: false,
      // 添加自定义HTML属性
      HTMLAttributes: {
        class: 'gl-image',
      },
    }
  },
})