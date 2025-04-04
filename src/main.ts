import { createApp } from "vue";
import App from "./App.vue";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";
import { createRouter, createWebHistory } from "vue-router";
import routes from "@/config/route";

const app = createApp(App);

const router = createRouter({
  //使用hash模式，即使用#区分不同页面
  //history: createWebHashHistory()
  //无#号
  history: createWebHistory(),
  routes,
});

app.use(Antd).use(router).use(router).mount("#app");
