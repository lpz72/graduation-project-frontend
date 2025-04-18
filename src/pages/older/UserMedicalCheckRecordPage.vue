<template>
  <div class="MedicalCheckRecordPage">
    <a-table
      v-if="data.length > 0"
      :columns="columns"
      :data-source="data"
      :expand-column-width="100"
      :row-key="getRowKey"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <a @click="handleDelete(record.id)">删除</a>
        </template>
      </template>
      <template #expandedRowRender="{ record }">
        <div>
            <a-descriptions
              bordered

              :column="{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }"
            >
              <template #title>
                <div style="text-align: center;font-size: 20px">
                  <a>体检报告单</a>
                </div>
              </template>
              <a-descriptions-item label="姓名">{{loginUser.username}}</a-descriptions-item>
              <a-descriptions-item label="性别">{{gender}}</a-descriptions-item>
              <a-descriptions-item label="年龄">{{loginUser.age}}</a-descriptions-item>
              <a-descriptions-item label="联系电话">{{loginUser.phone}}</a-descriptions-item>
            </a-descriptions>
          <a-descriptions
            title="眼科"
            bordered
            style="text-align: center;margin-top: 5px"
            :column="{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }"
          >
            <a-descriptions-item label="左眼视力">{{record.leftEye}}</a-descriptions-item>
            <a-descriptions-item label="右眼视力">{{record.rightEye}}</a-descriptions-item>
            <a-descriptions-item label="色觉">{{record.colorVision}}</a-descriptions-item>
          </a-descriptions>
          <a-descriptions
            title="五官科"
            bordered
            style="text-align: center;margin-top: 5px"
            :column="{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }"
          >
            <a-descriptions-item label="左耳听力">{{record.leftEar}}米</a-descriptions-item>
            <a-descriptions-item label="右耳听力">{{record.rightEar}}米</a-descriptions-item>
            <a-descriptions-item label="口吃">{{record.stuttering}}</a-descriptions-item>
            <a-descriptions-item label="嗅觉">{{record.smell}}</a-descriptions-item>
            <a-descriptions-item label="面部">{{record.faceCondition}}</a-descriptions-item>
          </a-descriptions>
          <a-descriptions
            title="内科"
            bordered
            style="text-align: center;margin-top: 5px"
            :column="{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }"
          >
            <a-descriptions-item label="心率">{{record.heartRate}}次/分</a-descriptions-item>
            <a-descriptions-item label="体温">{{record.temperature}}℃</a-descriptions-item>
            <a-descriptions-item label="血压高压">{{record.highBloodPressure}}mmHg</a-descriptions-item>
            <a-descriptions-item label="血压低压">{{record.lowBloodPressure}}mmHg</a-descriptions-item>
            <a-descriptions-item label="肝">{{record.liver}}</a-descriptions-item>
            <a-descriptions-item label="脾">{{record.spleen}}</a-descriptions-item>
            <a-descriptions-item label="肺">{{record.lung}}</a-descriptions-item>
          </a-descriptions>
          <a-descriptions
            title="外科"
            bordered
            style="text-align: center;margin-top: 5px"
            :column="{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }"
          >
            <a-descriptions-item label="身高">{{record.height}}cm</a-descriptions-item>
            <a-descriptions-item label="体重">{{record.weight}}kg</a-descriptions-item>
            <a-descriptions-item label="皮肤">{{record.skin}}</a-descriptions-item>
            <a-descriptions-item label="四肢">{{record.limbs}}</a-descriptions-item>
            <a-descriptions-item label="甲状腺">{{record.thyroidGland}}</a-descriptions-item>
          </a-descriptions>
          <a-descriptions
            title="体检结果"
            bordered
            style="text-align: center;margin-top: 5px"
            :column="{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }"
          >
            <a-descriptions-item label="结论" :span="3">{{record.healthAdvice}}</a-descriptions-item>
            <a-descriptions-item label="主检医生">{{record.doctor}}</a-descriptions-item>
            <a-descriptions-item label="体检日期">{{new Date(record.createTime).toLocaleString()}}</a-descriptions-item>
            <a-descriptions-item label="下次体检建议日期">{{new Date(record.nextTime).toLocaleDateString()}}</a-descriptions-item>
          </a-descriptions>

        </div>
      </template>
      <template #expandColumnTitle>
        <span style="color: red">详细报告</span>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { Empty, Table } from "ant-design-vue";
import myAxios from "@/plugins/myAxios";
import { UserType } from "@/models/user";
import { getCurrentUser } from "@/services/user";
import { readonlynessOptionsDefaults } from "@typescript-eslint/type-utils";

const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
const gender = ref();
// 表格列配置
const columns = [
  {
    title: "体检编号",
    dataIndex: "id",
    key: "id",
    fixed: true,
  },
  {
    title: "体检日期",
    dataIndex: "createTime",
    key: "createTime",
  },
  {
    title: "体检机构",
    dataIndex: "institution",
    key: "institution",
  },
];

// 体检报告数据
const data = ref([]);


/**
 * 使用data数组下标来区分不同行
 * @param record
 */
const getRowKey = (record) => {
  return data.value.indexOf(record);
};
const loginUser = ref<UserType>();
onMounted(async () => {

  loginUser.value = await getCurrentUser();
  const res = await myAxios.get("/health/list",{
    params: {
      userId: loginUser.value?.id,
    }
  });
  if (res.code === 0) {
    data.value = res.data;
    for (let i = 0;i < data.value.length; i++) {
      // const key = data.value[i].doctor;
      const time = new Date(data.value[i].createTime).toLocaleString();
      data.value[i].createTime = time;
    }
    gender.value = loginUser.value?.gender === 0 ? '男' : '女';
  }
});
</script>

<style scoped>
</style>