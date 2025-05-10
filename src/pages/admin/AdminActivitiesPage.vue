<template>
<div class="admin-activities-page">

  <a-button type="primary" @click="addActivity" style="margin-top: 10px;margin-bottom: 10px">
    <template #icon>
      <plus-outlined />
    </template>
    新建活动
  </a-button>

  <a-table :columns="columns" :data-source="data">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'title'">
        <a @click="edit(record)">
          {{record.title}}
        </a>
      </template>
      <template v-if="column.key === 'join'">
        {{record.currentCount}} / {{record.peopleCount}}
      </template>
      <template v-if="column.key === 'startTime'">
        {{new Date(record.startTime).toLocaleString()}}
      </template>
      <template v-if="column.key === 'endTime'">
        {{new Date(record.endTime).toLocaleString()}}
      </template>
      <template v-if="column.key === 'tags'">
        <a-space :size="1">
          <a-tag  v-for="tags in record.tags" :color="'blue'">{{tags}}</a-tag>
        </a-space>

      </template>
<!--      <template v-if="column.key === 'type'">-->
<!--        <a-tag  :color="'cyan'">{{record.type}}</a-tag>-->
<!--      </template>-->
      <template v-if="column.key === 'status'">
        <a-tag  v-if="record.status === 0" color="success">进行中</a-tag>
        <a-tag  v-else color="default">已过期</a-tag>
      </template>
      <template v-if="column.key === 'action'">
        <span>
           <a-button v-if="record.status === 0" type="primary" ghost @click="edit(record)">修改</a-button>
        </span>
        <span style="margin-left: 10px">
          <a-popconfirm
            title="是否确定删除?"
            @confirm="onDelete(record.id)"
          >
          <a-button danger >删除</a-button>
          </a-popconfirm>
        </span>

      </template>
    </template>
  </a-table>
</div>

  <!-- 编辑/添加活动信息 -->
  <div class="modal">
    <a-modal v-model:open="open" title="添加/修改活动信息" @ok="submit">
      <a-form :model="form" ref="formRef">
        <a-form-item
          label="标题"
          name="title"
          :rules="[{ required: true, message: '请填写活动标题' }]"
        >
          <a-input v-model:value="form.title"  placeholder="请填写活动标题"/>
        </a-form-item>
        <a-form-item
          label="类型"
          name="type"
          :rules="[{ required: true, message: '请填写活动类型' }]"
        >
          <a-input v-model:value="form.type"  placeholder="请填写活动类型"/>
        </a-form-item>
        <a-form-item
          label="主题"
          name="tags"
          :rules="[{ required: true, message: '请选择活动主题' }]"
        >
          <a-select
            v-model:value="form.tags"
            :options="options"
            mode="multiple"
            placeholder="请选择活动主题"
            style="width: 100%"
          ></a-select>
        </a-form-item>
        <a-form-item
          label="地点"
          name="position"
          :rules="[{ required: true, message: '请填写活动地点' }]"
        >
          <a-input v-model:value="form.position"  placeholder="请填写活动地点"/>
        </a-form-item>
        <a-form-item
          label="已参与人数"
          name="currentCount"
        >
          <a-input v-model:value="form.currentCount"  disabled/>
        </a-form-item>
        <a-form-item
          label="最大参与人数"
          name="peopleCount"
          :rules="[{ required: true, message: '请填写最大参与人数' }]"
        >
          <a-input v-model:value="form.peopleCount" placeholder="请填写最大参与人数" />
        </a-form-item>
        <a-form-item
          label="开始时间"
          name="startTime"
          :rules="[{ required: true, message: '请选择开始时间' }]"
        >
          <a-date-picker v-model:value="form.startTime" :show-time="{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }"
                         placeholder="请选择开始时间"/>
        </a-form-item>
        <a-form-item
          label="结束时间"
          name="endTime"
          :rules="[{ required: true, message: '请选择结束时间' }]"
        >
          <a-date-picker v-model:value="form.endTime" :show-time="{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }"
                         placeholder="请选择结束时间"/>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>

