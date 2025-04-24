<template>
    <div class="card-layout-container">
      <!-- 搜索区 -->
      <a-card title="患者体检报告查询" class="search-card">
        <a-form layout="inline">
          <a-form-item label="患者姓名">
            <a-input v-model:value="searchParams.username" placeholder="输入姓名"/>
          </a-form-item>
          <a-form-item label="身份证号">
            <a-input v-model:value="searchParams.idNumber" placeholder="输入身份证号"/>
          </a-form-item>
          <a-button type="primary" html-type="submit" :loading="searchLoading" @click="handleSearch">
            <template #icon>
              <search-outlined />
            </template>
            查询
          </a-button>
        </a-form>
      </a-card>

      <div class="table-container">
        <a-table
          :columns="columns"
          :data-source="formData"
          :row-key="record => record.id"
          :loading="loading"
          bordered
        >
          <!-- 自定义单元格 -->
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'createTime'">
              {{ new Date(record.createTime).toLocaleString() }}
            </template>
            <template v-if="column.key === 'username'">
              <a>{{ record.username }}</a>
            </template>

            <template v-else-if="column.key === 'healthCondition'">
              <a-tag v-if="record.healthCondition === 0" :color="'green'">优秀</a-tag>
              <a-tag v-if="record.healthCondition === 1" :color="'blue'">良好</a-tag>
              <a-tag v-if="record.healthCondition === 2" :color="'orange'">一般</a-tag>
              <a-tag v-if="record.healthCondition === 3" :color="'red'">不良</a-tag>
            </template>

            <template v-else-if="column.key === 'action'">
              <a-button type="link" @click="showDetail(record)">
                <template #icon>
                  <eye-outlined/>
                </template>
                详情
              </a-button>
            </template>
          </template>
        </a-table>
      </div>

</div>
<!-- 报告具体内容 -->
  <div class="detail-content" >
    <a-modal v-model:open="detailVisible" @ok="close" style="width: 80%;height: 300px">
      <a-tabs>
        <a-tab-pane key="basic" tab="基本信息">
          <a-descriptions :column="2" bordered>
            <a-descriptions-item label="姓名">{{ currentReport.username }}</a-descriptions-item>
            <a-descriptions-item label="身份证号">{{ currentReport.idNumber }}</a-descriptions-item>
            <a-descriptions-item label="性别">{{ currentReport.gender === 0 ? '男' : '女' }}</a-descriptions-item>
            <a-descriptions-item label="年龄">{{ currentReport.age }}</a-descriptions-item>
            <a-descriptions-item label="手机号">{{ currentReport.phone }}</a-descriptions-item>
          </a-descriptions>
        </a-tab-pane>

        <!-- 眼科 -->
        <a-tab-pane key="eye" tab="眼科">
          <a-descriptions :column="2" bordered>
          <a-descriptions-item label="左眼视力">{{ currentReport.leftEye }}</a-descriptions-item>
          <a-descriptions-item label="右眼视力">{{ currentReport.rightEye }}</a-descriptions-item>
          <a-descriptions-item label="色觉">{{ currentReport.colorVision }}</a-descriptions-item>
          </a-descriptions>
        </a-tab-pane>

        <!-- 五官科 -->
        <a-tab-pane key="otolaryngology" tab="五官科">
          <a-descriptions :column="2" bordered>
            <a-descriptions-item label="左耳听力(m)">{{ currentReport.leftEye }}</a-descriptions-item>
            <a-descriptions-item label="右耳听力(m)">{{ currentReport.rightEye }}</a-descriptions-item>
            <a-descriptions-item label="嗅觉">{{ currentReport.smell }}</a-descriptions-item>
            <a-descriptions-item label="口吃">{{ currentReport.stuttering }}</a-descriptions-item>
            <a-descriptions-item label="面部">{{ currentReport.faceCondition }}</a-descriptions-item>
          </a-descriptions>
        </a-tab-pane>

        <!-- 内科 -->
        <a-tab-pane key="internal" tab="内科">
          <a-descriptions :column="2" bordered>
            <a-descriptions-item label="心率(次/分)">{{ currentReport.heartRate }}</a-descriptions-item>
            <a-descriptions-item label="呼吸频率(次/分)">{{ currentReport.breathingRate }}</a-descriptions-item>
            <a-descriptions-item label="体温(℃)">{{ currentReport.temperature }}</a-descriptions-item>
            <a-descriptions-item label="血压高压(mmHg)">{{ currentReport.highBloodPressure }}</a-descriptions-item>
            <a-descriptions-item label="血压低压(mmHg)">{{ currentReport.lowBloodPressure }}</a-descriptions-item>
            <a-descriptions-item label="肝">{{ currentReport.liver }}</a-descriptions-item>
            <a-descriptions-item label="脾">{{ currentReport.spleen }}</a-descriptions-item>
            <a-descriptions-item label="肺">{{ currentReport.lung }}</a-descriptions-item>
          </a-descriptions>
        </a-tab-pane>

        <!-- 外科 -->
        <a-tab-pane key="surgery" tab="外科">
          <a-descriptions :column="2" bordered>
            <a-descriptions-item label="身高(cm)">{{ currentReport.height }}</a-descriptions-item>
            <a-descriptions-item label="体重(kg)">{{ currentReport.weight }}</a-descriptions-item>
            <a-descriptions-item label="皮肤">{{ currentReport.skin }}</a-descriptions-item>
            <a-descriptions-item label="四肢">{{ currentReport.limbs }}</a-descriptions-item>
            <a-descriptions-item label="甲状腺">{{ currentReport.thyroidGland }}</a-descriptions-item>
          </a-descriptions>
        </a-tab-pane>

        <!-- 体检结果 -->
        <a-tab-pane key="result" tab="体检结果">
          <a-descriptions :column="2" bordered>
            <a-descriptions-item label="主检医生">{{ currentReport.doctor }}</a-descriptions-item>
            <a-descriptions-item label="健康状况">{{ getHealthCondition(currentReport.healthCondition) }}</a-descriptions-item>
            <a-descriptions-item label="健康建议" :span="2">{{ currentReport.healthAdvice }}</a-descriptions-item>
            <a-descriptions-item label="建议下次体检日期">
              {{ new Date(currentReport.nextTime).toLocaleDateString() }}
            </a-descriptions-item>
            <a-descriptions-item label="体检机构">{{ currentReport.institution }}</a-descriptions-item>
          </a-descriptions>
        </a-tab-pane>

      </a-tabs>
    </a-modal>
  </div>

