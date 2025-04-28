<template>
  <div class="schedules-page" style="margin-top: 10px">
    <a-select
      v-model:value="value1"
      :size="size"
      style="width: 300px"
      placeholder="请选择科室"
      :options="departments"
    ></a-select>
    <span>
      <a-select
        v-model:value="value2"
        :size="size"
        style="margin-left: 10px"
        placeholder="请选择人员类型"
        :options="options"
      ></a-select>
    </span>
    <span>
      <a-button style="margin-left: 10px" type="primary" @click="getData(value1,value2)">
        <search-outlined />
        开始查询
      </a-button>
    </span>
  </div>

    <!-- 排班表格 -->
    <a-table
      :columns="columns"
      :dataSource="data"
      style="margin-top: 10px"
      :expand-column-width="100"
      bordered
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'userStatus'">
          <a-tag v-if="record.userStatus === 0" color="success">在岗</a-tag>
          <a-tag v-else color="error">异常</a-tag>
        </template>
        <template v-if="column.key === 'action'">
          <a-button type="link" size="small" @click="showModal(record)">
            添加排班信息
          </a-button>
        </template>
      </template>
      <template #expandColumnTitle>
        <span style="color: lightseagreen" >排班信息</span>
      </template>
      <template #expandedRowRender="{record}">

        <a-table :columns="innerColumns" :data-source="record.schedule" :pagination="false">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'startTime'">
              {{new Date(record.startTime).toLocaleString()}}
            </template>
            <template v-if="column.key === 'endTime'">
              {{new Date(record.endTime).toLocaleString()}}
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

            <template v-if="column.key === 'action'">
              <span>
                 <a-button type="primary" ghost @click="edit(record)">修改</a-button>
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
      </template>

    </a-table>


  <!-- 编辑排班信息 -->
  <div class="modal">

    <a-modal v-model:open="open" title="添加/修改排班信息" @ok="submit">
      <a-form :model="form" ref="formRef">
        <a-form-item
          label="姓名"
          name="username"
        >
          <a-input v-model:value="form.username" disabled />
        </a-form-item>
        <a-form-item
          label="号型"
          name="numberType"
          :rules="[{ required: true, message: '请选择号型' }]"
        >
          <a-select
            v-model:value="form.numberType"
            placeholder="请选择号型"
            :options="options2"
          ></a-select>
        </a-form-item>
        <a-form-item
          label="工作类型"
          name="way"
          :rules="[{ required: true, message: '请选择工作类型' }]"
        >
          <a-select
            v-model:value="form.way"
            placeholder="请选择工作类型"
            :options="options3"
          ></a-select>
        </a-form-item>
        <a-form-item
          label="费用(元)"
          name="fee"
          :rules="[{ required: true, message: '请填写费用' }]"
        >
          <a-input v-model:value="form.fee" placeholder="请填写费用" />
        </a-form-item>
        <a-form-item
          label="最大预约人数"
          name="maxCount"
          :rules="[{ required: true, message: '请填写最大预约人数' }]"
        >
          <a-input v-model:value="form.maxCount" placeholder="请填写最大预约人数" />
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
        <a-form-item
          label="班次"
          name="category"
          :rules="[{ required: true, message: '请选择班次' }]"
        >
          <a-select
            v-model:value="form.category"
            placeholder="请选择班次"
            :options="options4"
          ></a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>


</template>

<script setup lang="ts">
import { ref } from 'vue';
import { DatePicker, Table, Form, Input, Select, Button, SelectProps, message } from "ant-design-vue";
import dayjs from 'dayjs';
import { SearchOutlined } from "@ant-design/icons-vue";
import { departments } from "@/constants/departments";
import myAxios from "@/plugins/myAxios";
const options = ref<SelectProps['options']>([
  {value: 3,label: '医生'},
  {value: 2,label: '护士'},
])

const options2 = ref<SelectProps['options']>([
  {value: '普通号',label: '普通号'},
  {value: '专家号',label: '专家号'},
])

const options3 = ref<SelectProps['options']>([
  {value: '坐诊',label: '坐诊'},
  {value: '上门',label: '上门'},
  {value: '义诊',label: '义诊'},
  {value: '健康护理',label: '健康护理'},
  {value: '住院护理',label: '住院护理'},
  {value: '上门护理',label: '上门护理'},
])

