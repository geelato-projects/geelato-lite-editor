<template>
  <Teleport to="body">
    <div
      v-show="visible"
      ref="floating"
      :style="floatingStyles"
      class="floating-panel-wrapper"
    >
      <div :class="panelClasses">
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, watch } from 'vue'
import { useFloating, autoUpdate, offset, flip, shift } from '@floating-ui/vue'

interface Props {
  reference: HTMLElement | null
  visible?: boolean
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end'
  offset?: number
  theme?: 'light' | 'dark'
  size?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  placement: 'bottom-start',
  offset: 8,
  theme: 'light',
  size: 'medium'
})

const emit = defineEmits<{
  clickOutside: []
}>()

// 使用 Floating UI 的 Vue 绑定
const reference = computed(() => props.reference)
const floating = ref<HTMLElement>()

const { floatingStyles } = useFloating(reference, floating, {
  placement: computed(() => props.placement),
  middleware: computed(() => [
    offset(props.offset),
    flip(),
    shift({ padding: 8 })
  ]),
  whileElementsMounted: autoUpdate
})

// Floating UI 会自动处理定位，无需手动计算

// 点击外部关闭
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Node
  if (
    floating.value &&
    !floating.value.contains(target) &&
    props.reference &&
    !props.reference.contains(target)
  ) {
    emit('clickOutside')
  }
}

// 监听点击事件
watch(() => props.visible, (visible) => {
  if (visible) {
    document.addEventListener('click', handleClickOutside, true)
  } else {
    document.removeEventListener('click', handleClickOutside, true)
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside, true)
})

// 计算样式类
const panelClasses = computed(() => [
  'floating-panel',
  `floating-panel--${props.theme}`,
  `floating-panel--${props.size}`
])
</script>

<style scoped>
/* 外层包装器，由 Floating UI 定位 */
.floating-panel-wrapper {
  position: absolute;
  z-index: var(--gl-z-index-floating-panel, 1080);
  /* 避免初始闪烁，确保在定位完成前不可见 */
  opacity: 0;
  animation: fadeIn 0.1s ease-out forwards;
}

/* 内层面板，包含实际样式和动画 */
.floating-panel {
  background: var(--gl-color-bg-popup, #ffffff);
  border: 1px solid var(--gl-color-border, #e5e7eb);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 8px;
  min-width: 120px;
  max-width: 300px;
  animation: fadeInScale 0.15s ease-out;
}

/* 暗色主题样式 - 提高优先级 */
.floating-panel.floating-panel--dark {
  background: #343a40 !important;
  border-color: #495057 !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
  color: #f8f9fa !important;
}

/* 为了兼容性，保留原有选择器，但优先级低于theme prop */
.gl-lite-editor.gl-theme-dark .floating-panel:not(.floating-panel--dark) {
  background: var(--gl-color-bg-popup, #343a40);
  border-color: var(--gl-color-border, #495057);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.floating-panel--small {
  padding: 4px;
  min-width: 80px;
}

.floating-panel--medium {
  padding: 8px;
  min-width: 120px;
}

.floating-panel--large {
  padding: 12px;
  min-width: 160px;
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>