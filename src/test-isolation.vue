<template>
  <div class="test-isolation-page">
    <!-- 外部应用的样式 - 用于测试是否被编辑器污染 -->
    <div class="external-container">
      <div class="external-header">
        <h1>Geelato Lite Editor 样式隔离测试</h1>
      </div>

      <div class="instructions">
        <h4>测试说明</h4>
        <ul>
          <li>本页面用于测试 Geelato Lite Editor 的样式隔离效果</li>
          <li>页面包含各种外部应用常见的 HTML 元素和样式</li>
          <li>编辑器应该不会影响这些外部元素的样式</li>
          <li>同时，外部样式也不应该影响编辑器的显示效果</li>
          <li>请检查编辑器前后的元素样式是否保持一致</li>
        </ul>
      </div>

      <div class="test-section">
        <h2>外部应用元素 - 编辑器前 <span class="status-indicator status-pass">基准样式</span></h2>
        
        <div class="test-elements">
          <button class="test-button">测试按钮</button>
          <input type="text" class="test-input" placeholder="测试输入框" value="测试文本">
          <select class="test-dropdown">
            <option>选项 1</option>
            <option>选项 2</option>
            <option>选项 3</option>
          </select>
        </div>

        <div class="test-text">
          这是一段测试文本，用于检查字体、颜色、行高等样式是否受到编辑器影响。
          <strong>粗体文本</strong>、<em>斜体文本</em>、<code class="test-code">内联代码</code>。
        </div>

        <ul class="test-list">
          <li>无序列表项 1</li>
          <li>无序列表项 2</li>
          <li>无序列表项 3</li>
        </ul>

        <table class="test-table">
          <thead>
            <tr>
              <th>列标题 1</th>
              <th>列标题 2</th>
              <th>列标题 3</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>数据 1-1</td>
              <td>数据 1-2</td>
              <td>数据 1-3</td>
            </tr>
            <tr>
              <td>数据 2-1</td>
              <td>数据 2-2</td>
              <td>数据 2-3</td>
            </tr>
          </tbody>
        </table>

        <blockquote class="test-blockquote">
          这是一个测试引用块，用于检查引用样式是否受到编辑器影响。
        </blockquote>

        <pre class="test-code-block">
function testFunction() {
    console.log('这是测试代码块');
    return 'test';
}
        </pre>
      </div>

      <div class="editor-container">
        <h3>Geelato Lite Editor 测试区域</h3>
        <GeelatoLiteEditor
          v-model="editorContent"
          :toolbar="'full'"
          :show-toolbar="true"
          :editable="true"
          placeholder="请在此输入内容进行测试..."
          :min-height="'300px'"
        />
      </div>

      <div class="test-section">
        <h2>外部应用元素 - 编辑器后 <span class="status-indicator status-pass">对比样式</span></h2>
        
        <div class="test-elements">
          <button class="test-button">测试按钮</button>
          <input type="text" class="test-input" placeholder="测试输入框" value="测试文本">
          <select class="test-dropdown">
            <option>选项 1</option>
            <option>选项 2</option>
            <option>选项 3</option>
          </select>
        </div>

        <div class="test-text">
          这是一段测试文本，用于检查字体、颜色、行高等样式是否受到编辑器影响。
          <strong>粗体文本</strong>、<em>斜体文本</em>、<code class="test-code">内联代码</code>。
        </div>

        <ul class="test-list">
          <li>无序列表项 1</li>
          <li>无序列表项 2</li>
          <li>无序列表项 3</li>
        </ul>

        <table class="test-table">
          <thead>
            <tr>
              <th>列标题 1</th>
              <th>列标题 2</th>
              <th>列标题 3</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>数据 1-1</td>
              <td>数据 1-2</td>
              <td>数据 1-3</td>
            </tr>
            <tr>
              <td>数据 2-1</td>
              <td>数据 2-2</td>
              <td>数据 2-3</td>
            </tr>
          </tbody>
        </table>

        <blockquote class="test-blockquote">
          这是一个测试引用块，用于检查引用样式是否受到编辑器影响。
        </blockquote>

        <pre class="test-code-block">
