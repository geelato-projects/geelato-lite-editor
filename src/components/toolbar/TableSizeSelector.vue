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
</style>