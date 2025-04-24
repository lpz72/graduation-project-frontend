<template>
  <div class="MedicalRecordPage">
    <a-table
      v-if="data.length > 0"
      :columns="columns"
      :data-source="data"
      :expand-column-width="100"
      :row-key="getRowKey"
    >
      <template #bodyCell="{ column,record }">
        <template v-if="column.key === 'action'">
          <a-button type="link" @click="showDetail(record)">
            <template #icon>
              <CommentOutlined />
            </template>
            点击评价
          </a-button>

        </template>
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

  <div class="comment">
    <a-modal v-model:open="open" @ok="submit" style="width: 500px;height: 300px" title="输入评价">
        <a-textarea v-model:value="currentRecord.comment">

        </a-textarea>
    </a-modal>
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
  { title: '就诊医生', dataIndex: 'doctor', key: 'doctor', fixed: true },
  { title: '护理护士', dataIndex: 'nurse', key: 'nurse' },
  { title: '就诊科室', dataIndex: 'department', key: 'department' },
  { title: '就诊时间', dataIndex: 'createTime', key: 'createTime' },
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

/**
 * 展示评价框
 * @param record
 */
const showDetail = (record) => {
  currentRecord.value = record;
  open.value = true;
}

/**
 * 确认提交评价
 */
const submit = async () => {
  const res = await myAxios.get("/medical/comment",{
    params: {
      id: currentRecord.value.id,
      comment: currentRecord.value.comment,
    }
  });

  if (res.code === 0) {
    message.success("评价提交成功");
    open.value = false;
  } else {
    message.error("评价提交失败，请稍后重试");
  }
}

</script>

<style scoped>

</style>