<template>
  <div id="userInformationPage">
    <a-form
      :model="form"
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
          <a-input v-model:value="form.username" style="width: 200px">{{form.username}} </a-input>
        </a-form-item>
        <span style="margin-left: auto">
          <a-form-item
            label="性别"
            name="gender"
            :rules="[{ required: true, message: '请选择你的性别!' }]"
          >
        <a-select v-model:value="form.gender" placeholder="请选择你的性别" style="width: 200px">
          <a-select-option value="0">男</a-select-option>
          <a-select-option value="1">女</a-select-option>
        </a-select>
      </a-form-item>
        </span>

      </div>

      <a-form-item
        label="身份证号"
        name="idNumber"
        :rules="[{ required: true, message: '请输入身份证号!' }]"
      >
        <a-input v-model:value="form.idNumber">{{form.idNumber ?? "请输入身份证号!"}} </a-input>
      </a-form-item>

      <a-form-item
        label="账号"
        name="userAccount"
        :rules="[{ required: true, message: '请输入账号!' }]"
      >
        <a-input :disabled="true" v-model:value="form.userAccount">{{form.userAccount ?? "请输入账号!"}} </a-input>
      </a-form-item>


      <a-form-item
        label="年龄"
        name="age"
        :rules="[{ required: true, message: '请输入年龄!' }]"
      >
        <a-input v-model:value="form.age">
          {{form.age}}
        </a-input>
      </a-form-item>
      <a-form-item
        label="体重(kg)"
        name="weight"
        :rules="[{ required: true, message: '请输入体重(kg)!' }]"
      >
        <a-input v-model:value="form.weight">
          {{form.weight}}
        </a-input>
      </a-form-item>
      <a-form-item
        label="身高(cm)"
        name="height"
        :rules="[{ required: true, message: '请输入身高(cm)!' }]"
      >
        <a-input v-model:value="form.height">
          {{form.height}}
        </a-input>
      </a-form-item>
      <a-form-item
        label="血压高压(mmHg)"
        name="highBloodPressure"
        :rules="[{ required: true, message: '请输入血压高压(mmHg)!' }]"
      >
        <a-input v-model:value="form.highBloodPressure">
          {{form.highBloodPressure ?? "请输入血压高压(mmHg)!"}}
        </a-input>
      </a-form-item>
      <a-form-item
        label="血压低压(mmHg)"
        name="lowBloodPressure"
        :rules="[{ required: true, message: '请输入血压低压(mmHg)!' }]"
      >
        <a-input v-model:value="form.lowBloodPressure">
          {{form.lowBloodPressure ?? "请输入血压低压(mmHg)!"}}
        </a-input>
      </a-form-item>
      <a-form-item
        label="联系电话"
        name="phone"
        :rules="[{ required: true, message: '请输入联系电话!' }]"
      >
        <a-input v-model:value="form.phone">
          {{form.phone ?? "请输入联系电话!"}}
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
//   <a-input-password v-model:value="form.userPassword">
//   {{form.userPassword ?? "请输入密码!"}}
// </a-input-password>
// </a-form-item>

import { reactive, computed, ref, onMounted, toRefs } from "vue";
import myAxios from "@/plugins/myAxios";
import { FormInstance, message } from "ant-design-vue";
import { useRouter } from "vue-router";
import {UserType } from "@/models/user";
import { getCurrentUser } from "@/services/user";
import { InformationType } from "@/models/elderHelth";

const loginUser = ref<UserType>();
const information = ref<InformationType>();
const gender = ref();
//抽象出一个对象
const form = ref({
  username: "",
  gender: "",
  idNumber: "",
  userAccount: "",
  userPassword: "",
  age: undefined,
  weight: undefined,
  height: undefined,
  highBloodPressure: undefined,
  lowBloodPressure: undefined,
  phone: "",

})


onMounted(async () => {
  //获取当前用户
  loginUser.value = await getCurrentUser();

  console.log("用户:",loginUser.value);


  if (loginUser.value) {
    if (loginUser.value?.gender === 0) {
      gender.value = "男";
    } else gender.value = "女";


    const res = await myAxios.get("/user/information",{
      params: {
        userId: loginUser.value.id,
      }
    });
    if (res.code === 0) {
      information.value = res.data;
      console.log("信息:",information.value);
      if (information.value) {
        information.value.userId = loginUser.value.id;
      }
    }

    const Data = ref({
      username: loginUser.value?.username,
      gender: loginUser.value?.gender,
      idNumber: loginUser.value?.idNumber,
      userAccount: loginUser.value?.userAccount,
      userPassword: loginUser.value?.userPassword,
      phone: loginUser.value?.phone,
      age: loginUser.value?.age,
      weight: information.value?.weight,
      height: information.value?.height,
      highBloodPressure: information.value?.highBloodPressure,
      lowBloodPressure: information.value?.lowBloodPressure,
    })
    form.value = Data.value;
    if (form.value?.gender === '0') {
      form.value.gender = '男';
    } else {
      form.value.gender = '女';
    }

  }
})

/**
 * 提交表单
 */
const handleSubmit = async () => {

  if(loginUser.value) {
    loginUser.value.gender = Number(form.value.gender);

    loginUser.value.username = String(form.value.username);
    loginUser.value.userAccount = String(form.value.userAccount);
    loginUser.value.userPassword = String(form.value.userPassword);
    loginUser.value.age = Number(form.value.age);
    loginUser.value.idNumber = String(form.value.idNumber);
    loginUser.value.phone = String(form.value.phone);
  }

  if (information.value) {
    information.value.weight = Number(form.value.weight);
    information.value.height = Number(form.value.height);
    information.value.highBloodPressure = Number(form.value.highBloodPressure);
    information.value.lowBloodPressure = Number(form.value.lowBloodPressure);
  }

  const res1 = await myAxios.post("/user/update", loginUser.value);
  const res2 = await myAxios.post("/user/update/information",information.value);
  if (res1.code === 0 && res2.code === 0) {
    message.success("修改成功!");
  } else {
    message.error(res1.description + "\n" + res2.description);
  }
};
</script>

<style scoped>
#userInformationPage {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
}

#userInformationPage .login-form {
  max-width: 800px;
  width: 100%;
  padding: 10px;
  border: 2px solid #d9d9d9;
  border-radius: 4px;
}

#userInformationPage .login-form-button {
  width: 100%;
}
</style>
