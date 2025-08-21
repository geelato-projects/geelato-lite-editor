<template>
  <div class="color-picker">
    <div class="color-picker__title" v-if="title">
      {{ title }}
    </div>
    <div class="color-picker__colors">
      <button
        v-for="color in colors"
        :key="color.value"
        class="color-picker__color"
        :class="{
          'color-picker__color--active': selectedColor === color.value,
          'color-picker__color--dark': isDark
        }"
        :style="{ 
          backgroundColor: color.value,
          borderColor: getBorderColor(color.value)
        }"
        :title="color.name"
        @click="selectColor(color.value)"
      >
      </button>
      
      <!-- 取消高亮按钮 -->
      <button
        class="color-picker__clear"
        :class="{
          'color-picker__clear--active': selectedColor === null,
          'color-picker__clear--dark': isDark
        }"
        :title="props.clearButtonTitle"
        @click="clearColor"
      >
        <svg width="24" height="24" viewBox="0 0 1024 1024" fill="currentColor">
          <path d="M872.615385 151.384615c-198.892308-198.892308-522.584615-198.892308-721.476923 0-198.892308 198.892308-198.892308 522.584615 0 721.476923 99.446154 99.446154 230.153846 149.169231 360.615384 149.169231S772.923077 972.307692 872.369231 872.861538c199.384615-199.138462 199.384615-522.584615 0.246154-721.476923z m-678.892308 42.338462C281.6 106.092308 396.8 62.030769 512 62.030769c105.846154 0 211.446154 37.415385 296.123077 111.507693L173.538462 807.876923c-154.584615-176.492308-148.184615-445.784615 20.184615-614.153846z m636.553846 636.553846c-168.369231 168.369231-437.661538 174.769231-614.4 20.184615L850.215385 216.123077c154.830769 176.492308 148.430769 445.784615-19.938462 614.153846z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ColorOption {
  name: string
  value: string
}

interface Props {
  title?: string
  colors?: ColorOption[]
  selectedColor?: string | null
  isDark?: boolean
  clearButtonTitle?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  colors: () => [
    { name: '绿色', value: '#dcfce7' },
    { name: '蓝色', value: '#dbeafe' },
    { name: '粉色', value: '#fce7f3' },
    { name: '紫色', value: '#e9d5ff' },
    { name: '黄色', value: '#fef3c7' }
  ],
  selectedColor: null,
  isDark: false,
  clearButtonTitle: '取消颜色'
})

const emit = defineEmits<{
  colorSelect: [color: string | null]
}>()

const selectColor = (color: string) => {
  emit('colorSelect', color)
}

const clearColor = () => {
  emit('colorSelect', null)
}

// 计算相近的边框颜色
const getBorderColor = (backgroundColor: string) => {
  // 将十六进制颜色转换为RGB
  const hex = backgroundColor.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  
  // 计算亮度
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  
  // 根据亮度调整边框颜色
  if (brightness > 128) {
    // 亮色背景，使用较深的边框
    const factor = 0.7
    const newR = Math.round(r * factor)
    const newG = Math.round(g * factor)
    const newB = Math.round(b * factor)
    return `rgb(${newR}, ${newG}, ${newB})`
  } else {
    // 暗色背景，使用较亮的边框
    const factor = 1.3
    const newR = Math.min(255, Math.round(r * factor))
    const newG = Math.min(255, Math.round(g * factor))
    const newB = Math.min(255, Math.round(b * factor))
    return `rgb(${newR}, ${newG}, ${newB})`
  }
}
</script>

<style scoped>
.color-picker {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.color-picker__title {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-secondary, #9ca3af);
  margin: 0;
  padding: 0 4px;
}

.color-picker__colors {
  display: flex;
  gap: 6px;
  align-items: center;
}

.color-picker__color {
  width: 24px !important;
  height: 24px !important;
  min-width: 24px !important;
  min-height: 24px !important;
  max-width: 24px !important;
  max-height: 24px !important;
  padding: 0 !important;
  border-radius: 50% !important;
  border: 1px solid;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  position: relative;
  flex-shrink: 0 !important;
  box-sizing: border-box !important;
  font-size: 0 !important;
}

.color-picker__color:hover {
  background-color: #f3f4f6 !important;
  box-shadow: 0 0 0 2px #f3f4f6;
}

.color-picker__color--active {
  background-color: #f3f4f6 !important;
  box-shadow: 0 0 0 2px #f3f4f6;
}

.color-picker__color--dark:hover {
  background-color: #4b5563 !important;
  box-shadow: 0 0 0 2px #4b5563;
}

.color-picker__color--dark.color-picker__color--active {
  background-color: #4b5563 !important;
  box-shadow: 0 0 0 2px #4b5563;
}

.color-picker__clear {
  width: 24px !important;
  height: 24px !important;
  min-width: 24px !important;
  min-height: 24px !important;
  max-width: 24px !important;
  max-height: 24px !important;
  padding: 0 !important;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  color: var(--color-text-secondary, #9ca3af);
  flex-shrink: 0 !important;
  box-sizing: border-box !important;
  font-size: inherit !important;
}

.color-picker__clear:hover {
  background: #f3f4f6;
  border-radius: 50%;
  box-shadow: 0 0 0 2px #e5e7eb;
  transform: scale(1.05);
  transition: all 0.15s ease;
}

.color-picker__clear--active {
  background: var(--color-primary-light, #eff6ff);
  border-radius: 50%;
  box-shadow: 0 0 0 2px #f3f4f6;
}

.color-picker__clear--dark {
  background: transparent;
  color: var(--color-text-secondary-dark, #9ca3af);
}

.color-picker__clear--dark:hover {
  background: var(--color-bg-hover-dark, #4b5563);
  border-radius: 50%;
  box-shadow: 0 0 0 2px #4b5563;
}

.color-picker__clear--dark.color-picker__clear--active {
  box-shadow: 0 0 0 2px #4b5563;
}
</style>