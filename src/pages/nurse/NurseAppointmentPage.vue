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
        <template #bodyCell="{column,record}">
          <template v-if="column.key === 'action'">
            <a-button v-if="record.type === 0" type="primary" @click="show(record)">
              确认处理
            </a-button>
            <a-button v-if="record.type === 2" type="primary" >
              已处理
            </a-button>
          </template>
        </template>
      </a-table>
    </div>
  </div>

  <a-modal v-model:open="open" title="是否确认已处理" @ok="solve"/>

</template>

<script setup lang="ts">

import { onMounted, ref } from "vue";
import { Dayjs } from "dayjs";
import myAxios from "@/plugins/myAxios";
import { UserType } from "@/models/user";
import { getCurrentUser } from "@/services/user";
import { message } from "ant-design-vue";

const time = ref<Dayjs>();
const open = ref(false);
const currentRecord = ref();

const columns = [
  {
    title: '患者姓名',
    dataIndex: 'username',
    key: 'username',
  },
  {
    title: '患者身份证号',
    dataIndex: 'idNumber',
    key: 'idNumber',
  },
  {
    title: '预约科室',
    dataIndex: 'department',
    key: 'department',
  },

  {
    title: '预约时间段',
    dataIndex: 'time',
    key: 'time',
  },
  {
    title: '预约服务类型',
    dataIndex: 'way',
    key: 'way',
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
  },
];

const data = ref([]);
const loginUser = ref<UserType>();

onMounted(async () => {

  loginUser.value = await getCurrentUser();
  await select();

});

/**
 * 获取该护士的所有预约信息
 */
const select = async () => {
  const res = await myAxios.get("/appointment/worker",{
    params: {
      workerId: loginUser.value?.id,
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

  const res = await myAxios.get("/appointment/worker/byDate",{
    params: {
      workerId: loginUser.value?.id,
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

const show = (record) => {
  open.value = true;
  currentRecord.value = record;
}

/**
 * 更新改预约信息type
 */
const solve = async () => {
  const res = await myAxios.get("/appointment/update",{
    params: {
      id: currentRecord.value.id,
    }
  })
  if (res.code === 0) {
    message.success("确认成功")
    currentRecord.value.type = 2;
    open.value = false;
  } else {
    message.error("确认失败，请稍后重试")
  }
}

</script>

<style scoped>

</style>