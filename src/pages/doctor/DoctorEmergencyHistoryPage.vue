<template>
  <div class="MedicalRecordPage">
    <a-table
      v-if="data.length > 0"
      :columns="columns"
      :data-source="data"
      :expand-column-width="100"
      :row-key="getRowKey"
    >

      <template #bodyCell="{ column, record }">

        <template v-if="column.key === 'createTime'">
          {{new Date(record.createTime).toLocaleString()}}
        </template>

      </template>

    </a-table>
  </div>

</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue";
import myAxios from "@/plugins/myAxios";
import { UserType } from "@/models/user";
import { getCurrentUser } from "@/services/user";
import { Empty, message } from "ant-design-vue";
import {CommentOutlined} from "@ant-design/icons-vue";

const columns = [
  { title: '呼救者姓名', dataIndex: 'username', key: 'username'},
  { title: '呼救者电话', dataIndex: 'phone', key: 'phone' },
  { title: '呼救者地址', dataIndex: 'address', key: 'address' },
  { title: '呼救时间', dataIndex: 'createTime', key: 'createTime' },
];

const data = ref([]);
const loginUser = ref<UserType>();
const open = ref(false);
const currentRecord = ref();

/**
 * 使用data数组下标来区分不同行
 * @param record
 */
const getRowKey = (record) => {
  return data.value.indexOf(record);
};

onMounted(async () => {

  loginUser.value = await getCurrentUser();

  const res = await myAxios.get("/emergency/list",{
    params: {
      workerId: loginUser.value?.id,
    }
  });

  if (res.code === 0) {
    data.value = res.data;
  } else {
    message.error("数据获取失败，请稍后重试");
  }

})


</script>

<style scoped>

</style>