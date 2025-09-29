/**
 * 边框样式应用工具
 * 用于将data-border属性动态转换为内联样式
 */

export interface BorderStyleOptions {
  selector?: string;
  observeChanges?: boolean;
}

/**
 * 应用边框样式到指定元素
 */
export function applyBorderStyles(element: Element): void {
  const borderAttributes = [
    'data-border',
    'data-border-top',
    'data-border-bottom',
    'data-border-left',
    'data-border-right'
  ];

  let hasChanges = false;
  const styles: string[] = [];
  
  // 获取现有的内联样式
  const existingStyle = element.getAttribute('style') || '';
  const existingStyles = existingStyle.split(';').filter(s => s.trim() && !s.includes('border'));

  borderAttributes.forEach(attr => {
    const borderValue = element.getAttribute(attr);
    if (borderValue && borderValue !== 'none') {
      const cssProp = attr.replace('data-', '');
      styles.push(`${cssProp}: ${borderValue}`);
      hasChanges = true;
    }
  });

  if (hasChanges) {
    // 合并现有样式和新的边框样式
    const allStyles = [...existingStyles, ...styles].filter(s => s.trim());
    element.setAttribute('style', allStyles.join('; '));
  }
}

/**
 * 批量应用边框样式到多个元素
 */
export function applyBorderStylesToElements(
  elements: NodeListOf<Element> | Element[],
  options: BorderStyleOptions = {}
): void {
  elements.forEach(element => {
    applyBorderStyles(element);
  });
}

/**
 * 监听DOM变化并自动应用边框样式
 */
export function createBorderStyleObserver(
  container: Element,
  options: BorderStyleOptions = {}
): MutationObserver {
  const { selector = 'table td, table th' } = options;

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && 
          mutation.attributeName?.startsWith('data-border')) {
        const target = mutation.target as Element;
        if (target.matches(selector)) {
          applyBorderStyles(target);
        }
      } else if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            // 检查新添加的元素
            if (element.matches(selector)) {
              applyBorderStyles(element);
            }
            // 检查新添加元素的子元素
            const childElements = element.querySelectorAll(selector);
            applyBorderStylesToElements(childElements);
          }
        });
      }
    });
  });

  observer.observe(container, {
    attributes: true,
    attributeFilter: ['data-border', 'data-border-top', 'data-border-bottom', 'data-border-left', 'data-border-right'],
    childList: true,
    subtree: true
  });

  // 初始应用
  const existingElements = container.querySelectorAll(selector);
  applyBorderStylesToElements(existingElements);

  return observer;
}

/**
 * 初始化边框样式应用器
 */
export function initBorderStyleApplier(editorElement: Element): MutationObserver {
  return createBorderStyleObserver(editorElement, {
    selector: '.ProseMirror table td, .ProseMirror table th'
  });
}