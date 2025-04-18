<template>
  <div class="MedicalRecordPage">
    <a-table
      v-if="data.length > 0"
      :columns="columns"
      :data-source="data"
      :expand-column-width="100"
      :row-key="getRowKey"
    >
      <template #bodyCell="{ column }">
      </template>
      <template #expandedRowRender="{ record }">
        <p style="margin: 0">
          {{ record.stateOfIllness }}
        </p>
      </template>
      <template #expandColumnTitle>
        <span style="color: red">病情</span>
      </template>
    </a-table>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue";
import myAxios from "@/plugins/myAxios";
import { UserType } from "@/models/user";
import { getCurrentUser } from "@/services/user";
import { Empty } from 'ant-design-vue';
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;

const columns = [
  { title: '就诊医生', dataIndex: 'doctor', key: 'doctor', fixed: true },
  { title: '护理护士', dataIndex: 'nurse', key: 'nurse' },
  { title: '就诊时间', dataIndex: 'createTime', key: 'createTime' },
];

const data = ref([]);
const loginUser = ref<UserType>();

/**
 * 使用data数组下标来区分不同行
 * @param record
 */
const getRowKey = (record) => {
  return data.value.indexOf(record);
};

onMounted(async () => {

  loginUser.value = await getCurrentUser();

  const res = await myAxios.get("/medical/list",{
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
  }

})

</script>

<style scoped>

</style>