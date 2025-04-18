<template>
  <a-table :columns="columns" :data-source="data" :row-key="getRowKey">
    <template #headerCell="{ column }">
    </template>

    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'category'">
        <a-tag v-if="record.category === 0" :color="'geekblue'">医生</a-tag>
        <a-tag v-else-if="record.category === 1" :color="'green'">护士</a-tag>
      </template>
      <template v-else-if="column.key === 'type'">
        <a-button v-if="record.type === 0" type="primary" @click="showModal(record)">取消预约</a-button>
        <a-button v-else-if="record.type === 1" type="primary" disabled>已退号</a-button>
        <a-modal v-model:open="open" title="是否确认取消预约" @ok="cancel" />
      </template>
    </template>
  </a-table>
</template>

<script setup lang="ts">

import { onMounted, ref } from "vue";
import myAxios from "@/plugins/myAxios";
import { UserType } from "@/models/user";
import { getCurrentUser } from "@/services/user";
import { message } from "ant-design-vue";

const columns = [
  {
    title: '就诊流水号',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '医护人员',
    dataIndex: 'workerName',
    key: 'workerName',
  },
  {
    title: '就诊科室',
    dataIndex: 'department',
    key: 'department',
  },
  {
    title: '职称',
    dataIndex: 'position',
    key: 'position',
  },
  {
    title: '就诊时间',
    dataIndex: 'time',
    key: 'time',
  },
  {
    title: '类别',
    dataIndex: 'category',
    key: 'category',
  },
  {
    title: '操作',
    dataIndex: 'type',
    key: 'type',
  },
];

const data = ref([]);
const loginUser = ref<UserType>();
const open = ref(false);
const currentRecord = ref();

onMounted(async () => {
  loginUser.value = await getCurrentUser();

  const res = await myAxios.get('/appointment/list', {
    params: {
      userId: loginUser.value?.id,
    }
  });

  if (res.code === 0) {
    data.value = res.data;
    console.log("数据:",data.value);
  } else {
    message.error("数据获取失败，请稍后重试")
  }

})

/**
 * 展示对话框
 */
const showModal = (record) => {
  open.value = true;
  //直接引用，二者指向同一个对象，对currentRecord修改，会同时修改record
  currentRecord.value = record;
}

/**
 * 取消预约，更新type
 * @param record
 */
const cancel = async () => {
  console.log("取消预约:",currentRecord.value);
  const res = await myAxios.get('/appointment/cancel', {
    params: {
      id: currentRecord.value?.id,
    }
  });

  if (res.code === 0) {
    message.success("取消预约成功!");
    currentRecord.value.type = 1;
    open.value = false;
  } else {
    message.error("取消预约失败，请刷新重试");
  }

}

const getRowKey = (record) => {
  // console.log("id:",record.id);
  return record.id;
}

</script>



<style scoped>

</style>