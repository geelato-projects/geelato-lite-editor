<template>
  <div class="enhanced-color-picker">
    <div class="enhanced-color-picker__title" v-if="title">
      {{ title }}
    </div>
    
    <!-- 无颜色选项 -->
    <div class="enhanced-color-picker__section">
      <div class="enhanced-color-picker__section-title">无颜色</div>
      <div class="enhanced-color-picker__colors">
        <button
          class="enhanced-color-picker__color enhanced-color-picker__no-color"
          :class="{
            'enhanced-color-picker__color--active': selectedColor === null,
            'enhanced-color-picker__color--dark': isDark
          }"
          :title="clearButtonTitle"
          @click="selectColor(null)"
        >
          <svg width="16" height="16" viewBox="0 0 1024 1024" fill="currentColor">
            <path d="M872.615385 151.384615c-198.892308-198.892308-522.584615-198.892308-721.476923 0-198.892308 198.892308-198.892308 522.584615 0 721.476923 99.446154 99.446154 230.153846 149.169231 360.615384 149.169231S772.923077 972.307692 872.369231 872.861538c199.384615-199.138462 199.384615-522.584615 0-721.476923z"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 标准颜色 -->
    <div class="enhanced-color-picker__section">
      <div class="enhanced-color-picker__section-title">标准色</div>
      <div class="enhanced-color-picker__colors">
        <button
          v-for="color in standardColors"
          :key="color.value"
          class="enhanced-color-picker__color"
          :class="{
            'enhanced-color-picker__color--active': selectedColor === color.value,
            'enhanced-color-picker__color--dark': isDark
          }"
          :style="{ backgroundColor: color.value }"
          :title="color.name"
          @click="selectColor(color.value)"
        />
      </div>
    </div>

    <!-- 主题颜色 -->
    <div class="enhanced-color-picker__section">
      <div class="enhanced-color-picker__colors enhanced-color-picker__colors--grid">
        <button
          v-for="color in themeColors"
          :key="color.value"
          class="enhanced-color-picker__color"
          :class="{
            'enhanced-color-picker__color--active': selectedColor === color.value,
            'enhanced-color-picker__color--dark': isDark
          }"
          :style="{ backgroundColor: color.value }"
          :title="color.name"
          @click="selectColor(color.value)"
        />
      </div>
    </div>

    <!-- 最近使用 -->
    <div class="enhanced-color-picker__section" v-if="recentColors.length > 0">
      <div class="enhanced-color-picker__section-title">最近使用</div>
      <div class="enhanced-color-picker__colors">
        <button
          v-for="color in recentColors"
          :key="color"
          class="enhanced-color-picker__color"
          :class="{
            'enhanced-color-picker__color--active': selectedColor === color,
            'enhanced-color-picker__color--dark': isDark
          }"
          :style="{ backgroundColor: color }"
          :title="color"
          @click="selectColor(color)"
        />
      </div>
    </div>

    <!-- 更多颜色按钮 -->
    <div class="enhanced-color-picker__more">
      <button
        class="enhanced-color-picker__more-button"
        :class="{ 'enhanced-color-picker__more-button--dark': isDark }"
        @click="$emit('moreColors')"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
          <path d="M12 6v6l4 2"/>
        </svg>
        更多颜色
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface ColorOption {
  name: string
  value: string
}

interface Props {
  title?: string
  selectedColor?: string | null
  isDark?: boolean
  clearButtonTitle?: string
  recentColors?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  selectedColor: null,
  isDark: false,
  clearButtonTitle: '无颜色',
  recentColors: () => []
})

const emit = defineEmits<{
  colorSelect: [color: string | null]
  moreColors: []
}>()

// 标准颜色
const standardColors: ColorOption[] = [
  { name: '黑色', value: '#000000' },
  { name: '深灰', value: '#666666' },
  { name: '蓝色', value: '#1890ff' },
  { name: '青色', value: '#13c2c2' },
  { name: '绿色', value: '#52c41a' },
  { name: '红色', value: '#ff4d4f' },
  { name: '橙色', value: '#fa8c16' },
  { name: '黄色', value: '#fadb14' },
  { name: '紫色', value: '#722ed1' },
  { name: '品红', value: '#eb2f96' }
]

