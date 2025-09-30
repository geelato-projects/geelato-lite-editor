<template>
  <div class="font-size-dropdown" ref="dropdownRef">
    <div class="font-size-control-group">
      <!-- 字体大小显示和下拉按钮 -->
      <div class="font-size-display" @click="toggleDropdown">
        <span class="font-size-current">{{ currentDisplayValue }}</span>
        <svg class="dropdown-arrow" :class="{ open: isOpen }" width="12" height="12" viewBox="0 0 12 12">
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      
      <!-- 加减按钮 -->
      <div class="font-size-controls">
        <ToolbarButton
          icon="font-decrease"
          title="减小字体"
          :disabled="!canDecrease"
          class="font-size-control-btn"
          @click="decreaseFontSize"
        />
        <ToolbarButton
          icon="font-increase"
          title="增大字体"
          :disabled="!canIncrease"
          class="font-size-control-btn"
          @click="increaseFontSize"
        />
      </div>
    </div>
    
    <!-- 下拉菜单 -->
    <div 
      v-if="isOpen" 
      class="font-size-dropdown-menu"
      @click.stop
    >
      <div 
        v-for="option in fontSizeOptions"
        :key="option.value"
        class="font-size-dropdown-item"
        :class="{ active: currentFontSize === option.value }"
        @click="executeAction(option.value)"
      >
        <span class="font-size-label">{{ option.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import SvgIcon from '../ui/SvgIcon.vue'
import ToolbarButton from '../ui/ToolbarButton.vue'

interface Props {
  editor: Editor | null
}

const props = defineProps<Props>()

const dropdownRef = ref<HTMLElement>()
const isOpen = ref(false)

// 字体大小选项 - 9到72的数字字体大小
const fontSizeOptions = [
  { value: '9px', label: '9' },
  { value: '10px', label: '10' },
  { value: '11px', label: '11' },
  { value: '12px', label: '12' },
  { value: '14px', label: '14' },
  { value: '16px', label: '16' },
  { value: '18px', label: '18' },
  { value: '20px', label: '20' },
  { value: '22px', label: '22' },
  { value: '24px', label: '24' },
  { value: '26px', label: '26' },
  { value: '28px', label: '28' },
  { value: '36px', label: '36' },
  { value: '42px', label: '42' },
  { value: '48px', label: '48' },
  { value: '72px', label: '72' }
]

// 获取当前字体大小
const currentFontSize = computed(() => {
  if (!props.editor) return '14px'
  
  const { from, to } = props.editor.state.selection
  let fontSize = '14px'
  
  props.editor.state.doc.nodesBetween(from, to, (node) => {
    if (node.marks) {
      const textStyleMark = node.marks.find(mark => mark.type.name === 'textStyle')
      if (textStyleMark && textStyleMark.attrs.fontSize) {
        fontSize = textStyleMark.attrs.fontSize
      }
    }
  })
  
  return fontSize
})

// 当前显示值
const currentDisplayValue = computed(() => {
  if (!props.editor) return '14'
  const current = fontSizeOptions.find(option => option.value === currentFontSize.value)
  return current ? current.label : parseInt(currentFontSize.value).toString()
})

// 获取当前字体大小的索引
const currentFontSizeIndex = computed(() => {
  return fontSizeOptions.findIndex(option => option.value === currentFontSize.value)
})

// 是否可以减小字体
const canDecrease = computed(() => {
  if (!props.editor) return false
  return parseInt(currentFontSize.value) > 1
})

// 是否可以增大字体
const canIncrease = computed(() => {
  if (!props.editor) return false
  return parseInt(currentFontSize.value) < 999 // 设置一个合理的最大值
})

// 切换下拉菜单
const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

// 关闭下拉菜单
const closeDropdown = () => {
  isOpen.value = false
}

// 增大字体
const increaseFontSize = () => {
  if (!props.editor) return
  
  const currentSize = parseInt(currentFontSize.value)
  const newSize = `${currentSize + 1}px`
  executeAction(newSize)
}

// 减小字体
const decreaseFontSize = () => {
  if (!props.editor) return
  
  const currentSize = parseInt(currentFontSize.value)
  if (currentSize > 1) { // 防止字体大小小于1px
    const newSize = `${currentSize - 1}px`
    executeAction(newSize)
  }
}

// 执行字体大小操作
const executeAction = (fontSize: string) => {
  if (!props.editor) return
  
  if (fontSize === '14px') {
    // 移除字体大小样式，恢复默认
    props.editor.chain().focus().unsetFontSize().run()
  } else {
    // 设置指定的字体大小
    props.editor.chain().focus().setFontSize(fontSize).run()
  }
  
  closeDropdown()
}

// 点击外部关闭下拉菜单
const handleClickOutside = (event: Event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

// 添加事件监听
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

// 移除事件监听
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.font-size-dropdown {
  position: relative;
  display: inline-block;
}

.font-size-control-group {
  display: flex;
  align-items: center;
  gap: 2px;
}

.font-size-display {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 8px;
  cursor: pointer;
  min-width: 40px;
  color: var(--gl-text-color, #333);
  transition: all 0.2s ease;
  border: 1px solid transparent;
  border-radius: 4px;
  background: transparent;
}

.font-size-display:hover {
  background: var(--gl-hover-bg, #f5f5f5);
  border-color: var(--gl-border-color, #e0e0e0);
}

.font-size-current {
  font-weight: 500;
}

.dropdown-arrow {
  transition: transform 0.2s;
  color: var(--gl-text-color-secondary, #86909c);
}

.dropdown-arrow.open {
  transform: rotate(180deg);
}

.font-size-controls {
  display: flex;
  gap: 2px;
}

.font-size-control-btn {
  /* 移除所有强制样式覆盖，让ToolbarButton的默认样式生效 */
}

.font-size-dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: var(--gl-z-index-dropdown, 1050);
  min-width: 80px;
  max-height: 300px;
  overflow-y: auto;
  background: var(--gl-color-bg-popup, #ffffff);
  border: 1px solid var(--gl-color-border, #e5e6eb);
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 4px 0;
  margin-top: 4px;
}

.font-size-dropdown-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 13px;
  color: var(--gl-text-color, #1d2129);
  transition: all 0.2s;
}

.font-size-dropdown-item:hover {
  background-color: var(--gl-color-fill-2, #f7f8fa);
}

.font-size-dropdown-item.active {
  background-color: var(--gl-color-primary-light-1, #e8f3ff);
  color: var(--gl-color-primary-6, #165dff);
}

.font-size-label {
  flex: 1;
  white-space: nowrap;
}

.font-size-value {
  font-size: 12px;
  color: var(--gl-text-color-secondary, #86909c);
  opacity: 0.8;
  font-weight: 500;
}

.font-size-dropdown-item.active .font-size-value {
  color: var(--gl-color-primary-6, #165dff);
}
</style>