<template>
  <div class="doctor-health-report" v-if="form != undefined">
    <!-- 草稿加载提示 -->
    <a-modal
      v-model:visible="showDraftModal"
      title="发现未完成的体检报告"
      ok-text="继续填写"
      cancel-text="新建报告"
      @ok="loadDraft"
      @cancel="clearDraft"
    >
      <p>检测到您有一份未提交的体检报告（{{ draftDate }}），是否继续填写？</p>
    </a-modal>

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
              <a-input v-model:value="form.username" placeholder="输入患者姓名" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="身份证号"
              name="idNumber"
            >
              <a-input v-model:value="form.idNumber" placeholder="输入患者身份证号"/>
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
              <a-input-number v-model:value="form.age" placeholder="输入患者年龄" :min="1" :step="1" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="手机号"
              name="phone"
            >
              <a-input v-model:value="form.phone" placeholder="输入患者手机号"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>

    <!-- 体检数据填写区 -->
    <a-card title="体检数据" class="section">
      <a-tabs v-model:activeKey="activeTab">
        <!-- 眼科 -->
        <a-tab-pane key="eye" tab="眼科">
          <a-form layout="horizontal" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
            <a-form-item label="左眼视力">
              <a-input-number v-model:value="form.leftEye" :min="0" :max="5" :step="0.1" />
            </a-form-item>
            <a-form-item label="右眼视力">
              <a-input-number v-model:value="form.rightEye" :min="0" :max="5" :step="0.1" />
            </a-form-item>
            <a-form-item label="色觉">
              <a-input v-model:value="form.colorVision" placeholder="输入色觉情况" />
            </a-form-item>
          </a-form>
        </a-tab-pane>
        <!-- 五官科 -->
        <a-tab-pane key="otolaryngology" tab="五官科">
          <a-form layout="horizontal" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
            <a-form-item label="左耳听力(m)">
              <a-input-number v-model:value="form.leftEar" :min="0" :max="100" :step="1" />
            </a-form-item>
            <a-form-item label="右耳听力(m)">
              <a-input-number v-model:value="form.rightEar" :min="0" :max="100" :step="1" />
            </a-form-item>
            <a-form-item label="嗅觉">
              <a-input v-model:value="form.smell" placeholder="输入嗅觉情况" />
            </a-form-item>
            <a-form-item label="口吃">
              <a-input v-model:value="form.stuttering" placeholder="输入口吃情况" />
            </a-form-item>
            <a-form-item label="面部">
              <a-input v-model:value="form.faceCondition" placeholder="输入面部情况" />
            </a-form-item>
          </a-form>
        </a-tab-pane>

        <!-- 内科 -->
        <a-tab-pane key="internal" tab="内科">
          <a-form layout="horizontal" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
            <a-form-item label="心率(次/分)">
              <a-input-number v-model:value="form.heartRate" :min="30" :max="200" />
            </a-form-item>
            <a-form-item label="呼吸频率(次/分)">
              <a-input-number v-model:value="form.breathingRate" :min="30" :max="200" />
            </a-form-item>
            <a-form-item label="体温(℃)">
              <a-input-number v-model:value="form.temperature" :min="30" :max="42" :step="0.1" />
            </a-form-item>
            <a-form-item label="血压(mmHg)">
              <a-input-group compact>
                <a-input-number v-model:value="form.highBloodPressure" placeholder="高压" style="width: 45%" />
                <span style="width: 10%; text-align: center">/</span>
                <a-input-number v-model:value="form.lowBloodPressure" placeholder="低压" style="width: 45%" />
              </a-input-group>
            </a-form-item>
            <a-form-item label="肝">
              <a-input v-model:value="form.liver" placeholder="输入肝情况" />
            </a-form-item>
            <a-form-item label="脾">
              <a-input v-model:value="form.spleen" placeholder="输入脾情况" />
            </a-form-item>
            <a-form-item label="肺">
            <a-input v-model:value="form.lung" placeholder="输入肺情况" />
          </a-form-item>

          </a-form>
        </a-tab-pane>

        <!-- 外科 -->
        <a-tab-pane key="surgery" tab="外科">
          <a-form layout="horizontal" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
            <a-form-item label="身高(cm)">
              <a-input-number v-model:value="form.height" :min="0" :max="300" />
            </a-form-item>
            <a-form-item label="体重(kg)">
              <a-input-number v-model:value="form.weight" :min="0" :max="200" />
            </a-form-item>
            <a-form-item label="皮肤">
              <a-input v-model:value="form.skin" placeholder="输入皮肤情况" />
            </a-form-item>
            <a-form-item label="四肢">
              <a-input v-model:value="form.limbs" placeholder="输入四肢情况" />
            </a-form-item>
            <a-form-item label="甲状腺">
              <a-input v-model:value="form.thyroidGland" placeholder="输入甲状腺情况" />
            </a-form-item>
          </a-form>
        </a-tab-pane>
      </a-tabs>
    </a-card>

    <!-- 结论和建议 -->
    <a-card title="体检结论" class="section">
      <a-form
        layout="horizontal"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 18 }"
        :rules="rules"
        ref="formRef2"
        :model="form"
      >
        <a-form-item
          label="主检医生"
          name="doctor"
        >
          <a-input v-model:value="form.doctor"  placeholder="输入主检医生" style="width: 100%" />
        </a-form-item>
        <a-form-item label="健康建议">
          <a-textarea v-model:value="form.healthAdvice" :rows="4" placeholder="输入健康建议" />
        </a-form-item>
        <a-form-item label="下次体检">
          <a-date-picker v-model:value="form.nextTime" style="width: 100%" placeholder="选择下次体检建议日期" />
        </a-form-item>
        <a-form-item
          label="健康状况"
          name="healthCondition"
        >
          <a-select
            v-model:value="form.healthCondition"
            placeholder="选择本次体检健康状况"
            style="width: 100%"
            :options="condition"
          />
        </a-form-item>
        <a-form-item label="体检机构">
          <a-input v-model:value="form.institution"  style="width: 100%" placeholder="输入体检机构"/>
        </a-form-item>
      </a-form>
    </a-card>

    <!-- 操作按钮 -->
    <div class="action-buttons">
      <a-button
        type="primary"
        @click="saveDraft"
        :loading="saving"
      >
        <save-outlined /> 保存草稿
      </a-button>
      <a-button type="primary" @click="submitReport" :loading="submitting" style="margin-left: 16px">提交报告</a-button>
      <a-button @click="resetForm" style="margin-left: 16px">重置</a-button>
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

