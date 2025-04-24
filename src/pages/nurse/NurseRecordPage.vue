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
      <a-table
        :columns="columns"
        :data-source="data"
        :expand-column-width="100"
        :row-key="getRowKey">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'createTime'">
            {{new Date(record.createTime).toLocaleString()}}
          </template>
          <template v-if="column.key === 'action'">
            <a-button type="link" @click="showDetail(record)">
              <template #icon>
                <eye-outlined />
              </template>
              查看评价
            </a-button>
          </template>
        </template>
        <template #expandedRowRender="{ record }">
          <p style="margin: 0">
            {{ record.stateOfIllness }}
          </p>
        </template>
        <template #expandColumnTitle>
          <span style="color: red">病人病情</span>
        </template>
      </a-table>
    </div>

    <a-modal v-model:open="open" @ok="submit" style="width: 500px;height: 300px" title="评价详情">
      <a-textarea :value="currentRecord.comment ?? '暂无评价'" disabled />
    </a-modal>
  </div>
</template>

<script setup lang="ts">

import { onMounted, ref } from "vue";
import { Dayjs } from "dayjs";
import myAxios from "@/plugins/myAxios";
import { UserType } from "@/models/user";
import { getCurrentUser } from "@/services/user";
import { message } from "ant-design-vue";
import {  EyeOutlined } from "@ant-design/icons-vue";

const time = ref<Dayjs>();

const columns = [
  {
    title: '病人姓名',
    dataIndex: 'username',
    key: 'username',
  },
  {
    title: '病人身份证号',
    dataIndex: 'idNumber',
    key: 'idNumber',
  },
  {
    title: '病人就诊科室',
    dataIndex: 'department',
    key: 'department',
  },
  {
    title: '病人就诊时间',
    dataIndex: 'createTime',
    key: 'createTime',
  },
  {
    title: '评价',
    dataIndex: 'action',
    key: 'action',
  },
];

const data = ref([]);
const loginUser = ref<UserType>();
const currentRecord = ref();
const open = ref(false);

const showDetail = (record) => {
  currentRecord.value = record;
  open.value = true;
}

const submit = () => {
  open.value = false;
}

onMounted(async () => {

  loginUser.value = await getCurrentUser();
  await select();

});

/**
 * 获取该护士的全部的护理记录信息
 */
const select = async () => {
  const res = await myAxios.get("/medical/nurse",{
    params: {
      nurseId: loginUser.value?.id,
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

  const res = await myAxios.get("/medical/nurse/byDate",{
    params: {
      nurseId: loginUser.value?.id,
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

/**
 * 使用data数组下标来区分不同行
 * @param record
 */
const getRowKey = (record) => {
  return data.value.indexOf(record);
};

</script>

<style scoped>

</style>