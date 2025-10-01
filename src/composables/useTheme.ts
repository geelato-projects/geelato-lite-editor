import { ref, computed, watch, onMounted } from 'vue'
import type { ThemeType } from '../types'

// 主题组合式函数
export function useTheme(initialTheme: ThemeType = 'light') {
  const currentTheme = ref<ThemeType>(initialTheme)
  const systemTheme = ref<'light' | 'dark'>('light')

  // 检测系统主题
  const detectSystemTheme = () => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      systemTheme.value = mediaQuery.matches ? 'dark' : 'light'
      return mediaQuery
    }
    return null
  }

  // 计算实际主题
  const actualTheme = computed(() => {
    if (currentTheme.value === 'auto') {
      return systemTheme.value
    }
    return currentTheme.value
  })

  // 主题类名
  const themeClass = computed(() => {
    return `gl-theme-${actualTheme.value}`
  })

  // 是否为暗色主题
  const isDark = computed(() => {
    return actualTheme.value === 'dark'
  })

  // 设置主题
  const setTheme = (theme: ThemeType) => {
    currentTheme.value = theme
    updateDocumentTheme()
  }

  // 切换主题
  const toggleTheme = () => {
    if (currentTheme.value === 'light') {
      setTheme('dark')
    } else if (currentTheme.value === 'dark') {
      setTheme('light')
    } else {
      // auto 模式下切换到相反的主题
      setTheme(systemTheme.value === 'light' ? 'dark' : 'light')
    }
  }

  // 获取主题相关的 CSS 变量
  const getThemeVariables = () => {
    const variables: Record<string, string> = {}
    
    if (actualTheme.value === 'dark') {
      variables['--gl-bg-color'] = '#1a1a1a'
      variables['--gl-text-color'] = '#ffffff'
      variables['--gl-border-color'] = '#404040'
      variables['--gl-hover-bg'] = '#2a2a2a'
      variables['--gl-active-bg'] = '#3a3a3a'
      variables['--gl-toolbar-bg'] = '#2d2d2d'
      variables['--gl-editor-bg'] = '#1e1e1e'
      variables['--gl-selection-bg'] = '#264f78'
    } else {
      variables['--gl-bg-color'] = '#ffffff'
      variables['--gl-text-color'] = '#333333'
      variables['--gl-border-color'] = '#e0e0e0'
      variables['--gl-hover-bg'] = '#f5f5f5'
      variables['--gl-active-bg'] = '#e8e8e8'
      variables['--gl-toolbar-bg'] = '#fafafa'
      variables['--gl-editor-bg'] = '#ffffff'
      variables['--gl-selection-bg'] = '#b3d4fc'
    }
    
    return variables
  }

  // 应用主题变量到根元素
  const applyThemeToRoot = () => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement
      const variables = getThemeVariables()
      Object.entries(variables).forEach(([key, value]) => {
        root.style.setProperty(key, value)
      })
    }
  }

  // 更新文档主题
  const updateDocumentTheme = () => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement
      
      // 移除所有主题类
      root.classList.remove('gl-theme-light', 'gl-theme-dark')
      
      // 添加当前主题类
      root.classList.add(themeClass.value)
      
      // 设置 CSS 变量
      if (actualTheme.value === 'dark') {
        root.style.setProperty('--gl-color-scheme', 'dark')
      } else {
        root.style.setProperty('--gl-color-scheme', 'light')
      }
      
      // 应用主题变量
      applyThemeToRoot()
    }
  }

  // 监听系统主题变化
  const setupSystemThemeListener = () => {
    const mediaQuery = detectSystemTheme()
    if (mediaQuery) {
      const handleChange = (e: MediaQueryListEvent) => {
        systemTheme.value = e.matches ? 'dark' : 'light'
      }
      
      // 现代浏览器
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
      }
      // 旧版浏览器
      else if (mediaQuery.addListener) {
        mediaQuery.addListener(handleChange)
        return () => mediaQuery.removeListener(handleChange)
      }
    }
    return () => {}
  }

  // 监听主题变化
  watch(
    [currentTheme, systemTheme],
    () => {
      updateDocumentTheme()
    },
    { immediate: true }
  )

  // 组件挂载时设置监听器
  onMounted(() => {
    const cleanup = setupSystemThemeListener()
    
    // 返回清理函数
    return cleanup
  })

  // 应用主题变量到元素
  const applyThemeVariables = (element: HTMLElement) => {
    const variables = getThemeVariables()
    Object.entries(variables).forEach(([key, value]) => {
      element.style.setProperty(key, value)
    })
  }

  return {
    currentTheme,
    systemTheme,
    actualTheme,
    themeClass,
    isDark,
    setTheme,
    toggleTheme,
    getThemeVariables,
    applyThemeVariables,
  }
}