<template>
  <div class="heading-dropdown" ref="dropdownRef">
    <ToolbarButton
      :icon="currentIcon"
      :title="currentTitle"
      :active="currentHeadingLevel > 0"
      :disabled="false"
      @click="toggleDropdown"
      class="heading-dropdown-trigger"
    />
    <div 
      v-if="isOpen" 
      class="heading-dropdown-menu"
      @click.stop
    >
      <div 
        v-for="option in headingOptions"
        :key="option.level"
        class="heading-dropdown-item"
        :class="{ active: currentHeadingLevel === option.level }"
        @click="executeAction(option.level)"
      >
        <span class="heading-text" :style="{ fontSize: option.fontSize, fontWeight: option.level > 0 ? 'bold' : 'normal' }">{{ option.title }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import ToolbarButton from '../ui/ToolbarButton.vue'
import type { Editor } from '@tiptap/vue-3'
import type { IconName } from '../ui/icons'

interface Props {
  editor: Editor | null
}

const props = defineProps<Props>()

const dropdownRef = ref<HTMLElement>()
const isOpen = ref(false)

// 当前标题级别
const currentHeadingLevel = computed(() => {
  if (!props.editor) return 0
  
  for (let level = 1; level <= 6; level++) {
    if (props.editor.isActive('heading', { level })) {
      return level
    }
  }
  return 0 // 0 表示正文
})

// 当前显示的图标
const currentIcon = computed((): IconName => {
  return 'heading'
})

// 当前显示的标题
const currentTitle = computed(() => {
  const level = currentHeadingLevel.value
  if (level === 0) return '正文'
  return `H${level}`
})

// 标题选项
const headingOptions = [
  { level: 0, title: '正文', fontSize: '14px' },
  { level: 1, title: 'H1', fontSize: '20px' },
  { level: 2, title: 'H2', fontSize: '18px' },
  { level: 3, title: 'H3', fontSize: '16px' },
  { level: 4, title: 'H4', fontSize: '15px' },
  { level: 5, title: 'H5', fontSize: '14px' },
  { level: 6, title: 'H6', fontSize: '13px' }
]

// 切换下拉菜单
const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

// 关闭下拉菜单
const closeDropdown = () => {
  isOpen.value = false
}

// 执行标题操作
const executeAction = (level: number) => {
  if (!props.editor) return
  
  if (level === 0) {
    // 设置为正文
    props.editor.chain().focus().setParagraph().run()
  } else {
    // 设置为指定级别的标题
    props.editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 }).run()
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
.heading-dropdown {
  position: relative;
  display: inline-block;
}

.heading-dropdown-trigger {
  position: relative;
}

.heading-dropdown-trigger::after {
  content: '';
  position: absolute;
  right: 2px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 3px solid transparent;
  border-right: 3px solid transparent;
  border-top: 4px solid currentColor;
  opacity: 0.6;
}

.heading-dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  min-width: 100px;
  background: var(--gl-color-bg-popup, #ffffff);
  border: 1px solid var(--gl-color-border, #e5e6eb);
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 4px 0;
  margin-top: 4px;
}

.heading-dropdown-section {
  padding: 0;
}

.heading-dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px;
  cursor: pointer;
  font-size: 14px;
  color: var(--gl-color-text-1, #1d2129);
  transition: all 0.2s;
}

.heading-dropdown-item:hover {
  background-color: var(--gl-color-fill-2, #f7f8fa);
}

.heading-dropdown-item.active {
  background-color: var(--gl-color-primary-light-1, #e8f3ff);
  color: var(--gl-color-primary-6, #165dff);
}

.heading-dropdown-item span {
  flex: 1;
  white-space: nowrap;
}
</style>