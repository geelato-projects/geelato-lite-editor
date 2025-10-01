<template>
  <button
    ref="buttonRef"
    :class="buttonClass"
    :title="title"
    :disabled="disabled"
    @click="handleClick"
    @mousedown.prevent
  >
    <SvgIcon v-if="icon" :name="icon" :class="iconClass" />
    <span v-if="$slots.default" class="gl-button-text">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ComponentSize } from '../../types'
import type { IconName } from './icons'
import SvgIcon from './SvgIcon.vue'

interface Props {
  /** 按钮图标 */
  icon?: IconName
  /** 按钮标题 */
  title?: string
  /** 是否激活状态 */
  active?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 按钮尺寸 */
  size?: ComponentSize
  /** 按钮类型 */
  type?: 'default' | 'primary' | 'text'
  /** 自定义类名 */
  class?: string
}

interface Emits {
  click: [event: MouseEvent]
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  type: 'default',
  active: false,
  disabled: false,
})

const emit = defineEmits<Emits>()

// 按钮DOM引用
const buttonRef = ref<HTMLButtonElement>()

// 暴露给父组件
defineExpose({
  buttonRef
})

// 按钮类名
const buttonClass = computed(() => {
  const classes = [
    'gl-toolbar-button',
    `gl-toolbar-button--${props.size}`,
    `gl-toolbar-button--${props.type}`,
  ]
  
  if (props.active) {
    classes.push('gl-toolbar-button--active')
  }
  
  if (props.disabled) {
    classes.push('gl-toolbar-button--disabled')
  }
  
  if (props.class) {
    classes.push(props.class)
  }
  
  return classes.join(' ')
})

// 图标类名
const iconClass = computed(() => {
  return [
    'gl-toolbar-button__icon',
    `gl-toolbar-button__icon--${props.size}`,
  ].join(' ')
})



// 处理点击事件
const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<style lang="less">
.gl-toolbar-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: 4px;
  background: transparent;
  color: var(--gl-text-color, #333);
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  font-size: inherit;
  line-height: 1;
  outline: none;
  user-select: none;
  
  &:hover:not(&--disabled) {
    background: var(--gl-hover-bg, #f5f5f5);
    border-color: var(--gl-border-color, #e0e0e0);
  }
  
  &:active:not(&--disabled) {
    background: var(--gl-active-bg, #e8e8e8);
  }
  
  &:focus-visible {
    box-shadow: 0 0 0 2px var(--gl-selection-bg, #b3d4fc);
  }
  

  // 尺寸变体
  &--small {
    padding: 4px 6px;
    min-width: 24px;
    min-height: 24px;
    font-size: 14px;
    
    .gl-toolbar-button__icon {
      font-size: 14px;
    }
  }
  
  &--medium {
    padding: 6px 8px;
    min-width: 32px;
    min-height: 32px;
    font-size: 16px;
    
    .gl-toolbar-button__icon {
      font-size: 16px;
    }
  }
  
  &--large {
    padding: 8px 12px;
    min-width: 40px;
    min-height: 40px;
    font-size: 18px;
    
    .gl-toolbar-button__icon {
      font-size: 18px;
    }
  }
  
  // 类型变体
  &--primary {
    background: var(--gl-primary-color, #1890ff);
    color: #fff;
    border-color: var(--gl-primary-color, #1890ff);
    
    &:hover:not(.gl-toolbar-button--disabled) {
      background: var(--gl-primary-hover-color, #40a9ff);
      border-color: var(--gl-primary-hover-color, #40a9ff);
    }
    
    &:active:not(.gl-toolbar-button--disabled) {
      background: var(--gl-primary-active-color, #096dd9);
      border-color: var(--gl-primary-active-color, #096dd9);
    }
  }
  
  &--text {
    border: none;
    background: transparent;
    
    &:hover:not(.gl-toolbar-button--disabled) {
      background: var(--gl-hover-bg, #f5f5f5);
    }
  }
  
  // 状态变体
  &--active {
    background: var(--gl-hover-bg, #f5f5f5);
    border-color: var(--gl-border-color, #e0e0e0);
    color: var(--gl-primary-color, #1890ff);
  }
  
  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;
    
    &:hover,
    &:active,
    &:focus {
      background: transparent;
      border-color: transparent;
      box-shadow: none;
    }
  }
}

.gl-toolbar-button__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-style: normal;
  
  &--small {
    width: 18px;
    height: 18px;
  }
  
  &--medium {
    width: 20px;
    height: 20px;
  }
  
  &--large {
    width: 22px;
    height: 22px;
  }
}

.gl-button-text {
  margin-left: 4px;
  font-weight: normal;
}

// 暗色主题
.gl-lite-editor.gl-theme-dark {
  .gl-toolbar-button {
    color: var(--gl-color-text-1, #f8f9fa);
    
    &:hover:not(&--disabled) {
      background: var(--gl-color-fill-2, #495057);
      border-color: var(--gl-color-border, #6c757d);
    }
    
    &:active:not(&--disabled) {
      background: var(--gl-color-fill-3, #6c757d);
    }
    
    &--active {
      background: var(--gl-color-fill-2, #495057);
      border-color: var(--gl-color-border, #6c757d);
      color: var(--gl-color-primary, #66b3ff);
    }
  }
}
</style>