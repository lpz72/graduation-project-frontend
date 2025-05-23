/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@kangc/v-md-editor/lib/theme/vuepress.js';
declare module 'prismjs';
declare module '@kangc/v-md-editor';
declare module '@kangc/v-md-editor/lib/theme/github.js';
declare module '@kangc/v-md-editor/lib/plugins/align';
declare module '@kangc/v-md-editor/lib/preview';