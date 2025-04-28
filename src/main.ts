import { createApp } from "vue";
import App from "./App.vue";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";
import router from "@/config/route";
import VueMarkdownEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
import Prism from 'prismjs';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import VMdEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import '@kangc/v-md-editor/lib/theme/style/github.css';
import hljs from 'highlight.js';
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
// createAlignPlugin(),githubTheme
VueMarkdownEditor.use(vuepressTheme, {
  Prism,
});
VMdEditor.use(githubTheme, {
  Hljs: hljs,
});
VMdPreview.use(vuepressTheme, {
  Hljs: hljs,
  Prism: Prism,
  config: {
    toc: {
      includeLevel: [3, 4],
    },
  },
});
const app = createApp(App);
app.use(VMdPreview).use(VMdEditor).use(VueMarkdownEditor).use(router).use(Antd).mount("#app");