function testFunction() {
    console.log('这是测试代码块');
    return 'test';
}
        </pre>
      </div>

      <div class="test-section">
        <h2>测试结果</h2>
        <div class="test-results">
          <p>请检查以下项目：</p>
          <ul>
            <li>✅ 编辑器前后的按钮样式是否一致</li>
            <li>✅ 编辑器前后的输入框样式是否一致</li>
            <li>✅ 编辑器前后的下拉框样式是否一致</li>
            <li>✅ 编辑器前后的文本样式是否一致</li>
            <li>✅ 编辑器前后的列表样式是否一致</li>
            <li>✅ 编辑器前后的表格样式是否一致</li>
            <li>✅ 编辑器前后的引用块样式是否一致</li>
            <li>✅ 编辑器前后的代码块样式是否一致</li>
            <li>✅ 编辑器内部样式是否正常显示</li>
            <li>✅ 编辑器工具栏是否正常工作</li>
          </ul>
          
          <div class="theme-test">
            <h4>主题测试</h4>
            <button @click="toggleTheme" class="theme-toggle-btn">
              切换到{{ isDark ? '亮色' : '暗色' }}主题
            </button>
            <p>当前主题: {{ isDark ? '暗色' : '亮色' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import GeelatoLiteEditor from './components/GeelatoLiteEditor.vue'

const editorContent = ref(`
# 样式隔离测试

这是一个用于测试**样式隔离**效果的编辑器内容。

## 测试内容

1. **粗体文本**
2. *斜体文本*
3. \`内联代码\`

### 代码块测试

\`\`\`javascript
function testStyleIsolation() {
  console.log('测试样式隔离');
  return true;
}
\`\`\`

### 列表测试

- 无序列表项 1
- 无序列表项 2
- 无序列表项 3

### 引用测试

> 这是一个引用块，用于测试编辑器内的样式是否正常显示。

### 表格测试

| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 数据1 | 数据2 | 数据3 |
| 数据4 | 数据5 | 数据6 |

请测试工具栏功能，确保所有按钮都能正常工作。
`)

const isDark = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
}
</script>

<style scoped>
/* 外部应用的样式 - 用于测试是否被编辑器污染 */
.test-isolation-page {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 20px;
  background-color: #f0f0f0;
  color: #333;
}

.external-container {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.external-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  margin: -20px -20px 20px -20px;
  border-radius: 8px 8px 0 0;
}

.external-header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.test-section {
  margin: 30px 0;
  padding: 20px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  background: #fafafa;
}

.test-section h2 {
  color: #444;
  margin-top: 0;
  font-size: 18px;
  border-bottom: 2px solid #ddd;
  padding-bottom: 10px;
}

.test-elements {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin: 20px 0;
}

.test-button {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.test-button:hover {
  background: #0056b3;
}

.test-input {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.test-dropdown {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  font-size: 14px;
}

.test-text {
  font-size: 14px;
  line-height: 1.5;
  color: #555;
}

.test-list {
  margin: 10px 0;
  padding-left: 20px;
}

.test-list li {
  margin: 5px 0;
  color: #666;
}

.test-table {
  width: 100%;
  border-collapse: collapse;
  margin: 15px 0;
}

.test-table th,
.test-table td {
  border: 1px solid #ddd;
  padding: 8px 12px;
  text-align: left;
}

.test-table th {
  background: #f5f5f5;
  font-weight: 600;
}

.test-code {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  padding: 2px 6px;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  color: #495057;
}

.test-code-block {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  padding: 10px;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  color: #495057;
  overflow-x: auto;
}

.test-blockquote {
  border-left: 4px solid #007bff;
  background: #f8f9fa;
  margin: 15px 0;
  padding: 10px 15px;
  font-style: italic;
  color: #6c757d;
}

.editor-container {
  margin: 30px 0;
  padding: 20px;
  border: 3px solid #28a745;
  border-radius: 8px;
  background: white;
}

.editor-container h3 {
  color: #28a745;
  margin-top: 0;
  font-size: 16px;
}

.status-indicator {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  margin-left: 10px;
}

.status-pass {
  background: #d4edda;
  color: #155724;
}

.status-fail {
  background: #f8d7da;
  color: #721c24;
}

.instructions {
  background: #e7f3ff;
  border: 1px solid #b3d9ff;
  border-radius: 6px;
  padding: 15px;
  margin: 20px 0;
}

.instructions h4 {
  color: #0066cc;
  margin-top: 0;
}

.instructions ul {
  margin: 10px 0;
  padding-left: 20px;
}

.instructions li {
  margin: 5px 0;
  color: #333;
}

.test-results {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 6px;
  border: 1px solid #dee2e6;
}

.test-results ul {
  margin: 10px 0;
  padding-left: 20px;
}

.test-results li {
  margin: 5px 0;
  color: #495057;
}

.theme-test {
  margin-top: 20px;
  padding: 15px;
  background: #e9ecef;
  border-radius: 6px;
}

.theme-test h4 {
  margin-top: 0;
  color: #495057;
}

.theme-toggle-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-right: 10px;
}

.theme-toggle-btn:hover {
  background: #5a6268;
}

/* 暗色主题适配 */
:global(.dark) .test-isolation-page {
  background-color: #1a1a1a;
  color: #e0e0e0;
}

:global(.dark) .external-container {
  background: #2d2d2d;
  color: #e0e0e0;
}

:global(.dark) .test-section {
  background: #3a3a3a;
  border-color: #555;
}

:global(.dark) .test-section h2 {
  color: #e0e0e0;
  border-bottom-color: #555;
}

:global(.dark) .test-button {
  background: #0d6efd;
}

:global(.dark) .test-button:hover {
  background: #0b5ed7;
}

:global(.dark) .test-input,
:global(.dark) .test-dropdown {
  background: #495057;
  border-color: #6c757d;
  color: #e0e0e0;
}

:global(.dark) .test-table th {
  background: #495057;
  color: #e0e0e0;
}

:global(.dark) .test-table td,
:global(.dark) .test-table th {
  border-color: #6c757d;
}

:global(.dark) .test-code,
:global(.dark) .test-code-block {
  background: #495057;
  border-color: #6c757d;
  color: #e0e0e0;
}

:global(.dark) .test-blockquote {
  background: #495057;
  border-left-color: #0d6efd;
  color: #adb5bd;
}

:global(.dark) .instructions {
  background: #1e3a5f;
  border-color: #2c5aa0;
}

:global(.dark) .instructions h4 {
  color: #66b3ff;
}

:global(.dark) .test-results {
  background: #495057;
  border-color: #6c757d;
}

:global(.dark) .theme-test {
  background: #495057;
}

:global(.dark) .theme-test h4 {
  color: #e0e0e0;
}
</style>