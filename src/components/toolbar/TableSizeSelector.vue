<template>
  <div class="table-size-selector">
    <div class="grid-container">
      <div
        v-for="row in maxRows"
        :key="row"
        class="grid-row"
      >
        <div
          v-for="col in maxCols"
          :key="col"
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
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  select: [rows: number, cols: number]
}>()

const maxRows = 8
const maxCols = 10
const selectedRows = ref(3)
const selectedCols = ref(3)

const onCellHover = (row: number, col: number) => {
  selectedRows.value = row
  selectedCols.value = col
}

const onCellClick = (row: number, col: number) => {
  console.log(`点击单元格: 行${row}, 列${col}`)
  emit('select', row, col)
}
</script>

<style scoped>
.table-size-selector {
  padding: 8px;
  background: var(--color-bg-popup);
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
  border: 1px solid var(--color-border-2);
  background: var(--color-bg-1);
  cursor: pointer;
  transition: all 0.1s ease;
}

.grid-cell:hover {
  border-color: var(--color-primary);
}

.grid-cell.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.size-display {
  text-align: center;
  font-size: 12px;
  color: var(--color-text-2);
  padding: 4px 0;
}

/* 暗色主题支持 */
.gl-lite-editor.gl-theme-dark .grid-cell {
  border-color: var(--gl-color-border, #495057);
  background-color: var(--gl-color-bg-popup, #343a40);
}

.gl-lite-editor.gl-theme-dark .grid-cell:hover {
  border-color: var(--gl-color-primary, #66b3ff);
  background-color: var(--gl-color-primary, #66b3ff);
}

.gl-lite-editor.gl-theme-dark .grid-cell.active {
  background-color: var(--gl-color-primary, #66b3ff);
  border-color: var(--gl-color-primary, #66b3ff);
}

.gl-lite-editor.gl-theme-dark .size-display {
  color: var(--gl-color-text-1, #f8f9fa);
}

/* 支持 FloatingPanel 暗色主题类 */
:global(.floating-panel--dark) .grid-cell {
  border-color: var(--gl-color-border, #495057);
  background-color: var(--gl-color-bg-popup, #343a40);
}

:global(.floating-panel--dark) .grid-cell:hover {
  border-color: var(--gl-color-primary, #66b3ff);
  background-color: var(--gl-color-primary, #66b3ff);
}

:global(.floating-panel--dark) .grid-cell.active {
  background-color: var(--gl-color-primary, #66b3ff);
  border-color: var(--gl-color-primary, #66b3ff);
}

:global(.floating-panel--dark) .size-display {
  color: var(--gl-color-text-1, #f8f9fa);
}

@media (prefers-color-scheme: dark) {
  .grid-cell {
    border-color: var(--gl-border-color, #404040);
    background-color: var(--gl-bg-color, #2d2d2d);
  }
  
  .grid-cell:hover {
    background-color: var(--gl-color-primary, #66b3ff);
    border-color: var(--gl-color-primary, #66b3ff);
  }
  
  .grid-cell.active {
    background-color: var(--gl-color-primary, #66b3ff);
    border-color: var(--gl-color-primary, #66b3ff);
  }
  
  .size-display {
    color: var(--gl-text-color-secondary, #cccccc);
  }
}
</style>