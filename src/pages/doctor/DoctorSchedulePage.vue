<template>
  <div id="nurseSchedulePage" style="margin-top: 10px">
    <a-form>
      <a-form-item
        label="选择日期:"
      >
        <a-date-picker v-model:value="time" />
        <a-button style="margin-left: 10px" type="primary" @click="selectByDate">开始查询</a-button>
      </a-form-item>
    </a-form>

    <!--    展示排班信息 -->
    <div class="nurse-schedule">
      <a-table :columns="columns" :data-source="data">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'startTime'">
            {{new Date(record.startTime).toLocaleString()}}
          </template>
          <template v-if="column.key === 'endTime'">
            {{new Date(record.endTime).toLocaleString()}}
          </template>
          <template v-if="column.key === 'week'">
            <a> {{map.get(record.week)}} </a>
          </template>
          <template v-if="column.key === 'fee'">
            {{record.fee}}元
          </template>
          <template v-if="column.key === 'numberType'">
            <span>
              <a-tag v-if="record.numberType === '普通号'" color="#2db7f5">普通号</a-tag>
              <a-tag v-if="record.numberType === '专家号'" color="#87d068">专家号</a-tag>
            </span>
          </template>
          <template v-if="column.key === 'category'">
            <span>
              <a-tag v-if="record.category === 0" :color="'processing'">早班</a-tag>
              <a-tag v-if="record.category === 1" :color="'cyan'">中班</a-tag>
              <a-tag v-if="record.category === 2" :color="'blue'">晚班</a-tag>
              <a-tag v-if="record.category === 3" :color="'purple'">全天</a-tag>
              <a-tag v-if="record.category === 4" :color="'green'">休息</a-tag>
            </span>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">

import { onMounted, ref } from "vue";
import { Dayjs } from "dayjs";
import myAxios from "@/plugins/myAxios";
import { UserType } from "@/models/user";
import { getCurrentUser } from "@/services/user";
import { message } from "ant-design-vue";

const time = ref<Dayjs>();

const columns = [
  {
    title: '周次',
    dataIndex: 'week',
    key: 'week',
  },
  {
    title: '姓名',
    dataIndex: 'username',
    key: 'username',
  },
  {
    title: '科室',
    dataIndex: 'department',
    key: 'department',
  },
  {
    title: '职称',
    dataIndex: 'position',
    key: 'position',
  },
  {
    title: '可预约人数',
    dataIndex: 'maxCount',
    key: 'maxCount',
  },
  {
    title: '预约费用',
    dataIndex: 'fee',
    key: 'fee',
  },
  {
    title: '号型',
    dataIndex: 'numberType',
    key: 'numberType',
  },
  {
    title: '工作方式',
    dataIndex: 'way',
    key: 'way',
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
    title: '班次',
    dataIndex: 'category',
    key: 'category',
  },
];

const data = ref([]);
const loginUser = ref<UserType>();
const map = new Map([[1,'周一'],[2,'周二'],[3,'周三'],[4,'周四'],[5,'周五'],[6,'周六'],[7,'周日']])

onMounted(async () => {

  loginUser.value = await getCurrentUser();
  await select();

});

/**
 * 获取全部的排班信息
 */
const select = async () => {
  const res = await myAxios.get("/appointment/schedule/worker",{
    params: {
      userId: loginUser.value?.id,
    }
  });

  if (res.code === 0) {
    data.value = res.data;
  } else {
    message.error("数据获取失败，请刷新后重试");
  }
}

/**
 * 根据日期查询
 */
const selectByDate = async () => {
  const date = time.value?.format('YYYY-MM-DD');
  //如果没选择日期，则查询所有
  if (!date) {
    await select();
    message.success("查询成功");
    return;
  }

  const res = await myAxios.get("/appointment/schedule/worker/byDate",{
    params: {
      userId: loginUser.value?.id,
      time: date,
    }
  });

  if (res.code === 0) {
    data.value = res.data;
    message.success("查询成功")
  } else {
    message.error("查询失败，请刷新后重试")
  }

}

</script>

<style scoped>

</style>