const activeTab = ref('eye');
const submitting = ref(false);
const gender = ref<SelectProps['options']>([
  {value: 0,label: '男'},
  {value: 1,label: '女'},
]);

const condition = ref<SelectProps['options']>([
  {value: 0,label: '优秀'},
  {value: 1,label: '良好'},
  {value: 2,label: '一般'},
  {value: 3,label: '不良'},
]);

const formRef = ref();
const formRef2 = ref();
const showDraftModal = ref(false);
const saving = ref(false);
const draftDate = ref('');
const {load,save,clear} = draftStore();
const key = 'health_report';


const rules = {
  username:[
    { required: true, message: '请输入患者姓名!' },
    {min: 2, max: 10,message: '请正确输入患者姓名!'}
  ],
  idNumber:[
    { required: true, message: '请输入患者身份证号!' },
    {len: 18,message: '请输入正确的身份证号'}
  ],
  gender:[
    { required: true, message: '请选择患者性别!' },
    {type: 'number',message: '请选择患者性别!'}
  ],
  age:[
    { required: true, message: '请输入患者年龄!' },
    {type: 'number',min: 1,max: 120, message: '请输入患者年龄!'}
  ],
  phone:[
    { required: true, message: '请输入患者手机号!' },
    {len: 11,message: '请输入正确的手机号'}
  ],
  doctor:[
    { required: true, message: '请输入主检医生!' },
    {min: 2,max: 10, message: '请输入主检医生'}
  ],
  healthCondition: [
    { required: true, message: '请选择本次体检健康状况!' },
  ]

}

// 表单数据
const form = ref<HealthRecordType>();
const init = ref<HealthRecordType>({
  username: '',
  idNumber: '',
  gender: undefined,
  age: undefined,
  phone: '',
  //眼科
  leftEye: undefined,
  rightEye: undefined,
  colorVision: '',
  //五官科
  leftEar: undefined,
  rightEar: undefined,
  smell: '',
  stuttering: '',
  faceCondition: '',
  //内科
  heartRate: undefined,
  breathingRate: undefined,
  temperature: undefined,
  highBloodPressure: undefined,
  lowBloodPressure: undefined,
  liver: '',
  spleen: '',
  lung: '',
  //外科
  height: undefined,
  weight: undefined,
  skin: '',
  limbs: '',
  thyroidGland: '',

  healthCondition: undefined,
  healthAdvice: '',
  nextTime: '',
  createTime: '',
  doctor: '',
  institution: '',

})

onMounted(async () => {
  form.value = {...init.value};
  checkDraft(key);
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
  const res = await myAxios.post('/health/add', form.value);
  if (res.code === 0) {
    message.success('体检报告提交成功');
    resetForm();
  } else {
    message.error(res.message || '提交失败');
  }
  submitting.value = false;
}

// 重置表单
const resetForm = () => {
  //使用浅拷贝，使二者指向不同的对象
  form.value = {...init.value};
};

// 检查本地是否有草稿
const checkDraft = () => {
  const draft = load(key);
  if (draft) {
    draftDate.value = new Date(draft.saveTime).toLocaleString();
    showDraftModal.value = true;
  }
};

// 加载草稿
const loadDraft = () => {
  const draft = load(key);
  if (draft) form.value = draft.formData;
  showDraftModal.value = false;
  message.success('已加载未完成的报告');
};

// 清除草稿
const clearDraft = () => {
  clear(key);
  showDraftModal.value = false;
  resetForm();
};

// 保存草稿
const saveDraft = () => {
  saving.value = true;
  const draftData = {
    formData: {...form.value},
    saveTime: new Date().getTime()
  };

  save(key,draftData);

  setTimeout(() => {
    saving.value = false;
    message.success('草稿已保存');
  }, 500);
};


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