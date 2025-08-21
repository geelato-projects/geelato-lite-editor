<template>
  <div class="list-dropdown" ref="dropdownRef">
    <ToolbarButton
      :icon="'list-unordered'"
      :title="'列表操作'"
      :active="isAnyListActive"
      :disabled="false"
      @click="toggleDropdown"
      class="list-dropdown-trigger"
    />
    <div 
      v-if="isOpen" 
      class="list-dropdown-menu"
      @click.stop
    >
      <div class="list-dropdown-section">
        <div 
          class="list-dropdown-item"
          :class="{ active: isActive('bulletList') }"
          @click="executeAction('bulletList')"
        >
          <SvgIcon name="list-unordered" size="14" />
          <span>无序列表</span>
        </div>
        <div 
          class="list-dropdown-item"
          :class="{ active: isActive('orderedList') }"
          @click="executeAction('orderedList')"
        >
          <SvgIcon name="list-ordered" size="14" />
          <span>有序列表</span>
        </div>
        <div 
          class="list-dropdown-item"
          :class="{ active: isActive('taskList') }"
          @click="executeAction('taskList')"
        >
          <SvgIcon name="task-list" size="14" />
          <span>任务列表</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import ToolbarButton from '../ui/ToolbarButton.vue'
import SvgIcon from '../ui/SvgIcon.vue'

interface Props {
  editor: Editor | null
}

const props = defineProps<Props>()

const dropdownRef = ref<HTMLElement>()
const isOpen = ref(false)

// 检查是否有任何列表处于激活状态
const isAnyListActive = computed(() => {
  if (!props.editor) return false
  return props.editor.isActive('bulletList') || 
         props.editor.isActive('orderedList') || 
         props.editor.isActive('taskList')
})

// 检查特定列表类型是否激活
const isActive = (listType: string) => {
  if (!props.editor) return false
  return props.editor.isActive(listType)
}

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const closeDropdown = () => {
  isOpen.value = false
}

const executeAction = (action: string) => {
  if (!props.editor) return
  
  switch (action) {
    case 'bulletList':
      props.editor.chain().focus().toggleBulletList().run()
      break
    case 'orderedList':
      props.editor.chain().focus().toggleOrderedList().run()
      break
    case 'taskList':
      props.editor.chain().focus().toggleTaskList().run()
      break
  }
  
  closeDropdown()
}

const handleClickOutside = (event: Event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.list-dropdown {
  position: relative;
  display: inline-block;
}

.list-dropdown-trigger {
  position: relative;
}

.list-dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: var(--gl-z-index-dropdown, 1050);
  min-width: 120px;
  background: var(--gl-bg-color, #ffffff);
  border: 1px solid var(--gl-border-color, #e0e0e0);
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 4px 0;
  margin-top: 4px;
}

.list-dropdown-section {
  padding: 0 12px;
}

.list-dropdown-item {
  display: flex;
  align-items: center;
  padding: 3px;
  cursor: pointer;
  border-radius: 3px;
  margin: 1px 0;
  transition: background-color 0.2s ease;
  font-size: 13px;
  color: var(--gl-text-color, #333333);
}

.list-dropdown-item:hover {
  background-color: var(--gl-hover-color, #f5f5f5);
}

.list-dropdown-item.active {
  background-color: var(--gl-primary-color, #1890ff);
  color: #ffffff;
}

.list-dropdown-item.active:hover {
  background-color: var(--gl-primary-hover-color, #40a9ff);
}

.list-dropdown-item .gl-svg-icon {
  width: 14px;
  height: 14px;
  margin-right: 6px;
  opacity: 0.7;
  flex-shrink: 0;
}

.list-dropdown-item.active .gl-svg-icon {
  opacity: 1;
}

/* 暗色主题支持 */
@media (prefers-color-scheme: dark) {
  .list-dropdown-menu {
    background: var(--gl-bg-color, #2d2d2d);
    border-color: var(--gl-border-color, #404040);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
  
  .list-dropdown-item {
    color: var(--gl-text-color, #ffffff);
  }
  
  .list-dropdown-item:hover {
    background-color: var(--gl-hover-color, #404040);
  }
}
</style>