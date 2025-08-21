<template>
  <FloatingPanel
    :visible="visible"
    :reference="reference"
    :placement="placement"
    :offset="offset"
    :size="size"
    :theme="isDark ? 'dark' : 'light'"
    @click-outside="handleClickOutside"
  >
    <ColorPicker
      title="选择高亮颜色"
      :colors="highlightColors"
      :selectedColor="currentColor"
      :isDark="isDark"
      clearButtonTitle="取消高亮"
      @color-select="handleColorSelect"
    />
  </FloatingPanel>
</template>

<script setup lang="ts">
// import { computed } from 'vue'
import FloatingPanel from '../../components/ui/FloatingPanel.vue'
import ColorPicker from './ColorPicker.vue'

interface Props {
  visible?: boolean
  reference?: HTMLElement | null
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end'
  offset?: number
  size?: 'small' | 'medium' | 'large'
  isDark?: boolean
  currentColor?: string | null
}

withDefaults(defineProps<Props>(), {
  visible: false,
  reference: null,
  placement: 'bottom-start',
  offset: 8,
  size: 'medium',
  isDark: false,
  currentColor: null
})

const emit = defineEmits<{
  colorSelect: [color: string | null]
  close: []
}>()

// 高亮颜色选项
const highlightColors = [
  { name: '绿色高亮', value: '#dcfce7' },
  { name: '蓝色高亮', value: '#dbeafe' },
  { name: '粉色高亮', value: '#fce7f3' },
  { name: '紫色高亮', value: '#e9d5ff' },
  { name: '黄色高亮', value: '#fef3c7' }
]

const handleColorSelect = (color: string | null) => {
  emit('colorSelect', color)
  // 选择颜色后自动关闭面板
  emit('close')
}

const handleClickOutside = () => {
  emit('close')
}
</script>