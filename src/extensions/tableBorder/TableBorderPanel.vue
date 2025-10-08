<template>
  <div class="table-border-panel">
    <div class="border-section">
      <div class="section-title">边框样式</div>
      <div class="border-style-grid">
        <div
          v-for="style in borderStyles"
          :key="style.value"
          class="border-style-item"
          :class="{ active: currentBorderStyle === style.value }"
          @click="setBorderStyle(style.value)"
          :title="style.label"
        >
          <div class="border-preview" :style="{ borderTop: `2px ${style.value} #333` }"></div>
        </div>
      </div>
    </div>

    <div class="border-section">
      <div class="section-title">边框宽度</div>
      <div class="border-width-options">
        <div
          v-for="width in borderWidths"
          :key="width.value"
          class="border-width-item"
          :class="{ active: currentBorderWidth === width.value }"
          @click="setBorderWidth(width.value)"
          :title="width.label"
        >
          <div class="width-preview" :style="{ borderTop: `${width.value} solid #333` }"></div>
        </div>
      </div>
    </div>

    <div class="border-section">
      <div class="section-title">边框位置</div>
      <div class="border-position-grid">
        <div
          v-for="position in borderPositions"
          :key="position.value"
          class="border-position-item"
          :class="{ active: currentBorderPosition === position.value }"
          @click="setBorderPosition(position.value)"
          :title="position.label"
        >
          <SvgIcon :name="position.icon" size="16" />
        </div>
      </div>
    </div>

    <div class="border-section">
      <div class="color-section-header">
        <div class="section-title">边框颜色</div>
        <div class="more-colors-container">
          <span class="more-colors-label">更多颜色</span>
          <input
            type="color"
            v-model="currentBorderColor"
            @change="(event) => setBorderColor((event.target as HTMLInputElement).value)"
            class="color-picker"
          />
        </div>
      </div>
      <div class="color-presets">
        <div
          v-for="color in colorPresets"
          :key="color"
          class="color-preset"
          :style="{ backgroundColor: color }"
          @click="setBorderColor(color)"
          :class="{ active: currentBorderColor === color }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import SvgIcon from '../../components/ui/SvgIcon.vue'

interface Props {
  editor: Editor | null
}

const props = defineProps<Props>()

// 边框位置选项
const borderPositions = [
  { value: 'none', label: '无边框', icon: 'border-none' as const },
  { value: 'all', label: '所有边框', icon: 'border-all' as const },
  { value: 'outside', label: '外部边框', icon: 'border-outside' as const },
  { value: 'top', label: '上边框', icon: 'border-top' as const },
  { value: 'bottom', label: '下边框', icon: 'border-bottom' as const },
  { value: 'left', label: '左边框', icon: 'border-left' as const },
  { value: 'right', label: '右边框', icon: 'border-right' as const },
]

// 边框样式选项
const borderStyles = [
  { value: 'none', label: '无' },
  { value: 'solid', label: '实线' },
  { value: 'dashed', label: '虚线' },
  { value: 'dotted', label: '点线' },
  { value: 'double', label: '双线' },
]

// 边框宽度选项
const borderWidths = [
  { value: '1px', label: '细' },
  { value: '2px', label: '中' },
  { value: '3px', label: '粗' },
  { value: '4px', label: '很粗' },
]

// 颜色预设
const colorPresets = [
  '#000000', '#333333', '#666666', '#999999', '#cccccc',
  '#ff0000', '#ff6600', '#ffcc00', '#00ff00', '#0066ff',
  '#6600ff', '#ff0066', '#00ffff', '#ff00ff', '#ffffff',
  '#800000', '#008000', '#000080', '#800080', '#008080'
]

// 当前边框设置
const currentBorderStyle = ref('solid')
const currentBorderColor = ref('#000000')
const currentBorderWidth = ref('1px')
const currentBorderPosition = ref('all')

// 获取当前单元格的边框属性
const getCurrentCellBorder = () => {
  if (!props.editor) return

  const attributes = props.editor.getAttributes('tableCell')
  if (attributes.borderStyle) currentBorderStyle.value = attributes.borderStyle
  if (attributes.borderColor) currentBorderColor.value = attributes.borderColor
  if (attributes.borderWidth) currentBorderWidth.value = attributes.borderWidth
}

// 设置边框样式
const setBorderStyle = (style: string) => {
  if (!props.editor) return
  
  currentBorderStyle.value = style
  if (style === 'none') {
    props.editor.chain().focus().setCellAttribute('border', 'none').run()
  } else {
    // 立即应用边框样式，结合当前的颜色和宽度
    const border = `${currentBorderWidth.value} ${style} ${currentBorderColor.value}`
    props.editor.chain().focus().setCellAttribute('border', border).run()
  }
}

// 设置边框颜色
const setBorderColor = (color?: string) => {
  if (!props.editor) return
  
  const targetColor = color || currentBorderColor.value
  currentBorderColor.value = targetColor
  
  // 立即应用边框颜色，结合当前的样式和宽度
  const border = `${currentBorderWidth.value} ${currentBorderStyle.value} ${targetColor}`
  props.editor.chain().focus().setCellAttribute('border', border).run()
}

