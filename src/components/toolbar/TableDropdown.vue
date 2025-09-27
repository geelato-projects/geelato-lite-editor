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
      ref="menuRef"
      class="table-dropdown-menu"
      :style="{ top: menuPosition.top + 'px', left: menuPosition.left + 'px' }"
      @click.stop
      @mouseleave="handleMenuMouseLeave"
    >
      <div class="table-dropdown-section">
        <div 
          class="table-dropdown-item insert-table-item"
          @click="toggleTableSizeSelector"
          :class="{ 'active': showTableSizeSelector }"
          @mouseenter="handleInsertTableMouseEnter"
          @mouseleave="handleInsertTableMouseLeave"
        >
          <SvgIcon name="table" size="14" />
          <span>插入表格</span>
          <span class="arrow-text">▶</span>
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
    
    <!-- 表格选择器容器 - 独立定位 -->
    <div 
      v-if="showTableSizeSelector" 
      class="table-size-selector-container"
      @mouseenter="handleSelectorMouseEnter"
      @mouseleave="handleSelectorMouseLeave"
    >
      <div class="table-size-selector">
        <div class="grid-container">
          <div
            v-for="row in 8"
            :key="`row-${row}`"
            class="grid-row"
          >
            <div
              v-for="col in 10"
              :key="`cell-${row}-${col}`"
              class="grid-cell"
              :class="{ active: row <= selectedRows && col <= selectedCols }"
              @mouseenter="onCellHover(row, col)"
              @click="onCellClick(row, col)"
            />
          </div>
        </div>
        <div class="size-display">
          {{ selectedRows }} × {{ selectedCols }} 表格
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import ToolbarButton from '../ui/ToolbarButton.vue'
import SvgIcon from '../ui/SvgIcon.vue'

interface Props {
  editor: Editor | null
}

const props = defineProps<Props>()

const dropdownRef = ref<HTMLElement>()
const menuRef = ref<HTMLElement>()
const isOpen = ref(false)
const showTableSizeSelector = ref(false)
const menuPosition = ref({ top: 0, left: 0 })

// 表格尺寸选择器的响应式变量
const selectedRows = ref(3)
const selectedCols = ref(3)

const updateMenuPosition = async () => {
  if (!dropdownRef.value) return
  
  await nextTick()
  const rect = dropdownRef.value.getBoundingClientRect()
  menuPosition.value = {
    top: rect.bottom + 4,
    left: rect.left
  }
}

const updateSelectorPosition = async () => {
  await nextTick()
  const insertTableItem = document.querySelector('.insert-table-item') as HTMLElement
  if (!insertTableItem) return
  
  const rect = insertTableItem.getBoundingClientRect()
  const selector = document.querySelector('.table-size-selector-container') as HTMLElement
  if (selector) {
    // 确保选择器显示在插入表格项的右侧，并考虑视口边界
    const viewportWidth = window.innerWidth
    const selectorWidth = 220 // 预估选择器宽度
    
    let left = rect.right + 8
    // 如果右侧空间不够，显示在左侧
    if (left + selectorWidth > viewportWidth) {
      left = rect.left - selectorWidth - 8
    }
    
    selector.style.top = `${rect.top}px`
    selector.style.left = `${left}px`
    selector.style.zIndex = '1060' // 确保在菜单之上
  }
}

const toggleDropdown = async () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    await updateMenuPosition()
  }
}

const closeDropdown = () => {
  isOpen.value = false
  showTableSizeSelector.value = false
}

const toggleTableSizeSelector = () => {
  showTableSizeSelector.value = !showTableSizeSelector.value
}

const handleMouseLeave = () => {
  setTimeout(() => {
    if (!isHoveringSelector.value && !isHoveringInsertTable.value) {
      showTableSizeSelector.value = false
    }
  }, 200)
}

// 新增状态跟踪变量
const isHoveringSelector = ref(false)
const isHoveringInsertTable = ref(false)
let hideTimer: number | null = null

// 处理插入表格项的鼠标进入
const handleInsertTableMouseEnter = async () => {
  isHoveringInsertTable.value = true
  showTableSizeSelector.value = true
  await updateSelectorPosition()
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
}

// 处理插入表格项的鼠标离开
const handleInsertTableMouseLeave = () => {
  isHoveringInsertTable.value = false
  hideTimer = setTimeout(() => {
    if (!isHoveringSelector.value && !isHoveringInsertTable.value) {
      showTableSizeSelector.value = false
    }
  }, 100)
}

