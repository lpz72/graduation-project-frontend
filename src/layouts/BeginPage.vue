<template>
  <div class="home-container">
    <!-- 顶部导航栏 -->
    <a-layout-header class="header">
      <div class="logo">
        <img src="@/assets/logo.png" alt="健康之家" />
        <span>社区老人健康服务系统</span>
      </div>
      <a-menu
        v-model:selectedKeys="current"
        mode="horizontal"
        :items="menuItems"
        class="nav-menu"
        @click="doMenuClick"
      />
    </a-layout-header>

    <!-- 主内容区 -->
    <a-layout-content class="content">
      <div class="main-content">
          <router-view />
      </div>
    </a-layout-content>

    <!-- 底部信息 -->
    <a-layout-footer class="footer">
      <div class="footer-content">
        <div class="footer-links">
          <a>关于我们</a>
          <a>联系我们</a>
          <a>隐私政策</a>
          <a>服务条款</a>
        </div>
        <div class="copyright">
          © 2025 社区老人健康服务 版权所有
        </div>
      </div>
    </a-layout-footer>



  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from 'vue-router';

import { MenuProps } from "ant-design-vue";


const router = useRouter();

// 菜单项
const menuItems = ref<MenuProps['items']>([
  { key: '/home', label: '首页'},
  { key: '/activities', label: '健康活动' },
  { key: '/news', label: '健康资讯' },
]);
//当前选中的菜单
const current = ref<string[]>(['/']);
//监听路由变化，更新当前选中的菜单
router.afterEach((to, from, failure) => {
  current.value = [to.path];
});


onMounted(() => {
  const currentPath = window.location.pathname; // 获取当前路径
  // console.log("pathname:",currentPath);
  // console.log("href:",window.location.href);
  if (currentPath === '/home' || currentPath === '/activities' || currentPath === '/news') {
    router.push(currentPath); // 跳转到当前路径
  } else if (currentPath === '/') router.push('/home');

});

const doMenuClick = ({ key }: { key: string }) => {
  console.log(key);
  router.push({
    path: key,
  });
};

</script>