// 设置边框宽度
const setBorderWidth = (width: string) => {
  if (!props.editor) return
  
  currentBorderWidth.value = width
  // 立即应用边框宽度，结合当前的样式和颜色
  const border = `${width} ${currentBorderStyle.value} ${currentBorderColor.value}`
  props.editor.chain().focus().setCellAttribute('border', border).run()
}

// 设置边框位置
const setBorderPosition = (position: string) => {
  if (!props.editor) return
  
  currentBorderPosition.value = position
  
  // 根据位置设置不同的边框
  const borderValue = position === 'none' ? 'none' : `${currentBorderWidth.value} ${currentBorderStyle.value} ${currentBorderColor.value}`
  
  switch (position) {
    case 'none':
      // 移除所有边框
      props.editor.chain().focus()
        .setCellAttribute('borderTop', 'none')
        .setCellAttribute('borderBottom', 'none')
        .setCellAttribute('borderLeft', 'none')
        .setCellAttribute('borderRight', 'none')
        .run()
      break
    case 'all':
      // 设置所有边框
      props.editor.chain().focus()
        .setCellAttribute('borderTop', borderValue)
        .setCellAttribute('borderBottom', borderValue)
        .setCellAttribute('borderLeft', borderValue)
        .setCellAttribute('borderRight', borderValue)
        .run()
      break
    case 'outside':
      // 设置外边框（需要根据单元格在表格中的位置来判断）
      // 这里先简单实现为所有边框
      props.editor.chain().focus()
        .setCellAttribute('borderTop', borderValue)
        .setCellAttribute('borderBottom', borderValue)
        .setCellAttribute('borderLeft', borderValue)
        .setCellAttribute('borderRight', borderValue)
        .run()
      break
    case 'top':
      // 只设置上边框
      props.editor.chain().focus()
        .setCellAttribute('borderTop', borderValue)
        .setCellAttribute('borderBottom', 'none')
        .setCellAttribute('borderLeft', 'none')
        .setCellAttribute('borderRight', 'none')
        .run()
      break
    case 'bottom':
      // 只设置下边框
      props.editor.chain().focus()
        .setCellAttribute('borderTop', 'none')
        .setCellAttribute('borderBottom', borderValue)
        .setCellAttribute('borderLeft', 'none')
        .setCellAttribute('borderRight', 'none')
        .run()
      break
    case 'left':
      // 只设置左边框
      props.editor.chain().focus()
        .setCellAttribute('borderTop', 'none')
        .setCellAttribute('borderBottom', 'none')
        .setCellAttribute('borderLeft', borderValue)
        .setCellAttribute('borderRight', 'none')
        .run()
      break
    case 'right':
      // 只设置右边框
      props.editor.chain().focus()
        .setCellAttribute('borderTop', 'none')
        .setCellAttribute('borderBottom', 'none')
        .setCellAttribute('borderLeft', 'none')
        .setCellAttribute('borderRight', borderValue)
        .run()
      break
  }
}

// 移除所有边框
const removeAllBorders = () => {
  if (!props.editor) return
  props.editor.chain().focus().setCellAttribute('border', 'none').run()
}

// 设置全边框
const setAllBorders = () => {
  if (!props.editor) return
  const border = `${currentBorderWidth.value} ${currentBorderStyle.value} ${currentBorderColor.value}`
  props.editor.chain().focus().setCellAttribute('border', border).run()
}

// 设置外边框
const setOuterBorder = () => {
  if (!props.editor) return
  // 这里可以根据需要实现更复杂的外边框逻辑
  const border = `${currentBorderWidth.value} ${currentBorderStyle.value} ${currentBorderColor.value}`
  props.editor.chain().focus().setCellAttribute('border', border).run()
}

// 监听编辑器变化，更新当前边框设置
watch(() => props.editor?.state.selection, () => {
  getCurrentCellBorder()
}, { immediate: true })
</script>

