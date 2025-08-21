<template>
  <div class="image-bubble-menu" v-if="visible">
    <!-- 对齐选项 -->
    <div class="bubble-menu-section">
      <button 
        class="bubble-menu-btn"
        :class="{ active: isAlignLeft }"
        @click.stop="setAlignment('left')"
        title="左对齐"
      >
        <SvgIcon name="align-left" size="16" />
      </button>
      <button 
        class="bubble-menu-btn"
        :class="{ active: isAlignCenter }"
        @click.stop="setAlignment('center')"
        title="居中对齐"
      >
        <SvgIcon name="align-center" size="16" />
      </button>
      <button 
        class="bubble-menu-btn"
        :class="{ active: isAlignRight }"
        @click.stop="setAlignment('right')"
        title="右对齐"
      >
        <SvgIcon name="align-right" size="16" />
      </button>
    </div>
    
    <!-- 分隔符 -->
    <div class="bubble-menu-separator"></div>
    
    <!-- 锁定比例 -->
    <div class="bubble-menu-section">
      <button 
        class="bubble-menu-btn"
        :class="{ active: isProportionLocked }"
        @click.stop="toggleProportionLock"
        title="锁定缩放比例"
      >
        <SvgIcon :name="isProportionLocked ? 'lock' : 'unlock'" size="16" />
      </button>
    </div>
    
    <!-- 分隔符 -->
    <div class="bubble-menu-separator"></div>
    
    <!-- 删除 -->
    <div class="bubble-menu-section">
      <button 
        class="bubble-menu-btn bubble-menu-btn--danger"
        @click.stop="deleteImage"
        title="删除图片"
      >
        <SvgIcon name="delete" size="16" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import type { Node } from '@tiptap/pm/model'
import SvgIcon from '../ui/SvgIcon.vue'

interface Props {
  editor: Editor
  visible: boolean
  node?: Node
  updateAttributes?: (attrs: Record<string, any>) => void
  deleteNode?: () => void
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  interact: []
}>()

// 当前对齐方式
const currentAlign = computed(() => {
  return props.node?.attrs?.align || 'left'
})

const isAlignLeft = computed(() => currentAlign.value === 'left')
const isAlignCenter = computed(() => currentAlign.value === 'center')
const isAlignRight = computed(() => currentAlign.value === 'right')

// 比例锁定状态
const isProportionLocked = computed(() => {
  return props.node?.attrs?.proportionLocked || false
})

// 设置对齐方式
const setAlignment = (align: 'left' | 'center' | 'right') => {
  if (props.updateAttributes) {
    props.updateAttributes({ align })
  }
  // 发出交互事件，重置定时器
  emit('interact')
}

// 切换比例锁定
const toggleProportionLock = () => {
  if (props.updateAttributes) {
    props.updateAttributes({ 
      proportionLocked: !isProportionLocked.value 
    })
  }
  // 发出交互事件，重置定时器
  emit('interact')
}

// 删除图片
const deleteImage = () => {
  if (props.deleteNode) {
    props.deleteNode()
  }
  // 发出交互事件，重置定时器
  emit('interact')
  emit('close')
}
</script>

<style scoped>
.image-bubble-menu {
  display: flex;
  align-items: center;
  background: var(--gl-bg-color, #ffffff);
  border: 1px solid var(--gl-border-color, #e0e0e0);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 8px;
  gap: 4px;
  z-index: var(--gl-z-index-popover, 1070);
}

.bubble-menu-section {
  display: flex;
  align-items: center;
  gap: 2px;
}

.bubble-menu-separator {
  width: 1px;
  height: 24px;
  background: var(--gl-border-color, #e0e0e0);
  margin: 0 4px;
}

.bubble-menu-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: var(--gl-text-color, #333333);
  cursor: pointer;
  transition: all 0.2s ease;
}

.bubble-menu-btn:hover {
  background: var(--gl-hover-bg-color, #f5f5f5);
}

.bubble-menu-btn.active {
  background: var(--gl-primary-color, #3a7afe);
  color: #ffffff;
}

.bubble-menu-btn--danger {
  color: #ef4444;
}

.bubble-menu-btn--danger:hover {
  background: #fef2f2;
  color: #dc2626;
}
</style>