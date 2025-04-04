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
        <a href="/user/register">立即注册!</a>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from "vue";
interface FormState {
  userAccount: string;
  userPassword: string;
  role: number;
  remember: boolean;
}

const formState = reactive<FormState>({
  userAccount: "",
  userPassword: "",
  role: undefined,
  remember: true,
});
/**
 * 提交表单
 */
const handleSubmit = async () => {
  console.log(formState.role);
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