// 处理选择器的鼠标进入
const handleSelectorMouseEnter = () => {
  isHoveringSelector.value = true
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
}

// 处理选择器的鼠标离开
const handleSelectorMouseLeave = () => {
  isHoveringSelector.value = false
  hideTimer = setTimeout(() => {
    if (!isHoveringSelector.value && !isHoveringInsertTable.value) {
      showTableSizeSelector.value = false
    }
  }, 100)
}

// 处理整个菜单的鼠标离开
const handleMenuMouseLeave = () => {
  isHoveringInsertTable.value = false
  isHoveringSelector.value = false
  hideTimer = setTimeout(() => {
    showTableSizeSelector.value = false
  }, 100)
}

const onCellHover = (row: number, col: number) => {
  selectedRows.value = row
  selectedCols.value = col
}

const onCellClick = (row: number, col: number) => {
  handleTableSizeSelect(row, col)
}

const handleTableSizeSelect = (rows: number, cols: number) => {
  if (!props.editor) return
  
  console.log('插入表格:', rows, 'x', cols)
  props.editor.chain().focus().insertTable({ 
    rows, 
    cols, 
    withHeaderRow: false 
  }).run()
  
  closeDropdown()
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

const handleResize = () => {
  if (isOpen.value) {
    updateMenuPosition()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('resize', handleResize)
  window.addEventListener('scroll', handleResize)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('scroll', handleResize)
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
  position: fixed;
  z-index: var(--gl-z-index-dropdown, 1050);
  min-width: 140px;
  background: var(--gl-bg-color, #ffffff);
  border: 1px solid var(--gl-border-color, #e0e0e0);
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 4px 0;
}

.table-dropdown-section {
  padding: 0 12px;
  position: relative;
}

.table-dropdown-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 3px;
  cursor: pointer;
  border-radius: 3px;
  margin: 1px 0;
  transition: background-color 0.2s ease;
  font-size: 13px;
  color: var(--gl-text-color, #333333);
  position: relative;
}

.table-dropdown-item:hover,
.table-dropdown-item.active {
  background-color: var(--gl-hover-color, #f5f5f5);
}

.table-dropdown-item .gl-svg-icon {
  width: 14px;
  height: 14px;
  opacity: 0.7;
  flex-shrink: 0;
}

.table-dropdown-item .gl-svg-icon:first-child {
  margin-right: 6px;
}

.table-dropdown-item .arrow-text {
  margin-left: auto;
  font-size: 10px;
  color: var(--color-text-3);
}

.table-size-selector-container {
  position: fixed;
  top: auto;
  left: auto;
  padding: 12px;
  background: var(--gl-bg-color, #ffffff);
  border: 1px solid var(--gl-border-color, #e0e0e0);
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1060; /* 确保在菜单之上 */
  min-width: 200px;
  white-space: nowrap;
  pointer-events: auto; /* 确保可以接收鼠标事件 */
}

.table-size-selector {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.grid-container {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 8px;
}

.grid-row {
  display: flex;
  gap: 2px;
}

.grid-cell {
  width: 16px;
  height: 16px;
  border: 1px solid #d9d9d9;
  background: #f5f5f5;
  cursor: pointer;
  box-sizing: border-box;
  transition: all 0.1s ease;
}

.grid-cell:hover {
  border-color: var(--gl-primary-color, #1890ff);
  background: #e6f7ff;
}

.grid-cell.active {
  background: var(--gl-primary-color, #1890ff);
  border-color: var(--gl-primary-color, #1890ff);
}

.size-display {
  text-align: center;
  font-size: 12px;
  color: var(--color-text-2);
  padding: 4px 0;
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
  
  .table-dropdown-item:hover,
  .table-dropdown-item.active {
    background-color: var(--gl-hover-color, #404040);
  }
  
  .table-size-selector-container {
    border-color: var(--gl-border-color, #404040);
    background: var(--gl-bg-color, #2d2d2d);
  }
  
  .grid-cell {
    border-color: #404040;
    background: #2d2d2d;
  }
  
  .grid-cell:hover {
    background: #1a3a5c;
  }
  
  .table-dropdown-divider {
    background-color: var(--gl-border-color, #404040);
  }
}
</style>