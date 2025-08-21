<template>
  <div v-if="visible" class="gl-modal-overlay" @click="handleOverlayClick">
    <div class="gl-modal" :class="modalClass" @click.stop>
      <div class="gl-modal__header">
        <h3 class="gl-modal__title">{{ title }}</h3>
        <button class="gl-modal__close" @click="handleCancel">
          ×
        </button>
      </div>
      
      <div class="gl-modal__body">
        <div v-if="description" class="gl-modal__description">
          {{ description }}
        </div>
        
        <div class="gl-modal__form">
          <div v-for="field in fields" :key="field.name" class="gl-form-item">
            <label v-if="field.label" class="gl-form-label">
              {{ field.label }}
            </label>
            
            <input
              v-if="field.type === 'text' || field.type === 'url' || field.type === 'email'"
              v-model="formData[field.name]"
              :type="field.type"
              :placeholder="field.placeholder"
              :required="field.required"
              class="gl-form-input"
              @keyup.enter="handleConfirm"
              @keyup.escape="handleCancel"
            />
            
            <textarea
              v-else-if="field.type === 'textarea'"
              v-model="formData[field.name]"
              :placeholder="field.placeholder"
              :required="field.required"
              :rows="field.rows || 3"
              class="gl-form-textarea"
              @keyup.ctrl.enter="handleConfirm"
              @keyup.escape="handleCancel"
            ></textarea>
            
            <select
              v-else-if="field.type === 'select'"
              v-model="formData[field.name]"
              :required="field.required"
              class="gl-form-select"
            >
              <option v-for="option in field.options" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
            
            <input
              v-else-if="field.type === 'file'"
              type="file"
              :accept="field.accept"
              :required="field.required"
              class="gl-form-input"
              @change="handleFileChange($event, field.name)"
            />
          </div>
        </div>
      </div>
      
      <div class="gl-modal__footer">
        <button class="gl-button gl-button--default" @click="handleCancel">
          {{ cancelText }}
        </button>
        <button class="gl-button gl-button--primary" @click="handleConfirm">
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch, nextTick, computed } from 'vue'
import type { ComponentSize } from '../../types'

// 表单字段类型
interface FormField {
  name: string
  label?: string
  type: 'text' | 'url' | 'email' | 'textarea' | 'select' | 'file'
  placeholder?: string
  required?: boolean
  rows?: number
  options?: { label: string; value: string }[]
  defaultValue?: string
  accept?: string // 文件类型限制
}

interface Props {
  /** 是否显示 */
  visible?: boolean
  /** 对话框标题 */
  title?: string
  /** 对话框描述 */
  description?: string
  /** 表单字段 */
  fields?: FormField[]
  /** 确认按钮文本 */
  confirmText?: string
  /** 取消按钮文本 */
  cancelText?: string
  /** 对话框尺寸 */
  size?: ComponentSize
  /** 点击遮罩是否关闭 */
  maskClosable?: boolean
}

interface Emits {
  'update:visible': [visible: boolean]
  confirm: [data: Record<string, string>]
  cancel: []
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  title: '输入',
  confirmText: '确定',
  cancelText: '取消',
  size: 'medium',
  maskClosable: true,
  fields: () => [],
})

const emit = defineEmits<Emits>()

// 表单数据
const formData = reactive<Record<string, string>>({})

// 对话框类名
const modalClass = computed(() => {
  return [
    `gl-modal--${props.size}`,
  ].join(' ')
})

// 初始化表单数据
const initFormData = () => {
  Object.keys(formData).forEach(key => {
    delete formData[key]
  })
  
  props.fields.forEach(field => {
    formData[field.name] = field.defaultValue || ''
  })
}

// 验证表单
const validateForm = (): boolean => {
  for (const field of props.fields) {
    if (field.required && !formData[field.name]?.trim()) {
      return false
    }
  }
  return true
}

// 处理确认
const handleConfirm = () => {
  if (!validateForm()) {
    return
  }
  
  emit('confirm', { ...formData })
  emit('update:visible', false)
}

// 处理取消
const handleCancel = () => {
  emit('cancel')
  emit('update:visible', false)
}

// 处理遮罩点击
const handleOverlayClick = () => {
  if (props.maskClosable) {
    handleCancel()
  }
}

// 处理文件选择
const handleFileChange = (event: Event, fieldName: string) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      formData[fieldName] = result
    }
    reader.readAsDataURL(file)
  }
}

