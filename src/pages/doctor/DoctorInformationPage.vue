<template>
  <div id="nurseInformationPage">
    <!-- 必须先声明loginUser，否则vue不知道loginUser是什么  -->
    <a-form
      v-if="loginUser"
      :model="loginUser"
      name="normal_login"
      class="login-form"
      @finish="handleSubmit"
    >
      <div style="display: flex">
        <a-form-item
          label="姓名"
          name="username"
          :rules="[{ required: true, message: '请输入姓名!' }]"
        >
          <a-input v-model:value="loginUser.username" style="width: 200px">{{loginUser.username}} </a-input>
        </a-form-item>
        <span style="margin-left: auto">
          <a-form-item
            label="性别"
            name="gender"
            :rules="[{ required: true, message: '请选择你的性别!' }]"
          >
          <a-select
            v-model:value="loginUser.gender"
            placeholder="请选择你的性别"
            style="width: 200px"
            :options="gender"
          />
         </a-form-item>
        </span>
      </div>

      <a-form-item
        label="身份证号"
        name="idNumber"
        :rules="[{ required: true, message: '请输入身份证号!' }]"
      >
        <a-input v-model:value="loginUser.idNumber">{{loginUser.idNumber ?? "请输入身份证号!"}} </a-input>
      </a-form-item>

      <a-form-item
        label="账号"
        name="userAccount"
        :rules="[{ required: true, message: '请输入账号!' }]"
      >
        <a-input :disabled="true" v-model:value="loginUser.userAccount">{{loginUser.userAccount ?? "请输入账号!"}} </a-input>
      </a-form-item>

      <a-form-item
        label="年龄"
        name="age"
        :rules="[{ required: true, message: '请输入年龄!' }]"
      >
        <a-input v-model:value="loginUser.age">
          {{loginUser.age}}
        </a-input>
      </a-form-item>
      <a-form-item
        label="联系电话"
        name="phone"
        :rules="[{ required: true, message: '请输入联系电话!' }]"
      >
        <a-input v-model:value="loginUser.phone">
          {{loginUser.phone ?? "请输入联系电话!"}}
        </a-input>
      </a-form-item>
      <a-form-item
        label="科室"
        name="department"
        :rules="[{ required: true, message: '请选择科室!' }]"
      >
        <a-select
          v-model:value="loginUser.department"
          :size="size"
          placeholder="请选择科室"
          :options="options"
        />
      </a-form-item>
      <a-form-item
        label="职位"
        name="position"
      >
        <a-input v-model:value="loginUser.position">
          {{loginUser.position ?? "无"}}
        </a-input>
      </a-form-item>
      <a-form-item
        label="擅长"
        name="specialty"
      >
        <a-input v-model:value="loginUser.specialty">
          {{loginUser.specialty ?? "无"}}
        </a-input>
      </a-form-item>
      <a-form-item
        label="医院"
        name="hospital"
      >
        <a-input v-model:value="loginUser.hospital">
          {{loginUser.hospital ?? "社区医院"}}
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-button
          :disabled="disabled"
          type="primary"
          html-type="submit"
          class="login-form-button"
        >
          提交修改
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
// <a-form-item
// label="密码"
// name="userPassword"
// :rules="[{ required: true, message: '请输入密码!' }]"
//   >
//   <a-input-password v-model:value="loginUser.userPassword">
//   {{loginUser.userPassword ?? "请输入密码!"}}
// </a-input-password>
// </a-form-item>

import { ref, onMounted } from "vue";
import myAxios from "@/plugins/myAxios";
import { message, SelectProps } from "ant-design-vue";
import { UserType } from "@/models/user";
import { getCurrentUser } from "@/services/user";
const nowTotal = ref();
import { notification } from 'ant-design-vue';
import { draftStore } from "@/stores/draftStore";

const {load,save,clear} = draftStore();
const loginUser = ref<UserType>();
const options = ref<SelectProps['options']>([
  {value: '皮肤科',label: '皮肤科'},
  {value: '疼痛科',label: '疼痛科'},
]);
const gender = ref<SelectProps['options']>([
  {value: 0,label: '男'},
  {value: 1,label: '女'},
]);

onMounted(async () => {
  //获取当前用户
  loginUser.value = await getCurrentUser();
  await getEmergency();
  if (loginUser.value) {
    const userId = String(loginUser.value.id);
    const sum = load(userId);
    if (sum === null) {
      save(userId,nowTotal.value);
    } else {
      if(nowTotal.value > sum) {
        save(userId,nowTotal.value);
        notification['warning']({
          message: '紧急呼救',
          description:
            '有新的紧急呼救，请马上查看',
        });
      }
    }
  }

  // message.success(loginUser.value?.userPassword);
})

/**
 * 提交表单
 */
const handleSubmit = async () => {

  const res = await myAxios.post("/user/update", loginUser.value);
  if (res.code === 0) {
    message.success("修改成功!");
  } else {
    message.error(res.description);
  }
};

const getEmergency = async () => {
  const res = await myAxios.get("/emergency/list",{
    params: {
      workerId: loginUser.value?.id,
    }
  });
  if (res.code === 0) {
    nowTotal.value = res.data.length;
  } else {
    message.error("数据获取失败，请稍后重试");
  }
}
</script>

<style scoped>
#nurseInformationPage {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
}

#nurseInformationPage .login-form {
  max-width: 800px;
  width: 100%;
  padding: 10px;
  border: 2px solid #d9d9d9;
  border-radius: 4px;
}

#nurseInformationPage .login-form-button {
  width: 100%;
}
</style>
