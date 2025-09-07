<template>
  <div v-if="visible" class="image-preview-overlay" @click="handleOverlayClick" @keydown="handleKeydown" tabindex="0">
    <div class="image-preview-container">
      <!-- 工具栏 -->
      <div class="image-preview-toolbar">
        <button class="toolbar-btn" @click="zoomOut" title="缩小">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13H5v-2h14v2z"/>
          </svg>
        </button>
        <span class="zoom-info">{{ Math.round(scale * 100) }}%</span>
        <button class="toolbar-btn" @click="zoomIn" title="放大">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
        </button>
        <div class="toolbar-divider"></div>
        <button class="toolbar-btn" @click="rotateLeft" title="左转90°">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7.11 8.53L5.7 7.11C4.8 8.27 4.24 9.61 4.07 11h2.02c.14-.87.49-1.72 1.02-2.47zM6.09 13H4.07c.17 1.39.72 2.73 1.62 3.89l1.41-1.42c-.52-.75-.87-1.59-1.01-2.47zm1.01 5.32c1.16.9 2.51 1.44 3.9 1.61V17.9c-.87-.15-1.71-.49-2.46-1.03L7.1 18.32zM13 4.07V1L8.45 5.55 13 10V6.09c2.84.48 5 2.94 5 5.91s-2.16 5.43-5 5.91v2.02c3.95-.49 7-3.85 7-7.93s-3.05-7.44-7-7.93z"/>
          </svg>
        </button>
        <button class="toolbar-btn" @click="rotateRight" title="右转90°">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.55 5.55L11 1v3.07C7.06 4.56 4 7.92 4 12s3.05 7.44 7 7.93v-2.02c-2.84-.48-5-2.94-5-5.91s2.16-5.43 5-5.91V10l4.55-4.45zM19.93 11c-.17-1.39-.72-2.73-1.62-3.89l-1.42 1.42c.54.75.88 1.6 1.02 2.47h2.02zM13 17.9v2.02c1.39-.17 2.74-.71 3.9-1.61l-1.44-1.44c-.75.54-1.59.89-2.46 1.03zm3.89-2.42l1.42 1.41c.9-1.16 1.45-2.5 1.62-3.89h-2.02c-.14.87-.48 1.72-1.02 2.48z"/>
          </svg>
        </button>
        <button class="toolbar-btn" @click="resetTransform" title="重置">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
          </svg>
        </button>
        <div class="toolbar-divider"></div>
        <button class="toolbar-btn close-btn" @click="close" title="关闭">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>

      <!-- 图片容器 -->
      <div class="image-preview-content" ref="contentRef">
        <div 
          class="image-wrapper"
          :style="imageWrapperStyle"
          @mousedown="handleMouseDown"
          @wheel="handleWheel"
        >
          <img 
            ref="imageRef"
            :src="imageSrc" 
            :alt="imageAlt"
            class="preview-image"
            :style="imageStyle"
            @load="handleImageLoad"
            @dragstart.prevent
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'

interface Props {
  visible: boolean
  imageSrc: string
  imageAlt?: string
}

interface Emits {
  (e: 'close'): void
  (e: 'update:visible', value: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  imageAlt: ''
})

const emit = defineEmits<Emits>()

// 响应式状态
const scale = ref(1)
const rotation = ref(0)
const translateX = ref(0)
const translateY = ref(0)
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const imageLoaded = ref(false)

// 引用
const imageRef = ref<HTMLImageElement>()
const contentRef = ref<HTMLElement>()

// 计算属性
const imageStyle = computed(() => ({
  transform: `scale(${scale.value}) rotate(${rotation.value}deg) translate(${translateX.value}px, ${translateY.value}px)`,
  transformOrigin: 'center center',
  transition: isDragging.value ? 'none' : 'transform 0.3s ease',
  cursor: isDragging.value ? 'grabbing' : 'grab',
  maxWidth: 'none',
  maxHeight: 'none',
  userSelect: 'none' as 'none'
}))