</template>

<script setup lang="ts">

import { ref } from 'vue';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons-vue';
import myAxios from "@/plugins/myAxios";
import { message } from "ant-design-vue";
import { HealthRecordType } from "@/models/healthRecord";

// 体检报告数据
const formData = ref([]);

const searchParams = ref({
  username: '',
  idNumber: ''
});
const searchLoading = ref(false);
const currentReport = ref<HealthRecordType>();
const detailVisible = ref(false);

const columns = [
  {
    title: '体检日期',
    dataIndex: 'createTime',
    key: 'createTime',
    // width: 120,
    sorter: {
      compare: (a, b) => new Date(a.createTime) - new Date(b.createTime),
    },
  },
  {
    title: '患者姓名',
    dataIndex: 'username',
    key: 'username',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '健康状况',
    dataIndex: 'healthCondition',
    key: 'healthCondition',
    filters: [
      { text: '优秀', value: 0 },
      { text: '良好', value: 1 },
      { text: '一般', value: 2 },
      { text: '不良', value: 3 }
    ],
    onFilter: (value, record) => record.healthCondition === value
  },
  {
    title: '操作',
    key: 'action',
  }
];

// 点击查询
const handleSearch = async () => {
  searchLoading.value = true;
  setTimeout(() => {
    searchLoading.value = false;
  }, 500);

  const res = await myAxios.get("/health/search",{
    params: {
      username: searchParams.value.username,
      idNumber: searchParams.value.idNumber,
    }
  });
  if (res.code === 0) {
    formData.value = res.data;
    message.success("查询成功，结果如下")
  } else {
    message.error("查询失败，请刷新后重试")
  }

};

//展示报告详情
const showDetail = (report: HealthRecord) => {
  currentReport.value = report;
  detailVisible.value = true;
};

//关闭报告详情
const close = () => {
  detailVisible.value = false;
}
function getHealthCondition(id: number) {

  if (id === 0) return '优秀';
  else if (id === 1) return '良好';
  else if (id === 2) return '一般';
  else return '不良'

}


</script>

<style scoped>
  .card-layout-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  .search-card {
    margin-bottom: 24px;
  }


  .info-detail h3 {
    margin: 0;
    font-size: 18px;
    color: #1890ff;
  }

  .info-detail p {
    margin: 4px 0;
    color: #666;
  }

  .card-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }
</style>