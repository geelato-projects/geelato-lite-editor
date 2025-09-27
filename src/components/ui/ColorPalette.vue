<template>
  <div class="color-palette">
    <!-- 无颜色选项 - 横线样式 -->
    <div class="color-palette__section color-palette__section--no-color">
      <button
        class="color-palette__no-color-btn"
        :class="{
          'color-palette__no-color-btn--active': selectedColor === null,
          'color-palette__no-color-btn--dark': isDark
        }"
        :title="clearButtonTitle || '无颜色'"
        @click="selectColor(null)"
      >
        无颜色
      </button>
    </div>

    <!-- 主题颜色 -->
    <div class="color-palette__section">
      <div class="color-palette__section-title">主题颜色</div>
      <div class="color-palette__theme-colors">
        <div 
          v-for="(row, rowIndex) in themeColors" 
          :key="rowIndex"
          class="color-palette__theme-row"
        >
          <button
            v-for="(color, colIndex) in row"
            :key="`${rowIndex}-${colIndex}`"
            class="color-palette__color"
            :class="{
              'color-palette__color--active': selectedColor === color,
              'color-palette__color--dark': isDark
            }"
            :style="{ backgroundColor: color }"
            :title="color"
            @click="selectColor(color)"
          />
        </div>
      </div>
    </div>

    <!-- 标准颜色 -->
    <div class="color-palette__section">
      <div class="color-palette__section-title">标准色</div>
      <div class="color-palette__colors">
        <button
          v-for="color in standardColors"
          :key="color.value"
          class="color-palette__color"
          :class="{
            'color-palette__color--active': selectedColor === color.value,
            'color-palette__color--dark': isDark
          }"
          :style="{ backgroundColor: color.value }"
          :title="color.name"
          @click="selectColor(color.value)"
        />
      </div>
    </div>

    <!-- 最近使用 -->
    <div class="color-palette__section" v-if="recentColors.length > 0">
      <div class="color-palette__section-title">最近使用</div>
      <div class="color-palette__colors">
        <button
          v-for="color in recentColors"
          :key="color"
          class="color-palette__color"
          :class="{
            'color-palette__color--active': selectedColor === color,
            'color-palette__color--dark': isDark
          }"
          :style="{ backgroundColor: color }"
          :title="color"
          @click="selectColor(color)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  title?: string
  selectedColor?: string | null
  isDark?: boolean
  clearButtonTitle?: string
  maxRecentColors?: number
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  selectedColor: null,
  isDark: false,
  clearButtonTitle: '无颜色',
  maxRecentColors: 8
})

const emit = defineEmits<{
  colorSelect: [color: string | null]
}>()

// 最近使用的颜色
const recentColors = ref<string[]>([])

// 标准颜色 - 完全参考截图配置
const standardColors = [
  { name: '深红', value: '#c00000' },
  { name: '红色', value: '#ff0000' },
  { name: '橙色', value: '#ffc000' },
  { name: '亮黄', value: '#ffff00' },
  { name: '浅绿', value: '#92d050' },
  { name: '绿色', value: '#00b050' },
  { name: '浅蓝', value: '#00b0f0' },
  { name: '蓝色', value: '#0070c0' },
  { name: '深蓝', value: '#002060' },
  { name: '紫色', value: '#7030a0' }
]

// 主题颜色 - 采用国际通用的Office风格颜色方案，6行10列的颜色矩阵
const themeColors = [
  // 第一行 - 主题色（基础色调）
  ['#ffffff', '#000000', '#e7e6e6', '#44546a', '#5b9bd5', '#70ad47', '#ffc000', '#ff0000', '#7030a0', '#00b0f0'],
  // 第二行 - 主题色浅色变体
  ['#f2f2f2', '#7f7f7f', '#d1cece', '#d6dce4', '#deeaf6', '#e2efda', '#fff2cc', '#ffcccc', '#e1d5f0', '#cce7f0'],
  // 第三行 - 主题色较浅变体
  ['#d9d9d9', '#595959', '#aeaaaa', '#adb9ca', '#bdd7ee', '#c5e0b4', '#ffe699', '#ff9999', '#c3aee6', '#99d9ea'],
  // 第四行 - 主题色中等变体
  ['#bfbfbf', '#404040', '#757070', '#8496b0', '#9cc3e5', '#a9d18e', '#ffd966', '#ff6666', '#a587dc', '#66cce5'],
  // 第五行 - 主题色较深变体
  ['#a6a6a6', '#262626', '#3a3838', '#323f4f', '#2f75b5', '#548235', '#cc9900', '#cc0000', '#5d1a78', '#0099cc'],
  // 第六行 - 主题色深色变体
  ['#808080', '#0d0d0d', '#252525', '#222a35', '#1f4e79', '#375623', '#996600', '#800000', '#4c1a57', '#006699']
]