const imageWrapperStyle = computed(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  overflow: 'hidden'
}))

// 方法
const zoomIn = () => {
  scale.value = Math.min(scale.value * 1.2, 5)
}

const zoomOut = () => {
  scale.value = Math.max(scale.value / 1.2, 0.1)
}

const rotateLeft = () => {
  rotation.value -= 90
}

const rotateRight = () => {
  rotation.value += 90
}

const resetTransform = () => {
  scale.value = 1
  rotation.value = 0
  translateX.value = 0
  translateY.value = 0
}

const close = () => {
  emit('close')
  emit('update:visible', false)
}

const handleOverlayClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    close()
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'Escape':
      close()
      break
    case '+':
    case '=':
      event.preventDefault()
      zoomIn()
      break
    case '-':
      event.preventDefault()
      zoomOut()
      break
    case 'r':
    case 'R':
      event.preventDefault()
      rotateRight()
      break
    case '0':
      event.preventDefault()
      resetTransform()
      break
  }
}

const handleWheel = (event: WheelEvent) => {
  event.preventDefault()
  const delta = event.deltaY > 0 ? -1 : 1
  const zoomFactor = 1 + delta * 0.1
  scale.value = Math.max(0.1, Math.min(5, scale.value * zoomFactor))
}

const handleMouseDown = (event: MouseEvent) => {
  if (event.button !== 0) return // 只处理左键
  
  isDragging.value = true
  dragStart.value = {
    x: event.clientX - translateX.value,
    y: event.clientY - translateY.value
  }
  
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
  event.preventDefault()
}

const handleMouseMove = (event: MouseEvent) => {
  if (!isDragging.value) return
  
  translateX.value = event.clientX - dragStart.value.x
  translateY.value = event.clientY - dragStart.value.y
}

const handleMouseUp = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
}

const handleImageLoad = () => {
  imageLoaded.value = true
  // 图片加载完成后，自动适应容器大小
  nextTick(() => {
    if (imageRef.value && contentRef.value) {
      const img = imageRef.value
      const container = contentRef.value
      const containerRect = container.getBoundingClientRect()
      
      // 计算合适的初始缩放比例
      const scaleX = (containerRect.width * 0.9) / img.naturalWidth
      const scaleY = (containerRect.height * 0.9) / img.naturalHeight
      const initialScale = Math.min(scaleX, scaleY, 1) // 不超过原始大小
      
      scale.value = initialScale
    }
  })
}

// 监听visible变化，重置状态
watch(() => props.visible, (newVisible) => {
  if (newVisible) {
    resetTransform()
    imageLoaded.value = false
    nextTick(() => {
      // 聚焦到overlay以便接收键盘事件
      const overlay = document.querySelector('.image-preview-overlay') as HTMLElement
      if (overlay) {
        overlay.focus()
      }
    })
  }
})

// 清理事件监听器
onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
})
</script>

<style scoped>
.image-preview-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease;
  outline: none;
}

.image-preview-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.image-preview-toolbar {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 8px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 10000;
  backdrop-filter: blur(10px);
}

.toolbar-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.toolbar-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.toolbar-btn:active {
  background-color: rgba(255, 255, 255, 0.2);
}

.close-btn:hover {
  background-color: rgba(255, 0, 0, 0.2);
}

.zoom-info {
  color: white;
  font-size: 14px;
  font-weight: 500;
  min-width: 50px;
  text-align: center;
}

.toolbar-divider {
  width: 1px;
  height: 20px;
  background-color: rgba(255, 255, 255, 0.3);
  margin: 0 4px;
}

.image-preview-content {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.preview-image {
  display: block;
  max-width: none;
  max-height: none;
  object-fit: contain;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .image-preview-toolbar {
    top: 10px;
    padding: 6px 8px;
    gap: 6px;
  }
  
  .toolbar-btn {
    padding: 4px;
  }
  
  .zoom-info {
    font-size: 12px;
    min-width: 40px;
  }
}
</style>