<template>
  <node-view-wrapper class="gl-image-wrapper" :class="wrapperClass" :style="wrapperStyle">
    <!-- 可编辑模式下的可调整大小图片 -->
    <ResizableImage
      v-if="!readonly"
      :width="imageWidth"
      :height="imageHeight"
      :disabled="false"
      :equal-proportion="proportionLocked"
      @resize="handleResize"
      @change="handleChange"
      class="gl-image-resizable"
    >
      <img
        :src="node.attrs.src"
        :alt="node.attrs.alt || ''"
        :title="node.attrs.title || ''"
        :width="imageWidth"
        :height="imageHeight"
        :style="imageStyle"
        class="gl-image"
        data-drag-handle
        @load="handleImageLoad"
        @error="handleImageError"
      />
    </ResizableImage>
    
    <!-- 只读模式下的普通图片显示 -->
    <img
      v-else
      :src="node.attrs.src"
      :alt="node.attrs.alt || ''"
      :title="node.attrs.title || ''"
      :width="imageWidth"
      :height="imageHeight"
      :style="imageStyle"
      class="gl-image gl-image--readonly"
      data-drag-handle
    />
    
    <!-- 暂时禁用图片BubbleMenu -->
    <!-- <ImageBubbleMenu
      v-if="showBubbleMenu && !readonly"
      :editor="editor"
      :visible="showBubbleMenu"
      :node="node"
      :update-attributes="updateAttributes"
      :delete-node="deleteNode"
      @close="hideBubbleMenu"
      @interact="resetBubbleMenuTimer"
      class="image-bubble-menu-wrapper"
    /> -->
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { NodeViewWrapper } from '@tiptap/vue-3'
import type { Node } from '@tiptap/pm/model'
import type { Editor } from '@tiptap/vue-3'
import type { NodeViewProps } from '@tiptap/core'
import ResizableImage from '../../components/ui/ResizableImage.vue'

interface Props extends NodeViewProps {
  // All required props are inherited from NodeViewProps
}

const props = defineProps<Props>()

// 图片尺寸状态
const imageWidth = ref(props.node.attrs.width || 200)
const imageHeight = ref(props.node.attrs.height || 150)

// 是否为只读模式
const readonly = computed(() => !props.editor.isEditable)

// 移除BubbleMenu相关状态

// 比例锁定状态
const proportionLocked = computed(() => props.node.attrs.proportionLocked || false)

// 包装器样式类
const wrapperClass = computed(() => ({
  'gl-image-wrapper--selected': props.selected,
}))

// 包装器样式（包含对齐）
const wrapperStyle = computed(() => {
  const align = props.node.attrs.align || 'left'
  return {
    textAlign: align
  }
})



// 图片样式
const imageStyle = computed(() => ({
  maxWidth: '100%',
  height: 'auto',
  display: 'block'
}))

// 处理图片加载
const handleImageLoad = (event: Event) => {
  const img = event.target as HTMLImageElement
  if (!props.node.attrs.width && !props.node.attrs.height) {
    // 如果没有设置尺寸，使用图片原始尺寸（限制最大尺寸）
    const maxWidth = 400
    const maxHeight = 300
    
    let { naturalWidth, naturalHeight } = img
    
    // 按比例缩放
    if (naturalWidth > maxWidth || naturalHeight > maxHeight) {
      const ratio = Math.min(maxWidth / naturalWidth, maxHeight / naturalHeight)
      naturalWidth *= ratio
      naturalHeight *= ratio
    }
    
    imageWidth.value = Math.round(naturalWidth)
    imageHeight.value = Math.round(naturalHeight)
    
    // 更新节点属性
    props.updateAttributes({
      width: imageWidth.value,
      height: imageHeight.value
    })
  }
}

// 处理图片加载错误
const handleImageError = () => {
  console.warn('图片加载失败:', props.node.attrs.src)
}

// 移除气泡菜单相关的事件处理函数

// 移除气泡菜单相关的监听器和清理逻辑

// 处理缩放
const handleResize = (dragData: any) => {
  // 确保尺寸在合理范围内
  const newWidth = Math.max(50, Math.min(800, Math.round(dragData.width)))
  const newHeight = Math.max(50, Math.min(600, Math.round(dragData.height)))
  
  imageWidth.value = newWidth
  imageHeight.value = newHeight
  
  // 更新节点属性
  props.updateAttributes({
    width: imageWidth.value,
    height: imageHeight.value
  })
  
  // 图片尺寸调整完成
}



// 处理位置和其他变化
const handleChange = (dragData: any) => {
  // 可以在这里处理其他变化，如位置等
}

// 组件挂载时初始化
onMounted(() => {
  if (props.node.attrs.width) {
    imageWidth.value = props.node.attrs.width
  }
  if (props.node.attrs.height) {
    imageHeight.value = props.node.attrs.height
  }
})
</script>

<style scoped>
.gl-image-wrapper {
  display: block;
  position: relative;
  padding: 4px;
  width: 100%;
  /* box-sizing: border-box; */
}



.gl-image-resizable {
  display: inline-block;
}

.gl-image {
  max-width: 100%;
  height: auto;
  /* border-radius: 4px; */
  /* box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); */
  /* transition: box-shadow 0.2s ease; */
}

.gl-image:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.gl-image--readonly {
  cursor: default;
}

/* 选中状态样式 */
.ProseMirror-selectednode .gl-image {
  /* box-shadow: 0 0 0 2px #3a7afe; */
}
</style>