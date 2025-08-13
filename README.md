# Geelato Lite Editor

一个基于 Vue 3 + TypeScript + TipTap 的轻量级富文本编辑器组件，提供丰富的编辑功能和高度可定制的扩展机制。

## 📦 包大小

- **ES 模块**: ~154KB (gzip: ~32KB)
- **UMD 模块**: ~96KB (gzip: ~26KB) 
- **CSS 样式**: ~36KB (gzip: ~6KB)
- **类型定义**: ~3KB

## ✨ 特性

### 🎯 核心功能
- **富文本编辑**: 支持粗体、斜体、下划线、删除线、行内代码等基础格式
- **标题系统**: 支持 H1-H6 多级标题，带下拉选择器
- **列表功能**: 无序列表、有序列表、任务列表（待办事项）
- **引用块**: 支持多层级引用块
- **代码块**: 支持语法高亮的代码块
- **链接管理**: 智能链接插入和编辑，支持点击编辑
- **图片处理**: 图片插入、拖拽调整大小、对齐方式设置
- **表格编辑**: 完整的表格操作（插入、删除行列、合并拆分单元格）
- **文本对齐**: 左对齐、居中、右对齐、两端对齐
- **文字颜色**: 自定义文字颜色和高亮标记
- **撤销重做**: 完整的操作历史管理
- **导出功能**: 支持导出适用于邮件的HTML

### 🎨 界面特性
- **主题系统**: 支持亮色/暗色/自动主题切换
- **自定义主题色**: 可配置主题色，组件自动适配
- **响应式设计**: 支持不同尺寸（small/medium/large）
- **工具栏模式**: 四种预设模式（full/simple/minimal/none）
- **浮动面板**: 智能定位的颜色选择器和工具面板
- **状态栏**: 显示字数统计等编辑器状态信息

### 🔧 开发特性
- **TypeScript**: 完整的类型定义和智能提示
- **组合式 API**: 基于 Vue 3 Composition API
- **扩展机制**: 灵活的扩展系统，支持自定义功能
- **事件系统**: 丰富的事件回调，便于集成
- **无障碍**: 支持键盘导航和屏幕阅读器

## 🚀 快速开始

### 安装

```bash
# 使用 pnpm（推荐）
pnpm install @geelato/lite-editor

# 使用 npm
npm install @geelato/lite-editor

# 使用 yarn
yarn add @geelato/lite-editor
```

### 样式导入

**重要**: 使用编辑器时，必须导入样式文件以确保编辑器正常显示和功能完整。

```javascript
// 方式一：在主入口文件（如 main.js 或 main.ts）中全局导入（推荐）
import '@geelato/lite-editor/dist/lite-editor.css'

// 方式二：在使用编辑器的组件中单独导入
import '@geelato/lite-editor/dist/lite-editor.css'
```

### 基础使用

```vue
<template>
  <div>
    <GeelatoLiteEditor
      v-model="content"
      :editable="true"
      :toolbar="'simple'"
      :theme="'auto'"
      :primary-color="'#1890ff'"
      placeholder="请输入内容..."
      @change="handleChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { GeelatoLiteEditor } from '@geelato/lite-editor'
// 导入样式文件
import '@geelato/lite-editor/dist/lite-editor.css'
import type { EditorContent } from '@geelato/lite-editor'

const content = ref('<p>Hello World!</p>')

const handleChange = (editorContent: EditorContent) => {
  console.log('HTML:', editorContent.html)
  console.log('JSON:', editorContent.json)
  console.log('Text:', editorContent.text)
}
</script>
```

### 高级配置

```vue
<template>
  <GeelatoLiteEditor
    v-model="content"
    :editable="editable"
    :toolbar="toolbarConfig"
    :theme="theme"
    :primary-color="primaryColor"
    :size="size"
    :bordered="true"
    :show-status-bar="true"
    :min-height="'300px'"
    :max-height="'600px'"
    :extensions="customExtensions"
    placeholder="开始编写您的内容..."
    @change="handleChange"
    @focus="handleFocus"
    @blur="handleBlur"
    @selection-change="handleSelectionChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { GeelatoLiteEditor, createExtensions } from '@geelato/lite-editor'
import type { 
  EditorContent, 
  SelectionState, 
  ToolbarConfig,
  ThemeType,
  ComponentSize 
} from '@geelato/lite-editor'

const content = ref('')
const editable = ref(true)
const theme = ref<ThemeType>('auto')
const primaryColor = ref('#1890ff')
const size = ref<ComponentSize>('medium')

// 自定义工具栏配置
const toolbarConfig = ref<ToolbarConfig>({
  mode: 'full',
  items: ['bold', 'italic', '|', 'heading', 'list', '|', 'link', 'image'],
  size: 'medium',
  showSeparator: true
})

// 自定义扩展
const customExtensions = createExtensions({
  heading: { levels: [1, 2, 3, 4] },
  link: { openOnClick: false },
  table: { resizable: true, cellMinWidth: 100 }
})

const handleChange = (editorContent: EditorContent) => {
  console.log('内容变化:', editorContent)
}

const handleFocus = (event: FocusEvent) => {
  console.log('编辑器获得焦点')
}

const handleBlur = (event: FocusEvent) => {
  console.log('编辑器失去焦点')
}

const handleSelectionChange = (selection: SelectionState) => {
  console.log('选择变化:', selection)
}
</script>
```

## 📖 API 文档

