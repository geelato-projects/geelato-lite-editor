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
    <div class="link-panel">
      <div class="link-panel__form">
        <div class="link-panel__input-wrapper">
          <input
            ref="urlInputRef"
            v-model="linkData.url"
            type="url"
            class="link-panel__input"
            placeholder="输入链接地址..."
            @keydown.enter="handleConfirm"
            @keydown.escape="handleClose"
          />
        </div>
        <div class="link-panel__actions">
          <button
            class="link-panel__button"
            :disabled="!linkData.url"
            @click="handleConfirm"
            title="确认"
          >
            <SvgIcon name="enter" class="link-panel__icon" />
          </button>
          <button
            class="link-panel__button link-panel__button--open"
            :disabled="!linkData.url"
            @click="handleOpenLink"
            title="打开链接"
          >
            <SvgIcon name="open-link" class="link-panel__icon" />
          </button>
          <button
            class="link-panel__button link-panel__button--delete"
            @click="handleDelete"
            title="删除链接"
          >
            <SvgIcon name="delete" class="link-panel__icon" />
          </button>
        </div>
      </div>
    </div>
  </FloatingPanel>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import FloatingPanel from '../../components/ui/FloatingPanel.vue'
import SvgIcon from '../../components/ui/SvgIcon.vue'

interface Props {
  visible?: boolean
  reference?: HTMLElement | null
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end'
  offset?: number
  size?: 'small' | 'medium' | 'large'
  isDark?: boolean
  defaultUrl?: string
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  reference: null,
  placement: 'bottom-start',
  offset: 8,
  size: 'medium',
  isDark: false,
  defaultUrl: ''
})

const emit = defineEmits<{
  confirm: [url: string]
  delete: []
  close: []
}>()

const urlInputRef = ref<HTMLInputElement | null>(null)
const linkData = ref({
  url: ''
})

// 监听visible变化，重置表单数据并聚焦
watch(() => props.visible, (newVisible) => {
  if (newVisible) {
    linkData.value = {
      url: props.defaultUrl
    }
    nextTick(() => {
      urlInputRef.value?.focus()
    })
  }
})

const handleConfirm = () => {
  if (!linkData.value.url) return
  
  emit('confirm', linkData.value.url)
  emit('close')
}

const handleOpenLink = () => {
  if (!linkData.value.url) return
  
  // 打开链接
  window.open(linkData.value.url, '_blank')
}

const handleDelete = () => {
  emit('delete')
  emit('close')
}

const handleClose = () => {
  emit('close')
}

const handleClickOutside = () => {
  emit('close')
}
</script>

<style lang="less" scoped>
.link-panel {
  padding: 8px;
  width: 280px;
  
  &__form {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  &__input-wrapper {
    flex: 1;
    min-width: 0; /* 确保flex子项可以收缩 */
    border: 1px solid var(--gl-border-color, #e0e0e0);
    border-radius: 4px;
    background: var(--gl-input-bg, #fff);
    transition: border-color 0.2s;
    
    &:focus-within {
      border-color: var(--gl-primary-color, #1890ff);
      box-shadow: 0 0 0 2px var(--gl-primary-color-light, rgba(24, 144, 255, 0.2));
    }
  }
  
  &__input {
    width: 100%;
    padding: 8px 10px;
    border: none;
    background: transparent;
    font-size: 13px;
    color: var(--gl-text-color, #333);
    outline: none;
    
    &::placeholder {
      color: var(--gl-text-color-placeholder, #999);
    }
  }
  
  &__actions {
    display: flex;
    gap: 4px;
    flex-shrink: 0;
  }
  
  &__button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    padding: 0;
    border: 1px solid var(--gl-border-color, #e0e0e0);
    border-radius: 4px;
    background: var(--gl-button-bg, #fff);
    color: var(--gl-text-color, #666);
    cursor: pointer;
    transition: all 0.2s;
    flex-shrink: 0;
    
    &:hover:not(:disabled) {
      background: var(--gl-hover-bg, #f5f5f5);
      color: var(--gl-text-color, #333);
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    &--open:hover:not(:disabled) {
      color: var(--gl-primary-color, #1890ff);
      border-color: var(--gl-primary-color, #1890ff);
    }
    
    &--delete:hover:not(:disabled) {
      color: var(--gl-danger-color, #ff4d4f);
      border-color: var(--gl-danger-color, #ff4d4f);
    }
  }
  
  &__icon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
}

/* 暗色主题 */
.gl-theme-dark .link-panel {
  &__input-wrapper {
    background: var(--gl-input-bg, #2d2d2d);
    border-color: var(--gl-border-color, #404040);
  }
  
  &__input {
    color: var(--gl-text-color, #fff);
    
    &::placeholder {
      color: var(--gl-text-color-placeholder, #666);
    }
  }
  
  &__button {
    background: var(--gl-button-bg, #2d2d2d);
    color: var(--gl-text-color, #ccc);
    border-color: var(--gl-border-color, #404040);
    
    &:hover:not(:disabled) {
      background: var(--gl-hover-bg, #3a3a3a);
      color: var(--gl-text-color, #fff);
    }
  }
}
</style>