<style scoped>
.home-container {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 0 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.logo {
  display: flex;
  align-items: center;
}

.logo img {
  height: 40px;
  margin-right: 12px;
}

.logo span {
  font-size: 18px;
  font-weight: bold;
  color: #1890ff;
}

.nav-menu {
  line-height: 64px;
}

.content {
  flex: 1;
  padding: 20px;
  background: #f0f2f5;
}
/*
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 24px;
}*/

.main-content {
  max-width: 1300px;
  margin: 0 auto;
  display: flex;
  gap: 24px;
  max-height: calc(100vh - 150px); /* 限制高度 */
  overflow: auto; /* 添加滚动条 */
}

/*
.left-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
}*/



.captcha-input {
  display: flex;
  gap: 8px;
}

.footer {
  text-align: center;
  background: #fff;
  padding: 24px 0;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-links {
  margin-bottom: 16px;
}

.footer-links a {
  margin: 0 12px;
  color: rgba(0, 0, 0, 0.65);
}

.copyright {
  color: rgba(0, 0, 0, 0.45);
}
</style>

<!--<template>-->
<!--  <div id="userLoginPage">-->
<!--    <h2 class="title">社区老人健康服务系统</h2>-->
<!--    <a-form-->
<!--      :model="formState"-->
<!--      name="normal_login"-->
<!--      class="login-form"-->
<!--      @finish="handleSubmit"-->
<!--    >-->
<!--      <a-form-item-->
<!--        label="账号"-->
<!--        name="userAccount"-->
<!--        :rules="[{ required: true, message: '请输入账号!' }]"-->
<!--      >-->
<!--        <a-input v-model:value="formState.userAccount"> </a-input>-->
<!--      </a-form-item>-->

<!--      <a-form-item-->
<!--        label="密码"-->
<!--        name="userPassword"-->
<!--        :rules="[{ required: true, message: '请输入密码!' }]"-->
<!--      >-->
<!--        <a-input-password v-model:value="formState.userPassword">-->
<!--        </a-input-password>-->
<!--      </a-form-item>-->
<!--      <a-form-item-->
<!--        label="用户身份"-->
<!--        name="role"-->
<!--        :rules="[{ required: true, message: '请选择你的身份!' }]"-->
<!--      >-->
<!--        <a-select v-model:value="formState.role" placeholder="请选择你的身份">-->
<!--          <a-select-option value="0">管理员</a-select-option>-->
<!--          <a-select-option value="1">老人</a-select-option>-->
<!--          <a-select-option value="2">护士</a-select-option>-->
<!--          <a-select-option value="3">医生</a-select-option>-->
<!--        </a-select>-->
<!--      </a-form-item>-->

<!--      <a-form-item>-->
<!--        <a-form-item name="remember" no-style>-->
<!--          <a-checkbox v-model:checked="formState.remember">记住我</a-checkbox>-->
<!--        </a-form-item>-->
<!--        <a class="login-form-forgot" href="">忘记密码</a>-->
<!--      </a-form-item>-->

<!--      <a-form-item>-->
<!--        <a-button-->
<!--          :disabled="disabled"-->
<!--          type="primary"-->
<!--          html-type="submit"-->
<!--          class="login-form-button"-->
<!--        >-->
<!--          登 录-->
<!--        </a-button>-->
<!--        <a href="/register">立即注册!</a>-->
<!--      </a-form-item>-->
<!--    </a-form>-->
<!--  </div>-->
<!--</template>-->

<!--<script setup lang="ts">-->
<!--import { reactive, computed } from "vue";-->
<!--import myAxios from "@/plugins/myAxios";-->
<!--import { message } from "ant-design-vue";-->
<!--import { useRouter } from "vue-router";-->
<!--interface FormState {-->
<!--  userAccount: string;-->
<!--  userPassword: string;-->
<!--  role: string;-->
<!--  remember: boolean;-->
<!--}-->

<!--const formState = reactive<FormState>({-->
<!--  userAccount: "",-->
<!--  userPassword: "",-->
<!--  role: "",-->
<!--  remember: true,-->
<!--});-->
<!--/**-->
<!-- * 提交表单-->
<!-- */-->
<!--const router = useRouter();-->
<!--const handleSubmit = async () => {-->
<!--  // console.log(formState.role.valueOf());-->
<!--  // console.log(formState);-->
<!--    const res = await myAxios.post("/user/login",-->
<!--      {-->
<!--        userAccount: formState.userAccount,-->
<!--        userPassword: formState.userPassword,-->
<!--        userRole: Number(formState.role),-->
<!--      });-->
<!--    if (res.code === 0 && res.data) {-->
<!--      message.success("登录成功!");-->
<!--      // window.location.href = "/register";-->
<!--      let routePath;-->
<!--      if (formState.role === "0") routePath = "/admin/users";-->
<!--      else if (formState.role === "1") routePath = "/user/information";-->
<!--      else if (formState.role === "2") routePath = "/nurse/information";-->
<!--      else if (formState.role === "3") routePath = "/doctor/information";-->
<!--      // console.log("准备跳转到:", routePath); // 检查 routePath 是否正确-->
<!--      await router.push({-->
<!--        path: routePath,-->
<!--        replace: true,-->
<!--      });-->
<!--      // console.log("跳转完成"); // 检查是否执行到这里-->
<!--      // console.log(routePath);-->
<!--    } else {-->
<!--      // console.log(res.code);-->
<!--      message.error(res.description);-->
<!--    }-->
<!--};-->
<!--</script>-->

<!--<style scoped>-->
<!--#userLoginPage {-->
<!--  display: flex;-->
<!--  flex-direction: column; /* 垂直排列子元素 */-->
<!--  justify-content: center; /* 水平居中 */-->
<!--  align-items: center; /* 垂直居中 */-->
<!--  margin-top: 100px;-->
<!--}-->

<!--#userLoginPage .title {-->
<!--  margin-bottom: 16px;-->
<!--}-->

<!--#userLoginPage .login-form {-->
<!--  max-width: 300px;-->
<!--}-->

<!--#userLoginPage .login-form-forgot {-->
<!--  float: right;-->
<!--}-->

<!--#userLoginPage .login-form-button {-->
<!--  width: 100%;-->
<!--}-->
<!--</style>-->