const options4 = ref<SelectProps['options']>([
  {value: 0,label: '早班'},
  {value: 1,label: '中班'},
  {value: 2,label: '晚班'},
  {value: 3,label: '全天'},
  {value: 4,label: '休息'},
])
const value1 = ref();
const value2 = ref();
const currentRecord = ref();
const open = ref(false);
const formRef = ref();
const form = ref();
const init = ref({
  id: undefined,
  workerId: undefined,
  peopleCount: undefined,
  type: undefined,
  username: '',
  numberType: '',
  way: '',
  fee: undefined,
  maxCount: undefined,
  endTime: '',
  startTime: '',
  category: undefined,
  department: '',
})

//数据
const data = ref([]);
let type = 0;

// 列定义
const columns = ref([
  {
    title: '姓名',
    dataIndex: 'username',
    key: 'username'
  },
  {
    title: '科室',
    dataIndex: 'department',
    key: 'department'
  },
  {
    title: '职位',
    dataIndex: 'position',
    key: 'position'
  },
  {
    title: '状态',
    dataIndex: 'userStatus',
    key: 'userStatus'
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
  }
]);

// 子列定义
const innerColumns = [
  // { title: 'id', dataIndex: 'id', key: 'id' },
  { title: '姓名', dataIndex: 'username', key: 'username' },
  // { title: '科室', dataIndex: 'department', key: 'department' },
  // { title: '只为', dataIndex: 'department', key: 'department' },
  { title: '号型', dataIndex: 'numberType', key: 'numberType' },
  { title: '工作类型', dataIndex: 'way', key: 'way' },
  { title: '费用', dataIndex: 'fee', key: 'fee' },
  { title: '最大预约人数', dataIndex: 'maxCount', key: 'maxCount' },
  { title: '开始时间', dataIndex: 'startTime', key: 'startTime' },
  { title: '结束时间', dataIndex: 'endTime', key: 'endTime' },
  { title: '班次', dataIndex: 'category', key: 'category' },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
  },
];

const showModal = (record) => {
  currentRecord.value = record;
  form.value = {...init.value};
  form.value.username = record.username;
  form.value.workerId = record.id;
  form.value.type = record.userRole === 2 ? 1 : 0;
  form.value.department = record.department;
  type = 0;
  open.value = true;
}

const getData = async (val1,val2) => {
  const res = await myAxios.get("/user/list",{
    params:{
      type: val2,
    }
  });

  if (res.code === 0) {
    data.value = res.data.filter(item => {
      return item.department === val1;
    });
    data.value = await Promise.all(data.value.map( async item => {
      const res1 = await myAxios.get("/appointment/schedule/worker", {
        params: {
          userId: item.id,
        }
      });
      if (res1.code === 0) {
        return {
          ...item,
          schedule: res1.data,
        }
      } else {
        return {
          ...item,
          schedule: [],
        }
      }
    }));
    console.log("data:",data.value);
    message.success("查询成功，结果如下");
  } else {
    message.error("查询失败，请稍后重试");
  }
}

const submit = async () => {
  // 验证所有表单
  try {
      formRef.value?.validate();
  } catch (error) {
    message.error("请将排班信息填写完整");
    return;
  }

  if (type === 0) {
    form.value.peopleCount = form.value.maxCount;
    const res = await myAxios.post("/appointment/schedule/add",form.value);
    if (res.code === 0) {
      message.success("添加成功");
      currentRecord.value.schedule.push(form.value);
      open.value = false;
    } else {
      message.error("添加失败，请刷新重试");
    }
  } else {
    form.value.peopleCount = form.value.maxCount;
    console.log("修改:",form.value);
    const res = await myAxios.post("/appointment/schedule/update",form.value);
    if (res.code === 0) {
      message.success("修改成功");
      await getData(value1.value,value2.value);
      open.value = false;
    } else {
      message.error("修改失败，请刷新重试");
    }
  }

}

/**
 * 修改排班信息
 * @param record
 */
const edit =  (record) => {
  // console.log("record:",record);
  form.value = {
    ...record, // 复制其他字段
    startTime: record.startTime ? dayjs(record.startTime) : null, // 转换为 dayjs 对象
    endTime: record.endTime ? dayjs(record.endTime) : null, // 转换为 dayjs 对象
  };
  // console.log("form:",form.value);
  type = 1;
  open.value = true;
}

const onDelete = async (id) => {
  const res = await myAxios.post("/appointment/schedule/delete",{
    id: id,
  });

  if (res.code === 0) {
    message.success("删除成功");
    await getData(value1.value,value2.value);
  } else {
    message.error("删除失败，请稍后重试");
  }
}

</script>

<style scoped>
/* 可根据需要添加自定义样式 */
</style>