// 监听显示状态
watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      initFormData()
      nextTick(() => {
        // 自动聚焦第一个输入框
        const firstInput = document.querySelector('.gl-modal .gl-form-input, .gl-modal .gl-form-textarea') as HTMLElement
        firstInput?.focus()
      })
    }
  },
  { immediate: true }
)
</script>

<style lang="less">
.gl-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--gl-z-index-modal, 1090);
  backdrop-filter: blur(2px);
}

.gl-modal {
  background: var(--gl-bg-color, #fff);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  max-width: 90vw;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  
  &--small {
    width: 400px;
  }
  
  &--medium {
    width: 500px;
  }
  
  &--large {
    width: 600px;
  }
}

.gl-modal__header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--gl-border-color, #e0e0e0);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.gl-modal__title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--gl-text-color, #333);
}

.gl-modal__close {
  background: none;
  border: none;
  font-size: 20px;
  color: var(--gl-text-color, #666);
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  
  &:hover {
    background: var(--gl-hover-bg, #f5f5f5);
  }
}

.gl-modal__body {
  padding: 20px;
  flex: 1;
  overflow-y: auto;
}

.gl-modal__description {
  margin-bottom: 16px;
  color: var(--gl-text-color, #666);
  line-height: 1.5;
}

.gl-form-item {
  margin-bottom: 16px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.gl-form-label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: var(--gl-text-color, #333);
}

.gl-form-input,
.gl-form-textarea,
.gl-form-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--gl-border-color, #e0e0e0);
  border-radius: 4px;
  font-size: 14px;
  color: var(--gl-text-color, #333);
  background: var(--gl-bg-color, #fff);
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: var(--gl-primary-color, #1890ff);
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }
  
  &::placeholder {
    color: var(--gl-text-color, #999);
  }
}

.gl-form-textarea {
  resize: vertical;
  min-height: 80px;
}

.gl-modal__footer {
  padding: 16px 20px;
  border-top: 1px solid var(--gl-border-color, #e0e0e0);
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.gl-button {
  padding: 8px 16px;
  border: 1px solid transparent;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;
  
  &--default {
    background: var(--gl-bg-color, #fff);
    color: var(--gl-text-color, #333);
    border-color: var(--gl-border-color, #e0e0e0);
    
    &:hover {
      background: var(--gl-hover-bg, #f5f5f5);
      border-color: var(--gl-primary-color, #1890ff);
    }
  }
  
  &--primary {
    background: var(--gl-primary-color, #1890ff);
    color: #fff;
    border-color: var(--gl-primary-color, #1890ff);
    
    &:hover {
      background: var(--gl-primary-hover-color, #40a9ff);
      border-color: var(--gl-primary-hover-color, #40a9ff);
    }
    
    &:active {
      background: var(--gl-primary-active-color, #096dd9);
      border-color: var(--gl-primary-active-color, #096dd9);
    }
  }
  
  &:focus-visible {
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }
}

// 暗色主题
.gl-theme-dark {
  .gl-modal {
    background: var(--gl-bg-color, #1a1a1a);
  }
  
  .gl-modal__header {
    border-bottom-color: var(--gl-border-color, #404040);
  }
  
  .gl-modal__title {
    color: var(--gl-text-color, #fff);
  }
  
  .gl-modal__close {
    color: var(--gl-text-color, #ccc);
    
    &:hover {
      background: var(--gl-hover-bg, #2a2a2a);
    }
  }
  
  .gl-modal__description {
    color: var(--gl-text-color, #ccc);
  }
  
  .gl-form-label {
    color: var(--gl-text-color, #fff);
  }
  
  .gl-form-input,
  .gl-form-textarea,
  .gl-form-select {
    background: var(--gl-editor-bg, #1e1e1e);
    border-color: var(--gl-border-color, #404040);
    color: var(--gl-text-color, #fff);
    
    &::placeholder {
      color: var(--gl-text-color, #666);
    }
  }
  
  .gl-modal__footer {
    border-top-color: var(--gl-border-color, #404040);
  }
  
  .gl-button--default {
    background: var(--gl-bg-color, #2a2a2a);
    color: var(--gl-text-color, #fff);
    border-color: var(--gl-border-color, #404040);
    
    &:hover {
      background: var(--gl-hover-bg, #3a3a3a);
    }
  }
}
</style>