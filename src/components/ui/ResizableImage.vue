<template>
  <div
    ref="containerRef"
    class="resizable-image-container"
    :style="containerStyle"
    @mousedown="handleMouseDown"
  >
    <slot />
    
    <!-- 调整手柄 -->
    <div
      v-if="!disabled && showHandles"
      class="resize-handles"
    >
      <!-- 角落手柄 -->
      <div
        class="resize-handle resize-handle--tl"
        @mousedown="startResize('tl', $event)"
      ></div>
      <div
        class="resize-handle resize-handle--tr"
        @mousedown="startResize('tr', $event)"
      ></div>
      <div
        class="resize-handle resize-handle--bl"
        @mousedown="startResize('bl', $event)"
      ></div>
      <div
        class="resize-handle resize-handle--br"
        @mousedown="startResize('br', $event)"
      ></div>
      
      <!-- 边缘手柄 -->
      <div
        class="resize-handle resize-handle--tm"
        @mousedown="startResize('tm', $event)"
      ></div>
      <div
        class="resize-handle resize-handle--bm"
        @mousedown="startResize('bm', $event)"
      ></div>
      <div
        class="resize-handle resize-handle--ml"
        @mousedown="startResize('ml', $event)"
      ></div>
      <div
        class="resize-handle resize-handle--mr"
        @mousedown="startResize('mr', $event)"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Props {
  width?: number
  height?: number
  disabled?: boolean
  equalProportion?: boolean
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
}

interface Emits {
  resize: [data: { width: number; height: number; direction: string }]
  change: [data: any]
}

const props = withDefaults(defineProps<Props>(), {
  width: 200,
  height: 150,
  disabled: false,
  equalProportion: false,
  minWidth: 50,
  minHeight: 50,
  maxWidth: 800,
  maxHeight: 600
})

const emit = defineEmits<Emits>()

const containerRef = ref<HTMLElement>()
const isResizing = ref(false)
const showHandles = ref(false)

const currentWidth = ref(props.width)
const currentHeight = ref(props.height)

let resizeDirection = ''
let startX = 0
let startY = 0
let startWidth = 0
let startHeight = 0

// 容器样式
const containerStyle = computed(() => ({
  // width: `${currentWidth.value}px`,
  // height: `${currentHeight.value}px`,
  position: 'relative' as const,
  display: 'inline-block' as const
}))

// 处理鼠标按下
const handleMouseDown = (event: MouseEvent) => {
  if (props.disabled) return
  // 不阻止默认行为和事件冒泡，让tiptap能够处理选中逻辑
  // event.preventDefault() // 注释掉，允许tiptap处理选中
  showHandles.value = true
}

// 开始调整大小
const startResize = (direction: string, event: MouseEvent) => {
  if (props.disabled) return
  
  event.preventDefault()
  event.stopPropagation()
  
  isResizing.value = true
  resizeDirection = direction
  startX = event.clientX
  startY = event.clientY
  startWidth = currentWidth.value
  startHeight = currentHeight.value
  
  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopResize)
  document.body.style.cursor = getCursor(direction)
}

