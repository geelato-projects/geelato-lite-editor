<template>
  <div class="table-dropdown" ref="dropdownRef">
    <ToolbarButton
      :icon="'table'"
      :title="'表格操作'"
      :active="false"
      :disabled="false"
      @click="toggleDropdown"
      class="table-dropdown-trigger"
    />
    <div 
      v-if="isOpen" 
      class="table-dropdown-menu"
      @click.stop
    >
      <div class="table-dropdown-section">
        <div 
          class="table-dropdown-item"
          @click="executeAction('insertTable')"
        >
          <SvgIcon name="table" size="14" />
          <span>插入表格</span>
        </div>
      </div>
      
      <div class="table-dropdown-divider"></div>
      
      <div class="table-dropdown-section">
        <div 
          class="table-dropdown-item"
          @click="executeAction('addRowBefore')"
        >
          <SvgIcon name="row-add-before" size="14" />
          <span>在上面插入行</span>
        </div>
        <div 
          class="table-dropdown-item"
          @click="executeAction('addRowAfter')"
        >
          <SvgIcon name="row-add-after" size="14" />
          <span>在下面插入行</span>
        </div>
        <div 
          class="table-dropdown-item"
          @click="executeAction('deleteRow')"
        >
          <SvgIcon name="row-delete" size="14" />
          <span>删除行</span>
        </div>
      </div>
      
      <div class="table-dropdown-divider"></div>
      
      <div class="table-dropdown-section">
        <div 
          class="table-dropdown-item"
          @click="executeAction('addColumnBefore')"
        >
          <SvgIcon name="column-add-before" size="14" />
          <span>在左边插入列</span>
        </div>
        <div 
          class="table-dropdown-item"
          @click="executeAction('addColumnAfter')"
        >
          <SvgIcon name="column-add-after" size="14" />
          <span>在右边插入列</span>
        </div>
        <div 
          class="table-dropdown-item"
          @click="executeAction('deleteColumn')"
        >
          <SvgIcon name="column-delete" size="14" />
          <span>删除列</span>
        </div>
      </div>
      
      <div class="table-dropdown-divider"></div>
      
      <div class="table-dropdown-section">
        <div 
          class="table-dropdown-item"
          @click="executeAction('deleteTable')"
        >
          <SvgIcon name="table-delete" size="14" />
          <span>删除表格</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import ToolbarButton from '../ui/ToolbarButton.vue'
import SvgIcon from '../ui/SvgIcon.vue'

interface Props {
  editor: Editor | null
}

const props = defineProps<Props>()

const dropdownRef = ref<HTMLElement>()
const isOpen = ref(false)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const closeDropdown = () => {
  isOpen.value = false
}

const executeAction = (action: string) => {
  if (!props.editor) return
  
  switch (action) {
    case 'insertTable':
      props.editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
      break
    case 'addRowBefore':
      props.editor.chain().focus().addRowBefore().run()
      break
    case 'addRowAfter':
      props.editor.chain().focus().addRowAfter().run()
      break
    case 'deleteRow':
      props.editor.chain().focus().deleteRow().run()
      break
    case 'addColumnBefore':
      props.editor.chain().focus().addColumnBefore().run()
      break
    case 'addColumnAfter':
      props.editor.chain().focus().addColumnAfter().run()
      break
    case 'deleteColumn':
      props.editor.chain().focus().deleteColumn().run()
      break
    case 'deleteTable':
      props.editor.chain().focus().deleteTable().run()
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
.table-dropdown {
  position: relative;
  display: inline-block;
}

.table-dropdown-trigger {
  position: relative;
}

.table-dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  min-width: 140px;
  background: var(--gl-bg-color, #ffffff);
  border: 1px solid var(--gl-border-color, #e0e0e0);
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 4px 0;
  margin-top: 4px;
}

.table-dropdown-section {
  padding: 0 12px;
}

.table-dropdown-item {
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

.table-dropdown-item:hover {
  background-color: var(--gl-hover-color, #f5f5f5);
}

.table-dropdown-item .gl-svg-icon {
  width: 14px;
  height: 14px;
  margin-right: 6px;
  opacity: 0.7;
  flex-shrink: 0;
}

.table-dropdown-divider {
  height: 1px;
  background-color: var(--gl-border-color, #e0e0e0);
  margin: 4px 0;
}

/* 暗色主题支持 */
@media (prefers-color-scheme: dark) {
  .table-dropdown-menu {
    background: var(--gl-bg-color, #2d2d2d);
    border-color: var(--gl-border-color, #404040);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
  
  .table-dropdown-item {
    color: var(--gl-text-color, #ffffff);
  }
  
  .table-dropdown-item:hover {
    background-color: var(--gl-hover-color, #404040);
  }
  
  .table-dropdown-divider {
    background-color: var(--gl-border-color, #404040);
  }
}
</style>