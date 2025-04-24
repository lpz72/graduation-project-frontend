<template>
  <a-table :columns="columns" :data-source="data" :row-key="getRowKey">
    <template #headerCell="{ column }">
    </template>

    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'type'">
        <a-tag v-if="record.type === '健康交流会'" :color="'geekblue'">健康交流会</a-tag>
        <a-tag v-else-if="record.type === '健康讲座'" :color="'green'">健康讲座</a-tag>
        <a-tag v-else-if="record.type === '义诊'" :color="'pink'">义诊</a-tag>
        <a-tag v-else-if="record.type === '体检活动'" :color="'cyan'">体检活动</a-tag>
      </template>
      <template v-else-if="column.key === 'action'">
        <a-button v-if="record.action === 0" type="primary" @click="showModal(record)">取消报名</a-button>
        <a-button v-else-if="record.action === 1" type="primary" disabled>已取消报名</a-button>
        <a-modal v-model:open="open" title="是否确认取消报名" @ok="cancel" />
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
    title: '活动名称',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: '开始时间',
    dataIndex: 'startTime',
    key: 'startTime',
  },
  {
    title: '结束时间',
    dataIndex: 'endTime',
    key: 'endTime',
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: '地点',
    dataIndex: 'position',
    key: 'position',
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
  },
];

const data = ref([]);
const loginUser = ref<UserType>();
const open = ref(false);
const currentRecord = ref();

onMounted(async () => {
  loginUser.value = await getCurrentUser();
  await getData();

})

/**
 * 获取数据
 */

const getData = async () => {
  const res = await myAxios.get('/activities/history', {
    params: {
      userId: loginUser.value?.id,
    }
  });

  if (res.code === 0) {
    data.value = res.data;
    const res2 = await myAxios.get('/activities/list');
    if (res2.code === 0) {
      const temp = res2.data;
      // 根据历史记录的activity找到所有活动中对应的活动那个，并组成新的对象
      data.value = data.value.map((item) => {
        const foundItem = temp.find((t) => t.id === item.activityId);
        return {
          title: foundItem.title,
          startTime: new Date(foundItem.startTime).toLocaleString(),
          endTime: new Date(foundItem.endTime).toLocaleString(),
          type: foundItem.type,
          position: foundItem.position,
          action: item.action,
          activityId: item.activityId,
        }
      });
      console.log("数据:",data.value);
    }

  } else {
    message.error("数据获取失败，请稍后重试")
  }
}

/**
 * 展示对话框
 */
const showModal = (record) => {
  open.value = true;
  //直接引用，二者指向同一个对象，对currentRecord修改，会同时修改record
  currentRecord.value = record;
}

/**
 * 取消报名，更新type
 * @param record
 */
const cancel = async () => {
  console.log("取消预约:",currentRecord.value);
  const res = await myAxios.get('/activities/cancel', {
    params: {
      userId: loginUser.value?.id,
      activityId: currentRecord.value?.activityId,
    }
  });

  if (res.code === 0) {
    message.success("取消报名成功!");
    currentRecord.value.action = 1;
    open.value = false;
    await getData();
  } else {
    message.error("取消报名失败，请刷新重试");
  }

}

const getRowKey = (record) => {
  // console.log("id:",record.id);
  return record.activityId;
}

</script>



<style scoped>

</style>