### 组件属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `modelValue` | `string` | `''` | 编辑器内容（HTML格式） |
| `editable` | `boolean` | `true` | 是否可编辑 |
| `placeholder` | `string` | `'请输入内容...'` | 占位符文本 |
| `theme` | `'light' \| 'dark' \| 'auto'` | `'auto'` | 主题模式 |
| `primaryColor` | `string` | `'#1890ff'` | 主题色 |
| `toolbar` | `ToolbarMode \| ToolbarConfig \| boolean` | `'simple'` | 工具栏配置 |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | 组件尺寸 |
| `bordered` | `boolean` | `true` | 是否显示边框 |
| `showStatusBar` | `boolean` | `true` | 是否显示状态栏 |
| `height` | `string \| number` | - | 编辑器高度 |
| `minHeight` | `string \| number` | `'200px'` | 最小高度 |
| `maxHeight` | `string \| number` | - | 最大高度 |
| `autoFocus` | `boolean` | `false` | 是否自动聚焦 |
| `extensions` | `Extension[]` | - | 自定义扩展 |
| `readonly` | `boolean` | `false` | 只读模式 |
| `disabled` | `boolean` | `false` | 禁用状态 |

### 工具栏配置

#### 预设模式
- `'full'`: 完整工具栏，包含所有功能
- `'simple'`: 简化工具栏，包含常用功能
- `'minimal'`: 最小工具栏，仅基础格式
- `'none'`: 隐藏工具栏

#### 自定义配置
```typescript
interface ToolbarConfig {
  mode?: ToolbarMode
  items?: string[]  // 自定义按钮列表
  size?: ComponentSize
  showSeparator?: boolean
}
```

### 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `update:modelValue` | `(value: string)` | 内容更新 |
| `change` | `(content: EditorContent)` | 内容变化 |
| `focus` | `(event: FocusEvent)` | 获得焦点 |
| `blur` | `(event: FocusEvent)` | 失去焦点 |
| `selection-change` | `(selection: SelectionState)` | 选择变化 |
| `created` | `(editor: Editor)` | 编辑器创建完成 |
| `destroyed` | `()` | 编辑器销毁 |

## 🔌 扩展开发

### 创建自定义扩展

```typescript
import { Extension } from '@tiptap/core'

// 1. 创建自定义扩展
const MyCustomExtension = Extension.create({
  name: 'myCustomExtension',
  
  addOptions() {
    return {
      // 扩展选项
    }
  },
  
  addCommands() {
    return {
      myCommand: () => ({ commands }) => {
        // 自定义命令逻辑
        return true
      }
    }
  },
  
  addKeyboardShortcuts() {
    return {
      'Mod-Shift-x': () => this.editor.commands.myCommand()
    }
  }
})

// 2. 在编辑器中使用
const customExtensions = [
  ...createExtensions(), // 基础扩展
  MyCustomExtension.configure({
    // 配置选项
  })
]
```

### 自定义工具栏按钮

```typescript
import { useToolbar } from '@geelato/lite-editor'

// 1. 定义按钮配置
const customButton = {
  name: 'myButton',
  icon: 'my-icon', // 图标名称
  title: '我的按钮',
  command: 'myCommand',
  isActive: (editor) => editor.isActive('myExtension'),
  isDisabled: (editor) => !editor.can().myCommand(),
  action: (editor) => editor.chain().focus().myCommand().run()
}

// 2. 注册到工具栏
const { registerButton } = useToolbar(editor)
registerButton('myButton', customButton)

// 3. 在工具栏配置中使用
const toolbarConfig = {
  mode: 'custom',
  items: ['bold', 'italic', '|', 'myButton']
}
```

### 扩展配置接口

```typescript
interface ExtensionConfig {
  heading?: {
    levels?: number[]  // 支持的标题级别
  }
  link?: {
    openOnClick?: boolean  // 是否点击打开链接
    HTMLAttributes?: Record<string, any>
  }
  table?: {
    resizable?: boolean  // 是否可调整大小
    cellMinWidth?: number  // 单元格最小宽度
    allowTableNodeSelection?: boolean
  }
  codeBlock?: {
    defaultLanguage?: string  // 默认语言
    languageClassPrefix?: string
  }
  list?: {
    nested?: boolean  // 是否支持嵌套
  }
}
```

### 主题定制

```typescript
// 1. 自定义主题色
const customTheme = {
  primaryColor: '#ff6b35',
  // 组件会自动生成相关的色彩变量
}

// 2. CSS 变量覆盖
:root {
  --gl-primary-color: #ff6b35;
  --gl-primary-color-light: rgba(255, 107, 53, 0.2);
  --gl-primary-color-dark: rgba(255, 107, 53, 0.8);
  
  /* 兼容标题下拉组件 */
  --gl-color-primary-light-1: rgba(255, 107, 53, 0.2);
  --gl-color-primary-6: #ff6b35;
}
```

## 🛠️ 开发

### 本地开发

```bash
# 克隆项目
git clone https://github.com/geelato-projects/geelato-lite-editor.git
cd geelato-lite-editor

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建项目
pnpm build

# 预览构建结果
pnpm preview
```

### 项目结构

```
src/
├── components/          # 组件目录
│   ├── GeelatoLiteEditor.vue  # 主编辑器组件
│   ├── toolbar/         # 工具栏组件
│   ├── editor/          # 编辑器核心组件
│   └── ui/              # UI 基础组件
├── composables/         # 组合式函数
│   ├── useEditor.ts     # 编辑器逻辑
│   ├── useToolbar.ts    # 工具栏逻辑
│   └── useTheme.ts      # 主题逻辑
├── extensions/          # 扩展目录
│   ├── image/           # 图片扩展
│   ├── link/            # 链接扩展
│   ├── highlight/       # 高亮扩展
│   └── textColor/       # 文字颜色扩展
├── types/               # 类型定义
└── utils/               # 工具函数
```

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 支持

如有问题，请通过以下方式联系：
- 提交 [Issue] github
- 发送邮件至 hi@geelato.cn
