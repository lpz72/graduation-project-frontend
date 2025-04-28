<template>
  <div class="MedicalRecordPage">
    <a-table
      :columns="columns"
      :data-source="data"
      :expand-column-width="100"
      :row-key="getRowKey"
    >
      <template #bodyCell="{ column,record }">
        <template v-if="column.key === 'gender'">
          {{record.gender === 0 ? '男' : '女'}}
        </template>
        <template v-if="column.key === 'createTime'">
          {{new Date(record.createTime).toLocaleString()}}
        </template>
        <template v-if="column.key === 'userStatus'">
          <a-tag v-if="record.userStatus === 0" color="success">正常</a-tag>
          <a-tag v-else color="success">异常</a-tag>
        </template>

        <template v-if="column.key === 'action'">
          <span>
                <a-popconfirm
                  title="是否确定重置密码为12345678?"
                  @confirm="reset(record)"
                >
                <a-button type="primary" ghost >重置密码</a-button>
              </a-popconfirm>
          </span>
          <span style="margin-left: 10px">
            <a-button danger @click="showModal(record)">删除</a-button>
          </span>
        </template>
      </template>
    </a-table>
  </div>

  <a-modal  v-model:open="open" title="是否确认删除" @ok="confirm" />


</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue";
import myAxios from "@/plugins/myAxios";
import { UserType } from "@/models/user";
import { getCurrentUser } from "@/services/user";
import { Empty, message } from "ant-design-vue";

const columns = [
  { title: '账号', dataIndex: 'userAccount', key: 'userAccount' },
  { title: '姓名', dataIndex: 'username', key: 'username' },
  { title: '性别', dataIndex: 'gender', key: 'gender' },
  { title: '年龄', dataIndex: 'age', key: 'age' },
  { title: '联系方式', dataIndex: 'phone', key: 'phone' },
  { title: '注册日期', dataIndex: 'createTime', key: 'createTime' },
  { title: '账号状态', dataIndex: 'userStatus', key: 'userStatus' },
  { title: '操作', dataIndex: 'action', key: 'action' },
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

  await getData();

})

/**
 * 确认删除
 */
const confirm = async () => {
  const res = await myAxios.post("/user/delete",{
    id: currentRecord.value.id,
  });

  if (res.code === 0) {
    message.success("删除成功");
    await getData();
    open.value = false;

  } else {
    message.error("删除失败，请稍后重试");
  }
}

const getData = async () => {
  const res = await myAxios.get("/user/list",{
    params: {
      type: 1,
    }
  });

  if (res.code === 0) {
    data.value = res.data;
    // console.log("data:",data.value);
  } else {
    message.error("数据获取失败，请稍后重试");
  }
}

const showModal = (record) => {
  currentRecord.value = record;
  open.value = true;
}

const reset = async (record) => {
  const res = await myAxios.get("/user/reset",{
    params: {
      id: record.id,
    }
  });

  if (res.code === 0) {
    message.success("密码重置成功");
  } else {
    message.error("密码重置失败，请稍后重试");
  }
}

</script>

<style scoped>

</style>