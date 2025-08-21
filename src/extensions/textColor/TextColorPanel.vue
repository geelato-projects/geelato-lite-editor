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
      title="选择文字颜色"
      :colors="textColors"
      :selectedColor="currentColor"
      :isDark="isDark"
      clearButtonTitle="取消文字颜色"
      @color-select="handleColorSelect"
    />
  </FloatingPanel>
</template>

<script setup lang="ts">
import FloatingPanel from '../../components/ui/FloatingPanel.vue'
import ColorPicker from '../highlight/ColorPicker.vue'

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

// 文字颜色选项
const textColors = [
  { name: '黑色', value: '#000000' },
  { name: '深灰', value: '#666666' },
  { name: '红色', value: '#ff4d4f' },
  { name: '橙色', value: '#ff7a45' },
  { name: '黄色', value: '#faad14' },
  { name: '绿色', value: '#52c41a' },
  { name: '蓝色', value: '#1890ff' },
  { name: '紫色', value: '#722ed1' }
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