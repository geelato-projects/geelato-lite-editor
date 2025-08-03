<template>
  <div
    :class="iconClass"
    :style="iconStyle"
    aria-hidden="true"
    v-html="svgContent"
  >
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getIcon, type IconName } from './icons'

interface Props {
  /** 图标名称 */
  name: IconName
  /** 图标尺寸 */
  size?: string | number
  /** 图标颜色 */
  color?: string
  /** 自定义类名 */
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: '1em',
  color: 'currentColor'
})

// 图标类名
const iconClass = computed(() => {
  const classes = ['gl-svg-icon']
  if (props.class) {
    classes.push(props.class)
  }
  return classes.join(' ')
})

// 图标样式
const iconStyle = computed(() => {
  return {
    width: typeof props.size === 'number' ? `${props.size}px` : props.size,
    height: typeof props.size === 'number' ? `${props.size}px` : props.size,
    fill: props.color
  }
})

// 获取SVG内容
const svgContent = computed(() => {
  const iconContent = getIcon(props.name)
  if (!iconContent) {
    console.warn(`Icon not found: ${props.name}`)
    return ''
  }
  return iconContent
})
</script>

<style lang="less">
.gl-svg-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  overflow: hidden;
  
  svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
    display: block;
  }
}
</style>