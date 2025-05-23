import axios from "axios";
import { getCurrentUser } from "@/services/user";

const isDev = process.env.NODE_ENV === "development";

const myAxios = axios.create({
  baseURL: isDev
    ? "http://localhost:8080/api"
    : "http://friends-backend.project-learn.site/api",
});
//前端每次向后端发送请求时，都携带上凭证，即cookie
// myAxios.defaults.withCredentials = true;
myAxios.defaults.withCredentials = true;
// 添加请求拦截器
myAxios.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    console.log("我要发请求了");
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
myAxios.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    //如果没登录，则跳转到登录页,登录后跳转到之前的页面
    const redirectUrl = window.location.href;
    const pathname = window.location.pathname;
    if (response.data.code === 40100 && pathname !== '/home' && pathname !== '/news' && pathname !== '/activities') {
      window.location.href = "/?redirect=" + redirectUrl;
    }

    console.log("我收到你的响应了", response);
    return response.data;
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

export default myAxios;