// 处理调整大小
const handleResize = (event: MouseEvent) => {
  if (!isResizing.value) return
  
  const deltaX = event.clientX - startX
  const deltaY = event.clientY - startY
  
  let newWidth = startWidth
  let newHeight = startHeight
  
  // 根据方向计算新尺寸
  switch (resizeDirection) {
    case 'tl': // 左上角
      newWidth = startWidth - deltaX
      newHeight = startHeight - deltaY
      break
    case 'tr': // 右上角
      newWidth = startWidth + deltaX
      newHeight = startHeight - deltaY
      break
    case 'bl': // 左下角
      newWidth = startWidth - deltaX
      newHeight = startHeight + deltaY
      break
    case 'br': // 右下角
      newWidth = startWidth + deltaX
      newHeight = startHeight + deltaY
      break
    case 'tm': // 上边
      newHeight = startHeight - deltaY
      break
    case 'bm': // 下边
      newHeight = startHeight + deltaY
      break
    case 'ml': // 左边
      newWidth = startWidth - deltaX
      break
    case 'mr': // 右边
      newWidth = startWidth + deltaX
      break
  }
  
  // 等比例缩放
  if (props.equalProportion && ['tl', 'tr', 'bl', 'br'].includes(resizeDirection)) {
    const ratio = startWidth / startHeight
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      newHeight = newWidth / ratio
    } else {
      newWidth = newHeight * ratio
    }
  }
  
  // 限制最小最大尺寸
  newWidth = Math.max(props.minWidth, Math.min(props.maxWidth, newWidth))
  newHeight = Math.max(props.minHeight, Math.min(props.maxHeight, newHeight))
  
  // 确保尺寸变化是有效的
  if (newWidth < props.minWidth || newHeight < props.minHeight) {
    return
  }
  
  currentWidth.value = Math.round(newWidth)
  currentHeight.value = Math.round(newHeight)
  
  emit('resize', {
    width: currentWidth.value,
    height: currentHeight.value,
    direction: resizeDirection
  })
  
  emit('change', {
    width: currentWidth.value,
    height: currentHeight.value,
    direction: resizeDirection
  })
}

// 停止调整大小
const stopResize = () => {
  isResizing.value = false
  resizeDirection = ''
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
  document.body.style.cursor = ''
}



// 获取光标样式
const getCursor = (direction: string): string => {
  const cursors: Record<string, string> = {
    'tl': 'nw-resize',
    'tr': 'ne-resize',
    'bl': 'sw-resize',
    'br': 'se-resize',
    'tm': 'n-resize',
    'bm': 's-resize',
    'ml': 'w-resize',
    'mr': 'e-resize'
  }
  return cursors[direction] || 'default'
}

// 处理点击外部
const handleClickOutside = (event: Event) => {
  if (!containerRef.value?.contains(event.target as Node)) {
    showHandles.value = false
  }
}

// 监听属性变化
const updateFromProps = () => {
  currentWidth.value = props.width
  currentHeight.value = props.height
}

onMounted(() => {
  updateFromProps()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
})

// 暴露方法
defineExpose({
  updateFromProps
})
</script>

<style scoped>
.resizable-image-container {
  position: relative;
  display: inline-block;
  user-select: none;
}

.resize-handles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.resize-handle {
  position: absolute;
  background: #3a7afe;
  border: 1px solid #fff;
  border-radius: 2px;
  width: 8px;
  height: 8px;
  pointer-events: auto;
  z-index: 10;
}

/* 角落手柄 */
.resize-handle--tl {
  top: -4px;
  left: -4px;
  cursor: nw-resize;
}

.resize-handle--tr {
  top: -4px;
  right: -4px;
  cursor: ne-resize;
}

.resize-handle--bl {
  bottom: -4px;
  left: -4px;
  cursor: sw-resize;
}

.resize-handle--br {
  bottom: -4px;
  right: -4px;
  cursor: se-resize;
}

/* 边缘手柄 */
.resize-handle--tm {
  top: -4px;
  left: 50%;
  transform: translateX(-50%);
  cursor: n-resize;
}

.resize-handle--bm {
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  cursor: s-resize;
}

.resize-handle--ml {
  left: -4px;
  top: 50%;
  transform: translateY(-50%);
  cursor: w-resize;
}

.resize-handle--mr {
  right: -4px;
  top: 50%;
  transform: translateY(-50%);
  cursor: e-resize;
}



/* 悬停效果 */
.resize-handle:hover {
  background: #2563eb;
  transform: scale(1.1);
}

.resize-handle--tm:hover,
.resize-handle--bm:hover {
  transform: translateX(-50%) scale(1.1);
}

.resize-handle--ml:hover,
.resize-handle--mr:hover {
  transform: translateY(-50%) scale(1.1);
}
</style>