</template>

<script setup lang="ts">

// 列定义
import { onMounted, ref } from "vue";
import dayjs from "dayjs";
import myAxios from "@/plugins/myAxios";
import { message, type SelectProps } from "ant-design-vue";
import { PlusOutlined } from "@ant-design/icons-vue";

const options = ref<SelectProps['options']>([
  { value: '糖尿病', label: '糖尿病', },
  { value: '高血压', label: '高血压', },
  { value: '心脏病', label: '心脏病', },
  { value: '中风', label: '中风', },
  { value: '骨质疏松', label: '骨质疏松', },
  { value: '冠心病', label: '冠心病', },
  { value: '老年性痴呆', label: '老年性痴呆', },
  { value: '关节炎', label: '关节炎', },

]);

const columns = ref([
  {
    title: '标题',
    dataIndex: 'title',
    key: 'title'
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type'
  },
  {
    title: '主题',
    dataIndex: 'tags',
    key: 'tags',
    width: 150
  },
  {
    title: '地点',
    dataIndex: 'position',
    key: 'position'
  },
  {
    title: '报名情况',
    dataIndex: 'join',
    key: 'join'
  },
  // {
  //   title: '最大参与',
  //   dataIndex: 'peopleCount',
  //   key: 'peopleCount'
  // },
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
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 80
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    width: 170
  }

]);

const form = ref();
const init = ref({
  title: '',
  type: '',
  position: '',
  currentCount: 0,
  peopleCount: undefined,
  startTime: '',
  endTime: '',
  status: '',
  tags: [],
});

const data = ref([]);
const open = ref(false);
const currentRecord = ref();
const formRef = ref();
let type = 0;

onMounted(async () => {
  await getData();
})

const getData = async () => {
  const res = await myAxios.get("/activities/all");
  if (res.code === 0) {
    const date = new Date();
    // data.value = await Promise.all(res.data.map(e => {
    //   const f = new Date(e.endTime) > date ? 0 : 1;
    //   e.tags = JSON.parse(e.tags)
    //   // console.log("e",JSON.parse(e.tags))
    //   return {
    //     ...e,
    //     status: f,
    //   }
    // }))
    data.value = res.data.map(e => {
      const f = new Date(e.endTime) > date ? 0 : 1;
      e.tags = JSON.parse(e.tags || '["无"]')
      // console.log("e",JSON.parse(e.tags))
      return {
        ...e,
        status: f,
      }
    })
  } else {
    message.error("数据获取失败，请稍后重试")
  }
}

//添加活动
const addActivity = async () => {
  form.value = {...init.value};
  open.value = true;
  type = 0;
}

//编辑活动
const edit = async (record) => {
  form.value = {
    ...record, // 复制其他字段
    startTime: record.startTime ? dayjs(record.startTime) : null, // 转换为 dayjs 对象
    endTime: record.endTime ? dayjs(record.endTime) : null, // 转换为 dayjs 对象
  };
  open.value = true;
  type = 1;
}

//删除活动
const onDelete = async (id) => {
  const res = await myAxios.post("/activities/delete", {
    id: id,
  });

  if (res.code === 0) {
    message.success("删除成功");
    await getData();
    open.value = false;
  } else {
    message.error("删除失败，请稍后重试");
  }
}

const submit = async () => {
  // 验证所有表单
  try {
    formRef.value.validate();
  } catch (error) {
    message.error("请将活动信息填写完整");
    return;
  }

  if (type === 0) {
    const res = await myAxios.post("/activities/create",form.value);
    if (res.code === 0) {
      message.success("添加活动成功");
      await getData();
      open.value = false;
    } else {
      message.error("添加活动失败，请稍后重试");
    }
  } else {
    const res = await myAxios.post("/activities/update",form.value);
    if (res.code === 0) {
      message.success("修改活动成功");
      await getData();
      open.value = false;
    } else {
      message.error("修改活动失败，请稍后重试");
    }
  }
}

</script>


<style scoped>

</style>