<style scoped>
.table-border-panel {
  padding: 6px;
  width: 220px;
  background: var(--gl-bg-color, #ffffff);
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.border-section {
  margin-bottom: 8px;
}

.border-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 12px;
  font-weight: 500;
  color: var(--gl-text-color, #333333);
  margin-bottom: 4px;
  text-align: left;
}

.color-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.more-colors-container {
  display: flex;
  align-items: center;
  gap: 4px;
}

.more-colors-label {
  font-size: 11px;
  color: var(--gl-text-color-secondary, #666666);
  white-space: nowrap;
}

.border-position-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.border-position-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6px 4px;
  border: 1px solid var(--gl-border-color, #e0e0e0);
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.15s ease;
  min-height: 32px;
}

.border-position-item:hover {
  border-color: var(--gl-primary-color, #1890ff);
  background-color: var(--gl-primary-color-light, #f0f8ff);
}

.border-position-item.active {
  border-color: var(--gl-primary-color, #1890ff);
  background-color: var(--gl-primary-color-light, #e6f7ff);
}

.border-style-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 3px;
}

.border-style-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4px 2px;
  border: 1px solid var(--gl-border-color, #e0e0e0);
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.border-style-item:hover {
  border-color: var(--gl-primary-color, #1890ff);
  background-color: var(--gl-primary-color-light, #f0f8ff);
}

.border-style-item.active {
  border-color: var(--gl-primary-color, #1890ff);
  background-color: var(--gl-primary-color-light, #e6f7ff);
}

.border-preview {
  width: 20px;
  height: 2px;
  margin-bottom: 0;
}

.style-label {
  font-size: 11px;
  color: var(--gl-text-color-secondary, #666666);
}

.color-picker-container {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.color-picker {
  width: 28px;
  height: 20px;
  border: 1px solid var(--gl-border-color, #e0e0e0);
  border-radius: 3px;
  cursor: pointer;
}

.color-presets {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 2px;
}

.color-preset {
  width: 16px;
  height: 16px;
  border: 1px solid var(--gl-border-color, #e0e0e0);
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.color-preset:hover {
  transform: scale(1.1);
}

.color-preset.active {
  border-color: var(--gl-primary-color, #1890ff);
  border-width: 2px;
}

.border-width-options {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 3px;
}

.border-width-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4px 2px;
  border: 1px solid var(--gl-border-color, #e0e0e0);
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.border-width-item:hover {
  border-color: var(--gl-primary-color, #1890ff);
  background-color: var(--gl-primary-color-light, #f0f8ff);
}

.border-width-item.active {
  border-color: var(--gl-primary-color, #1890ff);
  background-color: var(--gl-primary-color-light, #e6f7ff);
}

.width-preview {
  width: 20px;
  height: 2px;
  margin-bottom: 0;
}

.width-label {
  font-size: 11px;
  color: var(--gl-text-color-secondary, #666666);
}

.gl-lite-editor.gl-theme-dark .table-border-panel {
  background: var(--gl-color-bg-popup, #343a40);
  border-color: var(--gl-color-border, #495057);
}

.gl-lite-editor.gl-theme-dark .section-title {
  color: var(--gl-color-text-1, #f8f9fa);
}

.gl-lite-editor.gl-theme-dark .more-colors-label {
  color: var(--gl-color-text-2, #e9ecef);
}

.gl-lite-editor.gl-theme-dark .border-style-item,
.gl-lite-editor.gl-theme-dark .border-width-item,
.gl-lite-editor.gl-theme-dark .border-position-item {
  background: var(--gl-color-bg-popup, #343a40);
  border-color: var(--gl-color-border, #495057);
  color: var(--gl-color-text-1, #f8f9fa);
}

.gl-lite-editor.gl-theme-dark .border-style-item:hover,
.gl-lite-editor.gl-theme-dark .border-width-item:hover,
.gl-lite-editor.gl-theme-dark .border-position-item:hover {
  background: var(--gl-color-fill-2, #495057);
}

.gl-lite-editor.gl-theme-dark .border-style-item.active,
.gl-lite-editor.gl-theme-dark .border-width-item.active,
.gl-lite-editor.gl-theme-dark .border-position-item.active {
  background: var(--gl-color-fill-3, #6c757d);
  border-color: var(--gl-color-border, #495057);
}

.gl-lite-editor.gl-theme-dark .color-preset {
  border-color: var(--gl-color-border, #495057);
}

/* 支持 FloatingPanel 暗色主题类 */
:global(.floating-panel--dark) .table-border-panel {
  background: var(--gl-color-bg-popup, #343a40);
  border-color: var(--gl-color-border, #495057);
}

:global(.floating-panel--dark) .section-title {
  color: var(--gl-color-text-1, #f8f9fa);
}

:global(.floating-panel--dark) .more-colors-label {
  color: var(--gl-color-text-2, #e9ecef);
}

:global(.floating-panel--dark) .border-style-item,
:global(.floating-panel--dark) .border-width-item,
:global(.floating-panel--dark) .border-position-item {
  background: var(--gl-color-bg-popup, #343a40);
  border-color: var(--gl-color-border, #495057);
  color: var(--gl-color-text-1, #f8f9fa);
}

:global(.floating-panel--dark) .border-style-item:hover,
:global(.floating-panel--dark) .border-width-item:hover,
:global(.floating-panel--dark) .border-position-item:hover {
  background: var(--gl-color-fill-2, #495057);
}

:global(.floating-panel--dark) .border-style-item.active,
:global(.floating-panel--dark) .border-width-item.active,
:global(.floating-panel--dark) .border-position-item.active {
  background: var(--gl-color-fill-3, #6c757d);
  border-color: var(--gl-color-border, #495057);
}

:global(.floating-panel--dark) .color-preset {
  border-color: var(--gl-color-border, #495057);
}

/* 修复图标在暗色模式下的显示问题 */
.gl-lite-editor.gl-theme-dark .border-position-item .gl-svg-icon,
:global(.floating-panel--dark) .border-position-item .gl-svg-icon {
  color: var(--gl-color-text-1, #f8f9fa) !important;
  fill: var(--gl-color-text-1, #f8f9fa) !important;
  stroke: var(--gl-color-text-1, #f8f9fa) !important;
}
</style>