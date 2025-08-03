<template>
  <div :class="separatorClass"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ComponentSize } from '../../types'

interface Props {
  /** 分隔符方向 */
  direction?: 'vertical' | 'horizontal'
  /** 分隔符尺寸 */
  size?: ComponentSize
  /** 自定义类名 */
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  direction: 'vertical',
  size: 'medium',
})

// 分隔符类名
const separatorClass = computed(() => {
  const classes = [
    'gl-toolbar-separator',
    `gl-toolbar-separator--${props.direction}`,
    `gl-toolbar-separator--${props.size}`,
  ]
  
  if (props.class) {
    classes.push(props.class)
  }
  
  return classes.join(' ')
})
</script>

<style lang="less">
.gl-toolbar-separator {
  background: var(--gl-border-color, #e0e0e0);
  flex-shrink: 0;
  
  &--vertical {
    width: 1px;
    align-self: stretch;
    margin: 0 4px;
    
    &.gl-toolbar-separator--small {
      margin: 0 2px;
    }
    
    &.gl-toolbar-separator--large {
      margin: 0 6px;
    }
  }
  
  &--horizontal {
    height: 1px;
    width: 100%;
    margin: 4px 0;
    
    &.gl-toolbar-separator--small {
      margin: 2px 0;
    }
    
    &.gl-toolbar-separator--large {
      margin: 6px 0;
    }
  }
}

// 暗色主题
.gl-theme-dark {
  .gl-toolbar-separator {
    background: var(--gl-border-color, #404040);
  }
}
</style>