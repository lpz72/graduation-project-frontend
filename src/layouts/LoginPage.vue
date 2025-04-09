<template>
  <div id="userLoginPage">
    <h2 class="title">社区老人健康服务系统</h2>
    <a-form
      :model="formState"
      name="normal_login"
      class="login-form"
      @finish="handleSubmit"
    >
      <a-form-item
        label="账号"
        name="userAccount"
        :rules="[{ required: true, message: '请输入账号!' }]"
      >
        <a-input v-model:value="formState.userAccount"> </a-input>
      </a-form-item>

      <a-form-item
        label="密码"
        name="userPassword"
        :rules="[{ required: true, message: '请输入密码!' }]"
      >
        <a-input-password v-model:value="formState.userPassword">
        </a-input-password>
      </a-form-item>
      <a-form-item
        label="用户身份"
        name="role"
        :rules="[{ required: true, message: '请选择你的身份!' }]"
      >
        <a-select v-model:value="formState.role" placeholder="请选择你的身份">
          <a-select-option value="0">管理员</a-select-option>
          <a-select-option value="1">老人</a-select-option>
          <a-select-option value="2">护士</a-select-option>
          <a-select-option value="3">医生</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item>
        <a-form-item name="remember" no-style>
          <a-checkbox v-model:checked="formState.remember">记住我</a-checkbox>
        </a-form-item>
        <a class="login-form-forgot" href="">忘记密码</a>
      </a-form-item>

      <a-form-item>
        <a-button
          :disabled="disabled"
          type="primary"
          html-type="submit"
          class="login-form-button"
        >
          登 录
        </a-button>
        <a href="/register">立即注册!</a>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from "vue";
import myAxios from "@/plugins/myAxios";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
interface FormState {
  userAccount: string;
  userPassword: string;
  role: string;
  remember: boolean;
}

const formState = reactive<FormState>({
  userAccount: "",
  userPassword: "",
  role: "",
  remember: true,
});
/**
 * 提交表单
 */
const router = useRouter();
const handleSubmit = async () => {
  // console.log(formState.role.valueOf());
  // console.log(formState);
    const res = await myAxios.post("/user/login",
      {
        userAccount: formState.userAccount,
        userPassword: formState.userPassword,
        userRole: Number(formState.role),
      });
    if (res.code === 0 && res.data) {
      message.success("登录成功!");
      // window.location.href = "/register";
      let routePath;
      if (formState.role === "0") routePath = "/admin/information";
      else if (formState.role === "1") routePath = "/user/information";
      else if (formState.role === "2") routePath = "/nurse/information";
      else if (formState.role === "3") routePath = "/doctor/information";
      // console.log("准备跳转到:", routePath); // 检查 routePath 是否正确
      await router.push({
        path: routePath,
        replace: true,
      });
      // console.log("跳转完成"); // 检查是否执行到这里
      // console.log(routePath);
    } else {
      // console.log(res.code);
      message.error(res.description);
    }
};
</script>

<style scoped>
#userLoginPage {
  display: flex;
  flex-direction: column; /* 垂直排列子元素 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  margin-top: 100px;
}

#userLoginPage .title {
  margin-bottom: 16px;
}

#userLoginPage .login-form {
  max-width: 300px;
}

#userLoginPage .login-form-forgot {
  float: right;
}

#userLoginPage .login-form-button {
  width: 100%;
}
</style>
