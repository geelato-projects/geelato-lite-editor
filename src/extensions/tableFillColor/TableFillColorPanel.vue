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
    <ColorPalette
      title="选择填充颜色"
      :selectedColor="currentColor"
      :isDark="isDark"
      clearButtonTitle="无填充颜色"
      @color-select="handleColorSelect"
    />
  </FloatingPanel>
</template>

<script setup lang="ts">
import FloatingPanel from '../../components/ui/FloatingPanel.vue'
import ColorPalette from '../../components/ui/ColorPalette.vue'

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

const handleColorSelect = (color: string | null) => {
  emit('colorSelect', color)
  // 选择颜色后自动关闭面板
  emit('close')
}

const handleClickOutside = () => {
  emit('close')
}
</script>