// 主题颜色（包含不同深浅度）
const themeColors: ColorOption[] = [
  // 灰色系
  { name: '浅灰1', value: '#f5f5f5' },
  { name: '浅灰2', value: '#d9d9d9' },
  { name: '浅灰3', value: '#bfbfbf' },
  { name: '浅灰4', value: '#8c8c8c' },
  { name: '浅灰5', value: '#595959' },
  { name: '浅灰6', value: '#262626' },
  
  // 蓝色系
  { name: '蓝色1', value: '#e6f7ff' },
  { name: '蓝色2', value: '#bae7ff' },
  { name: '蓝色3', value: '#91d5ff' },
  { name: '蓝色4', value: '#69c0ff' },
  { name: '蓝色5', value: '#40a9ff' },
  { name: '蓝色6', value: '#1890ff' },
  { name: '蓝色7', value: '#096dd9' },
  { name: '蓝色8', value: '#0050b3' },
  { name: '蓝色9', value: '#003a8c' },
  { name: '蓝色10', value: '#002766' },

  // 绿色系
  { name: '绿色1', value: '#f6ffed' },
  { name: '绿色2', value: '#d9f7be' },
  { name: '绿色3', value: '#b7eb8f' },
  { name: '绿色4', value: '#95de64' },
  { name: '绿色5', value: '#73d13d' },
  { name: '绿色6', value: '#52c41a' },
  { name: '绿色7', value: '#389e0d' },
  { name: '绿色8', value: '#237804' },
  { name: '绿色9', value: '#135200' },
  { name: '绿色10', value: '#092b00' },

  // 红色系
  { name: '红色1', value: '#fff2f0' },
  { name: '红色2', value: '#ffccc7' },
  { name: '红色3', value: '#ffa39e' },
  { name: '红色4', value: '#ff7875' },
  { name: '红色5', value: '#ff4d4f' },
  { name: '红色6', value: '#f5222d' },
  { name: '红色7', value: '#cf1322' },
  { name: '红色8', value: '#a8071a' },
  { name: '红色9', value: '#820014' },
  { name: '红色10', value: '#5c0011' },

  // 橙色系
  { name: '橙色1', value: '#fff7e6' },
  { name: '橙色2', value: '#ffe7ba' },
  { name: '橙色3', value: '#ffd591' },
  { name: '橙色4', value: '#ffc069' },
  { name: '橙色5', value: '#ffa940' },
  { name: '橙色6', value: '#fa8c16' },
  { name: '橙色7', value: '#d46b08' },
  { name: '橙色8', value: '#ad4e00' },
  { name: '橙色9', value: '#873800' },
  { name: '橙色10', value: '#612500' },

  // 黄色系
  { name: '黄色1', value: '#feffe6' },
  { name: '黄色2', value: '#ffffb8' },
  { name: '黄色3', value: '#fffb8f' },
  { name: '黄色4', value: '#fff566' },
  { name: '黄色5', value: '#ffec3d' },
  { name: '黄色6', value: '#fadb14' },
  { name: '黄色7', value: '#d4b106' },
  { name: '黄色8', value: '#ad8b00' },
  { name: '黄色9', value: '#876800' },
  { name: '黄色10', value: '#614700' },

  // 紫色系
  { name: '紫色1', value: '#f9f0ff' },
  { name: '紫色2', value: '#efdbff' },
  { name: '紫色3', value: '#d3adf7' },
  { name: '紫色4', value: '#b37feb' },
  { name: '紫色5', value: '#9254de' },
  { name: '紫色6', value: '#722ed1' },
  { name: '紫色7', value: '#531dab' },
  { name: '紫色8', value: '#391085' },
  { name: '紫色9', value: '#22075e' },
  { name: '紫色10', value: '#120338' }
]

const selectColor = (color: string | null) => {
  emit('colorSelect', color)
}
</script>

<style scoped>
.enhanced-color-picker {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 4px;
  min-width: 240px;
}

.enhanced-color-picker__title {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-secondary, #9ca3af);
  margin: 0;
  padding: 0 4px;
}

.enhanced-color-picker__section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.enhanced-color-picker__section-title {
  font-size: 11px;
  color: var(--color-text-tertiary, #6b7280);
  margin: 0;
  padding: 0 4px;
}

.enhanced-color-picker__colors {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.enhanced-color-picker__colors--grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 2px;
}

.enhanced-color-picker__color {
  width: 20px;
  height: 20px;
  min-width: 20px;
  min-height: 20px;
  padding: 0;
  border: 1px solid #e5e7eb;
  border-radius: 3px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  position: relative;
  flex-shrink: 0;
  box-sizing: border-box;
}

.enhanced-color-picker__color:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.enhanced-color-picker__color--active {
  box-shadow: 0 0 0 2px #1890ff;
  transform: scale(1.1);
  z-index: 1;
}

.enhanced-color-picker__color--dark {
  border-color: #4b5563;
}

.enhanced-color-picker__color--dark:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.enhanced-color-picker__color--dark.enhanced-color-picker__color--active {
  box-shadow: 0 0 0 2px #66b3ff;
}

.enhanced-color-picker__no-color {
  background: linear-gradient(
    45deg,
    transparent 40%,
    #ff4d4f 40%,
    #ff4d4f 60%,
    transparent 60%
  );
  color: #666;
}

.enhanced-color-picker__no-color svg {
  width: 12px;
  height: 12px;
}

.enhanced-color-picker__more {
  border-top: 1px solid var(--color-border, #e5e7eb);
  padding-top: 8px;
}

.enhanced-color-picker__more-button {
  width: 100%;
  padding: 6px 8px;
  border: none;
  background: transparent;
  color: var(--color-text-secondary, #6b7280);
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  border-radius: 4px;
  transition: all 0.15s ease;
}

.enhanced-color-picker__more-button:hover {
  background: var(--color-bg-hover, #f3f4f6);
  color: var(--color-text-primary, #1f2937);
}

.enhanced-color-picker__more-button--dark {
  color: var(--color-text-secondary-dark, #9ca3af);
  border-top-color: var(--color-border-dark, #4b5563);
}

.enhanced-color-picker__more-button--dark:hover {
  background: var(--color-bg-hover-dark, #374151);
  color: var(--color-text-primary-dark, #f9fafb);
}
</style>