const selectColor = (color: string | null) => {
  // 如果选择了颜色且不是null，添加到最近使用
  if (color && !recentColors.value.includes(color)) {
    recentColors.value.unshift(color)
    if (recentColors.value.length > props.maxRecentColors) {
      recentColors.value = recentColors.value.slice(0, props.maxRecentColors)
    }
  }
  
  emit('colorSelect', color)
}
</script>

<style scoped>
.color-palette {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 200px;
  padding: 4px;
}

.color-palette__title {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary, #1f2937);
  margin: 0;
  padding: 0 4px;
}

.color-palette__section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.color-palette__section-title {
  font-size: 12px;
  color: var(--color-text-secondary, #6b7280);
  margin: 0;
  padding: 0 4px;
}

.color-palette__colors {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

/* 主题颜色网格布局 */
.color-palette__theme-colors {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.color-palette__theme-row {
  display: flex;
  gap: 1px;
}

.color-palette__theme-row .color-palette__color {
  flex: 1;
  min-width: 16px;
}

.color-palette__color {
  width: 16px;
  height: 16px;
  min-width: 16px;
  min-height: 16px;
  padding: 0;
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 3px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  position: relative;
  box-sizing: border-box;
  background: transparent;
}

.color-palette__color:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.color-palette__color--active {
  box-shadow: 0 0 0 2px var(--gl-primary-color, #1890ff);
  transform: scale(1.05);
}

/* 无颜色横线按钮样式 */
.color-palette__section--no-color {
  margin-bottom: 8px;
}

.color-palette__no-color-btn {
  width: 100%;
  height: 24px;
  border: 1px solid var(--color-border, #d1d5db);
  border-radius: 4px;
  background: #fff;
  color: var(--color-text-secondary, #6b7280);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
}



.color-palette__no-color-btn:hover {
  border-color: var(--gl-primary-color, #1890ff);
  background: var(--color-bg-hover, #f3f4f6);
}

.color-palette__no-color-btn--active {
  border-color: var(--gl-primary-color, #1890ff);
  background: var(--color-bg-active, #e6f7ff);
  color: var(--gl-primary-color, #1890ff);
}

.color-palette__no-color-btn--dark {
  background: var(--color-bg-dark, #374151);
  border-color: var(--color-border-dark, #4b5563);
  color: var(--color-text-secondary-dark, #9ca3af);
}

.color-palette__no-color-btn--dark:hover {
  background: var(--color-bg-hover-dark, #4b5563);
  border-color: var(--gl-primary-color, #66b3ff);
}

.color-palette__no-color-btn--dark.color-palette__no-color-btn--active {
  background: var(--color-bg-active-dark, #1e3a8a);
  border-color: var(--gl-primary-color, #66b3ff);
  color: var(--gl-primary-color, #66b3ff);
}

.color-palette__color--clear {
  background: linear-gradient(
    45deg,
    transparent 40%,
    #ff4444 40%,
    #ff4444 60%,
    transparent 60%
  );
  color: #ff4444;
}

.color-palette__color--clear:hover {
  background: linear-gradient(
    45deg,
    transparent 40%,
    #ff6666 40%,
    #ff6666 60%,
    transparent 60%
  );
  color: #ff6666;
}

/* 暗色主题 */
.color-palette__color--dark {
  border-color: var(--color-border-dark, #4b5563);
}

.color-palette__color--dark:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.color-palette__color--dark.color-palette__color--active {
  box-shadow: 0 0 0 2px var(--gl-primary-color, #66b3ff);
}

/* 深色主题下的标题和文字 */
.gl-theme-dark .color-palette__title {
  color: var(--color-text-primary-dark, #f9fafb);
}

.gl-theme-dark .color-palette__section-title {
  color: var(--color-text-secondary-dark, #9ca3af);
}
</style>