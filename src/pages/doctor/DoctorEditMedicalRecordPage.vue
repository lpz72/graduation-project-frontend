<template>
  <div class="doctor-health-report" v-if="form != undefined">

    <!-- 基本信息区 -->
    <a-card title="基本信息" class="section">
      <a-form
        layout="horizontal"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 10 }"
        :rules="rules"
        ref="formRef"
        :model="form">
        <a-row :gutter="2">
          <a-col :span="8">
            <a-form-item
              label="患者姓名"
              name="username"
            >
              <a-input v-model:value="form.username"  disabled/>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="身份证号"
              name="idNumber"
            >
              <a-input v-model:value="form.idNumber"  disabled/>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="性别"
              name="gender"
            >
              <a-select
                v-model:value="form.gender"
                placeholder="请选择患者性别"
                style="width: 200px"
                :options="gender"
                disabled
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="2">
          <a-col :span="8">
            <a-form-item
              label="年龄"
              name="age"
            >
              <a-input v-model:value="form.age"  style="width: 100%" disabled />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="手机号"
              name="phone"
            >
              <a-input v-model:value="form.phone" disabled/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>

    <!-- 结论和建议 -->
    <a-card title="就诊结果" class="section">
      <a-form
        v-if="loginUser"
        layout="horizontal"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 18 }"
        :rules="rules"
        ref="formRef2"
        :model="form"
      >
        <a-form-item
          label="就诊医生"
          name="doctor"
        >
          <a-input :disabled="true" v-model:value="loginUser.username">{{loginUser.username}} </a-input>
        </a-form-item>
        <a-form-item label="护理护士">
          <a-select
            v-model:value="form.nurseId"
            show-search
            :filter-option="filterOption"
            style="width: 100%"
            placeholder="选择护理护士"
            :options="nurses"
          ></a-select>
        </a-form-item>
        <a-form-item
          label="就诊科室"
          name="department"
        >
          <a-select
            v-model:value="form.department"
            show-search
            :filter-option="filterOption"
            style="width: 100%"
            placeholder="选择就诊科室"
            :options="departments"
          ></a-select>
        </a-form-item>
        <a-form-item
          label="病情描述"
          name="stateOfIllness"
        >
          <a-textarea v-model:value="form.stateOfIllness" :rows="4" placeholder="输入病情描述" />
        </a-form-item>
      </a-form>
    </a-card>

    <!-- 操作按钮 -->
    <div class="action-buttons">
      <a-button type="primary" @click="submitReport" :loading="submitting" style="margin-left: 16px">提交报告</a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { message, SelectProps } from "ant-design-vue";
import myAxios from "@/plugins/myAxios";
import { HealthRecordType } from "@/models/healthRecord";
import { draftStore } from "@/stores/draftStore";
import { SaveOutlined } from "@ant-design/icons-vue";
import { UserType } from "@/models/user";
import { getCurrentUser } from "@/services/user";
import { departments } from "@/constants/departments";
import { useRoute } from "vue-router";

const submitting = ref(false);
const nurses = ref<SelectProps['options']>([]);

const gender = ref<SelectProps['options']>([
  {value: 0,label: '男'},
  {value: 1,label: '女'},
]);

const formRef = ref();
const formRef2 = ref();
const showDraftModal = ref(false);
const saving = ref(false);
const draftDate = ref('');
const {load,save,clear} = draftStore();
const loginUser = ref<UserType>();
const key = 'medical_record';
const route = useRoute();
const data = ref();


const rules = {
  department: [
    { required: true, message: '请选择就诊科室!' },
  ],
  stateOfIllness:[
    { required: true, message: '请填写病情描述!' },
  ]

}

//根据输入的数据搜索
const filterOption = (input: string, option: any) => {
  return option.label.indexOf(input) >= 0;
};

// 表单数据
const form = ref();
const init = ref({
  appointmentId: undefined,
  userId: undefined,
  username: '',
  idNumber: '',
  gender: undefined,
  age: undefined,
  phone: '',

  doctorId: undefined,
  doctor: '',
  nurseId: undefined,
  nurse: '',
  department: '',
  stateOfIllness: '',
})

onMounted(async () => {
  //解析出数据
  data.value = JSON.parse(route.query.data);
  loginUser.value = await getCurrentUser();
  form.value = {...init.value};
  // checkDraft();

  const pre = await myAxios.get("/medical/search",{
    params: {
      appointmentId: data.value.id,
    }
  });
  if (pre.code === 0) {
    if (pre.data) form.value = pre.data;
    else {
      const res0 = await myAxios.get("/user/search",{
        params: {
          userId: data.value?.userId,
        }
      })

      if (data.value && res0.code === 0) {
        form.value.appointmentId = data.value.id;
        form.value.userId = data.value.userId;
        form.value.username = data.value.username;
        form.value.idNumber = data.value.idNumber;
        form.value.gender = res0.data.gender;
        form.value.phone = res0.data.phone;
        form.value.age = res0.data.age;
      }
    }
  }


  const res = await myAxios.get("/user/list",{
    params: {
      type: 2,
    }
  });

  if (res.code === 0) {
    const data = res.data;
    //向选择器里添加元素
    data.forEach(item => {
      nurses.value?.push({value: item.id, label: item.username});
    });
  } else {
    message.error("数据获取失败，请刷新后重试")
  }


})

// 提交报告
const submitReport = async () => {

  // 验证所有表单
  try {
    await Promise.all([
      formRef.value?.validate(),
      formRef2.value?.validate()
    ]);
  } catch (error) {
    message.error("请填写完整信息");
    return;
  }

  submitting.value = true;
  const res = await myAxios.get("/user/list/byIdNumber",{
    params: {
      idNumber: form.value.idNumber,
    }
  });
  if (res.code === 0) {
    form.value.userId = res.data.id;
  } else {
    message.error("数据获取失败，请刷新后重试")
  }

  form.value.doctorId = loginUser.value?.id;
  form.value.doctor = loginUser.value?.username;
  const nurse = nurses.value?.find(item => item.value === form.value.nurseId);
  form.value.nurse = nurse.label;

  const res1 = await myAxios.post('/medical/add', form.value);
  if (res1.code === 0) {
    message.success('就诊报告提交成功');
    // resetForm();
  } else {
    message.error(res1.message || '提交失败');
  }
  submitting.value = false;
}

// // 重置表单
// const resetForm = () => {
//   //使用浅拷贝，使二者指向不同的对象
//   form.value = {...init.value};
// };
//
// // 检查本地是否有草稿
// const checkDraft = () => {
//   const draft = load(key);
//   if (draft) {
//     draftDate.value = new Date(draft.saveTime).toLocaleString();
//     showDraftModal.value = true;
//   }
// };
//
// // 加载草稿
// const loadDraft = () => {
//   const draft = load(key);
//   if (draft) form.value = draft.formData;
//   showDraftModal.value = false;
//   message.success('已加载未完成的报告');
// };
//
// // 清除草稿
// const clearDraft = () => {
//   clear(key);
//   showDraftModal.value = false;
//   resetForm();
// };
//
// // 保存草稿
// const saveDraft = () => {
//   saving.value = true;
//   const draftData = {
//     formData: {...form.value},
//     saveTime: new Date().getTime()
//   };
//
//   save(key,draftData);
//
//   setTimeout(() => {
//     saving.value = false;
//     message.success('草稿已保存');
//   }, 500);
// };


</script>

<style scoped>
.doctor-health-report {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
}

.section {
  margin-bottom: 24px;
}

.action-buttons {
  text-align: center;
  margin-top: 24px;
}
</style>