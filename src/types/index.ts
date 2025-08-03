/**
 * Geelato Lite Editor 类型定义入口文件
 * @description 导出所有编辑器相关的类型定义
 */

// 导出所有类型定义
export * from './editor'
export * from './content'

// 重新导出重命名的类型
export type { GeelatoEditorState as EditorState } from './editor'

// 从extensions导出ExtensionConfig
export type { ExtensionConfig } from '../extensions'

/**
 * 基础组件接口
 * @description 所有组件的基础属性
 * @example
 * ```typescript
 * const component: BaseComponent = {
 *   class: 'my-component',
 *   style: { color: 'red' }
 * }
 * ```
 */
export interface BaseComponent {
  /** 
   * 自定义类名
   * @example 'my-component custom-style'
   */
  class?: string
  /** 
   * 自定义样式
   * @example { color: 'red' } | 'color: red;'
   */
  style?: string | Record<string, any>
}

/**
 * 事件处理器类型
 * @description 通用事件处理函数类型
 * @template T 事件类型，默认为 Event
 * @example
 * ```typescript
 * const clickHandler: EventHandler<MouseEvent> = (event) => {
 *   console.log('clicked', event.target)
 * }
 * ```
 */
export type EventHandler<T = Event> = (event: T) => void

/**
 * 异步函数类型
 * @description 返回 Promise 的函数类型
 * @template T 返回值类型
 * @example
 * ```typescript
 * const fetchData: AsyncFunction<string> = async () => {
 *   return await fetch('/api/data').then(res => res.text())
 * }
 * ```
 */
export type AsyncFunction<T = any> = (...args: any[]) => Promise<T>

/**
 * 可选异步函数类型
 * @description 可以返回值或 Promise 的函数类型
 * @template T 返回值类型
 * @example
 * ```typescript
 * const maybeAsync: MaybeAsyncFunction<string> = (sync: boolean) => {
 *   return sync ? 'immediate' : Promise.resolve('delayed')
 * }
 * ```
 */
export type MaybeAsyncFunction<T = any> = (...args: any[]) => T | Promise<T>

/**
 * 深度部分类型
 * @description 将类型的所有属性（包括嵌套对象）设为可选
 * @template T 源类型
 * @example
 * ```typescript
 * interface Config {
 *   api: { url: string; timeout: number }
 *   ui: { theme: string }
 * }
 * type PartialConfig = DeepPartial<Config>
 * // { api?: { url?: string; timeout?: number }; ui?: { theme?: string } }
 * ```
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

/**
 * 深度只读类型
 * @description 将类型的所有属性（包括嵌套对象）设为只读
 * @template T 源类型
 * @example
 * ```typescript
 * interface Config {
 *   api: { url: string; timeout: number }
 * }
 * type ReadonlyConfig = DeepReadonly<Config>
 * // { readonly api: { readonly url: string; readonly timeout: number } }
 * ```
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}

/**
 * 函数参数类型提取
 * @description 提取函数的参数类型
 * @template T 函数类型
 * @example
 * ```typescript
 * function example(a: string, b: number): void {}
 * type Params = Parameters<typeof example> // [string, number]
 * ```
 */
export type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never

/**
 * 函数返回值类型提取
 * @description 提取函数的返回值类型
 * @template T 函数类型
 * @example
 * ```typescript
 * function example(): string { return 'hello' }
 * type Return = ReturnType<typeof example> // string
 * ```
 */
export type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any