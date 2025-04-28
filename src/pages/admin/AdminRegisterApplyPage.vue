<template>
    <!-- 注册申请表格 -->
    <a-table
      :columns="columns"
      :dataSource="data"
      style="margin-top: 10px"
      bordered
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'userRole'">
          <a-tag v-if="record.userRole === 0" color="orange">管理员</a-tag>
          <a-tag v-if="record.userRole === 2" color="blue">护士</a-tag>
          <a-tag v-if="record.userRole === 3" color="purple">医生</a-tag>
        </template>
        <template v-if="column.key === 'createTime'">
          {{new Date(record.createTime).toLocaleString()}}
        </template>
        <template v-if="column.key === 'action'">
          <a-button type="primary" @click="showModal(record)" ghost>
            同意
          </a-button>
        </template>
      </template>
    </a-table>

  <a-modal v-model:open="open" title="是否同意注册申请？" @ok="confirm">

  </a-modal>

</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import myAxios from "@/plugins/myAxios";
import { message } from "ant-design-vue";

const currentRecord = ref();
const open = ref(false);

//数据
const data = ref([]);

// 列定义
const columns = ref([
  {
    title: '注册账号',
    dataIndex: 'userAccount',
    key: 'userAccount'
  },
  {
    title: '注册角色',
    dataIndex: 'userRole',
    key: 'userRole'
  },
  {
    title: '注册时间',
    dataIndex: 'createTime',
    key: 'createTime'
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
  }
]);

onMounted(async () => {
  await getData();
})


const showModal = (record) => {
  currentRecord.value = record;
  open.value = true;
}

const getData = async () => {
  const res = await myAxios.get("/user/list/apply");
  if (res.code === 0) {
    data.value = res.data;
  } else {
    message.error("数据获取失败，请稍后重试");
  }
}

//同意注册申请
const confirm = async () => {
  const res = await myAxios.get("/user/apply/confirm",{
    params: {
      userId:currentRecord.value.id,
    }
  });

  if (res.code === 0) {
    message.success("申请通过成功");
    open.value = false;
    await getData();
  } else {
    message.error("申请确认通过失败，请稍后重试");
  }
}




</script>

<style scoped>

</style>