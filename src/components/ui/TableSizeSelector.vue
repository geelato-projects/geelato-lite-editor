<template>
  <div class="table-size-selector">
    <div class="table-size-grid">
      <div
        v-for="row in maxRows"
        :key="row"
        class="table-size-row"
      >
        <div
          v-for="col in maxCols"
          :key="col"
          class="table-size-cell"
          :class="{
            'active': row <= selectedRows && col <= selectedCols,
            'hover': row <= hoverRows && col <= hoverCols
          }"
          @mouseenter="handleCellHover(row, col)"
          @click="handleCellClick(row, col)"
        />
      </div>
    </div>
    <div class="table-size-info">
      {{ hoverRows || selectedRows }} × {{ hoverCols || selectedCols }} 表格
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  maxRows?: number
  maxCols?: number
  defaultRows?: number
  defaultCols?: number
}

interface Emits {
  (e: 'select', rows: number, cols: number): void
}

const props = withDefaults(defineProps<Props>(), {
  maxRows: 8,
  maxCols: 10,
  defaultRows: 3,
  defaultCols: 3
})

const emit = defineEmits<Emits>()

const selectedRows = ref(props.defaultRows)
const selectedCols = ref(props.defaultCols)
const hoverRows = ref(0)
const hoverCols = ref(0)

const handleCellHover = (row: number, col: number) => {
  hoverRows.value = row
  hoverCols.value = col
}

const handleCellClick = (row: number, col: number) => {
  selectedRows.value = row
  selectedCols.value = col
  emit('select', row, col)
}
</script>

<style scoped>
.table-size-selector {
  padding: 12px;
  user-select: none;
}

.table-size-grid {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 8px;
}

.table-size-row {
  display: flex;
  gap: 2px;
}

.table-size-cell {
  width: 16px;
  height: 16px;
  border: 1px solid var(--gl-border-color, #e0e0e0);
  background-color: var(--gl-bg-color, #ffffff);
  cursor: pointer;
  transition: all 0.15s ease;
}

.table-size-cell:hover {
  border-color: var(--gl-primary-color, #1890ff);
}

.table-size-cell.hover {
  background-color: var(--gl-primary-color-light, #e6f7ff);
  border-color: var(--gl-primary-color, #1890ff);
}

.table-size-cell.active {
  background-color: var(--gl-primary-color, #1890ff);
  border-color: var(--gl-primary-color, #1890ff);
}

.table-size-info {
  text-align: center;
  font-size: 12px;
  color: var(--gl-text-color-secondary, #666666);
  font-weight: 500;
}

/* 暗色主题支持 */
@media (prefers-color-scheme: dark) {
  .table-size-cell {
    border-color: var(--gl-border-color, #404040);
    background-color: var(--gl-bg-color, #2d2d2d);
  }
  
  .table-size-cell.hover {
    background-color: var(--gl-primary-color-light, #1a3a5c);
  }
  
  .table-size-info {
    color: var(--gl-text-color-secondary, #cccccc);
  }
}
</style>