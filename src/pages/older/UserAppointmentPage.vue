<template>
  <div style="display: flex;margin-top: 10px;justify-content: center">
    <a-select
      v-model:value="value1"
      :size="size"
      style="width: 300px"
      placeholder="请选择科室"
      :options="departments"
    ></a-select>
<!--
<span style="margin-left: 10px">
      <a-date-picker v-model:value="time"  :disabled-date="disabledDate"/>
    </span>
-->
    <span>
      <a-select
        v-model:value="value2"
        :size="size"
        style="margin-left: 10px"
        placeholder="请选择人员类型"
        :options="options2"
      ></a-select>
    </span>
    <span>
      <a-button style="margin-left: 10px" type="primary" @click="getSchedule(value1,time,value2)">开始查询</a-button>
    </span>
  </div>
  <a-empty  v-if="finalDoctors.length === 0" :image="simpleImage" description="暂无数据" style="margin-top: 100px;" />

  <!-- 医生卡片列表 -->
  <a-row v-if="finalDoctors.length > 0" :gutter="16" class="doctor-list">
    <a-col :span="6" v-for="doctor in finalDoctors" :key="doctor.workerId" style="margin-bottom: 16px">
      <a-card hoverable @click="showSchedule(doctor)" class="doctor-card">
        <template #cover>
          <img alt="医生头像" :src="getAvatar(doctor.gender)" />
        </template>
        <a-card-meta :title="doctor.username">
          <template #description>
            <div class="doctor-info">
              <p class="dept-title">{{ doctor.department }} | {{ doctor.position }}</p>
              <p class="hospital">{{ doctor.hospital }}</p>
              <p class="specialty">擅长: {{ doctor.specialty }}</p>
            </div>
          </template>
        </a-card-meta>
      </a-card>
    </a-col>
  </a-row>

  <!-- 排班信息模态框 -->
  <a-modal
    v-model:visible="scheduleVisible"
    :title="`${selectedDoctor?.username}医生的排班信息`"
    width="800px"
    :footer="null"
  >
    <div v-if="selectedDoctor">
      <a-descriptions bordered :column="2">
        <a-descriptions-item label="医生姓名">{{ selectedDoctor.username }}</a-descriptions-item>
        <a-descriptions-item label="职称">{{ selectedDoctor.position }}</a-descriptions-item>
        <a-descriptions-item label="所属科室">{{ selectedDoctor.department }}</a-descriptions-item>
        <a-descriptions-item label="所属医院">{{ selectedDoctor.hospital }}</a-descriptions-item>
      </a-descriptions>

      <a-divider orientation="left">本周内排班信息

        <a>(信息每周一定时更新)</a>
      </a-divider>

      <a-table
        :columns="scheduleColumns"
        :data-source="selectedDoctor.schedule"
        :pagination="false"
        row-key="record => record.id"
        :loading="loadingSchedules"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'week'">
            <a >{{map.get(record.week)}}</a>
          </template>
          <template v-if="column.key === 'action'">
            <a-button v-if="record.isAppointment === 0" type="primary" size="small" @click="showModal(record)">预约</a-button>
            <a-button v-if="record.isAppointment === 1" type="primary" size="small" >已预约</a-button>
            <a-modal v-model:open="open" title="是否确认预约" @ok="handleAppointment(currentRecord,selectedDoctor)">
            </a-modal>
          </template>
        </template>
      </a-table>
    </div>
  </a-modal>

</template>
<script lang="ts" setup>

// import 'dayjs/locale/zh-cn';
// import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
// dayjs.locale('zh-cn');
import { Empty, message, SelectProps } from "ant-design-vue";
import { ref } from "vue";
import myAxios from "@/plugins/myAxios";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import manAvatar from "@/assets/男医生.png";
import womenAvatar from "@/assets/女医生.png";
import { getCurrentUser } from "@/services/user";
import { UserType } from "@/models/user";
import { departments } from "@/constants/departments";

const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;

const value1 = ref();
const value2 = ref();
const time = ref<Dayjs>();
let selectTime = ref();
const currentRecord = ref();

const options2 = ref<SelectProps['options']>([
  {value: '0',label: '医生'},
  {value: '1',label: '护士'},
])
const map = new Map([[1,'周一'],[2,'周二'],[3,'周三'],[4,'周四'],[5,'周五'],[6,'周六'],[7,'周日']])

const doctors = ref([]);
const finalDoctors = ref([]);
const schedules = ref([]);
const loginUser = ref<UserType>();

/**
 * 根据科室和日期查询所有医生排班信息
 * @param val
 * @param date
 * @param val2
 */
const getSchedule = async (val:string,date:Dayjs,val2:number) => {
  if(val == null || val2 == null) {
    message.error("请选择科室或人员类型");
    return;
  }
  // selectTime.value = date.format('YYYY-MM-DD');
  loginUser.value = await getCurrentUser();
  const res = await myAxios.get("/appointment/schedule",{
    params: {
      department: val,
      // dateTime: selectTime.value,
      type: val2
    }
  });
  if (res.code === 0) {
    message.success("查询结果如下")
    // schedules.value = [];
    doctors.value = [];
    schedules.value = res.data;
    //将每个医生的排班信息提取出来
    for (const schedule of schedules.value) {
      const {
        workerId,
        username,
        department,
        position,
        type,
        ...scheduleInfo} = schedule; //结构排班信息

      //获取当前医生的个人信息，根据性别展示不同头像
      //因为getGender是异步函数，所以需要await
      const user = await getGender(workerId);
      // console.log("性别1:",gender);
      //查找医生是否已经存在
      let doctor = ref();
      doctor.value = doctors.value.find(doc => doc.id === workerId);

      if (!doctor.value) {
        //医生不存在，创建新医生对象
        doctor.value = {
          id: workerId,username:username,gender:user.gender,department:department,
          position:position,hospital:user.hospital,specialty:user.specialty,type:type,schedule: [] };
        doctors.value.push(doctor.value);
      }

      //将排班信息添加到医生的排班数组中
      doctor.value.schedule.push(scheduleInfo);
    }

    // console.log("所有医生:",doctors.value);

    // 将医生排班信息转换为表格数据格式，并排序
    finalDoctors.value = doctors.value.map(doctor => {
      // 提取医生公共信息
      const doctorInfo = {
        id: doctor.id,
        username: doctor.username,
        gender: doctor.gender,
        department: doctor.department,
        position: doctor.position,
        hospital: doctor.hospital,
        specialty: doctor.specialty,
        type: doctor.type,
        schedule: [] // 存储排班信息
      };

      const sortedSchedules = doctor.schedule.filter(Boolean).sort((a, b) => {
        //使用 localeCompare 方法比较字符串，以确保按时间顺序排列。
        return (a.startTime ?? '') .localeCompare(b.startTime ?? '');
      });

      sortedSchedules.forEach(schedule => {
        if (schedule.category !== 4) {
          doctorInfo.schedule.push({
            week: schedule.week,
            id: schedule.id,
            timeRange: formatTimeRange(schedule.startTime, schedule.endTime),
            startTime: schedule.startTime,
            isAppointment: 0, //0：预约 1：已预约
            numberType: schedule.numberType,
            peopleCount: schedule.peopleCount,
            way: schedule.way,
            fee: schedule.fee,
          });
        }
      });
      return doctorInfo;
    });
  } else {
    message.error("查询失败")
  }

}


const selectedDoctor = ref(null);
const scheduleVisible = ref(false);
const loadingSchedules = ref(false);
const scheduleColumns = [
  { title: '周次', dataIndex: 'week', key: 'week' },
  { title: '时间段', dataIndex: 'timeRange', key: 'timeRange' },
  { title: '号源类型', dataIndex: 'numberType', key: 'numberType' },
  { title: '剩余号数', dataIndex: 'peopleCount', key: 'peopleCount' },
  { title: '费用', dataIndex: 'fee', key: 'fee' },
  { title: '服务类型', dataIndex: 'way', key: 'way' },
  { title: '操作', key: 'action' }
];

/**
 * 显示排班信息
 */
const showSchedule = async (doctor) => {
  // console.log("医生:",doctor);

  const res = await myAxios.get('/appointment/list',{
    params: {
      userId: loginUser.value?.id,
    }
  });

  if (res.code === 0) {
    //判断该用户预约了这个医生哪些排班
    const appointments = res.data;
    doctor.schedule = doctor.schedule.map((schedule) => {
      const isAppointment = appointments.some(
        (appointment) => appointment.scheduleId === schedule.id && appointment.type === 0
      );
      return {
        ...schedule,
        isAppointment: isAppointment ? 1 : 0, // 修改 isAppointment 字段
      };
    });
  }

  selectedDoctor.value = doctor;
  console.log("ddd",selectedDoctor.value);
  scheduleVisible.value = true;
  loadingSchedules.value = true;

  //设置加载效果
  setTimeout(() => {
    loadingSchedules.value = false;
  }, 500);
};

/**
 * 展示预约确认
 */
const open = ref(false);
const showModal = (record) => {
  currentRecord.value = record;
  open.value = true;
};

/**
 * 预约处理
 */
const handleAppointment = async (schedule, doctor) => {
  open.value = false;
  if (schedule.peopleCount === 0) {
    message.error("预约已满");
    return;
  }
  // console.log("doctor:",doctor);
  let name;
  // if (doctor.type === 0) name = "doctor";
  // else name = "nurse";
  //根据预约的本周几，获取具体的日期
  const time = getDateOfWeekDay(schedule.week) + " " + schedule.timeRange;;
  // const time = String(schedule.startTime).substring(0,10) + " " + schedule.timeRange;
  const res = await myAxios.post('/appointment/add', {
    userId: loginUser.value?.id,
    workerId: doctor.id,
    scheduleId: schedule.id,
    username: loginUser.value?.username,
    idNumber: loginUser.value?.idNumber,
    position: doctor.position,
    workerName: doctor.username,
    time: time,
    type: 0, //0表示已预约 1：表示退号
    way: schedule.way,
    department: doctor.department,
    timeRange: schedule.timeRange,
    category: doctor.type,
  });
  if (res.code === 0) {
    message.success("预约成功")
    schedule.peopleCount --;
    schedule.isAppointment = 1;
    // await getSchedule(value1, time);
  } else {
    message.success("预约失败，请稍后重试")
  }

};

/**
 * 将后端每条数据的开始时间与结束时间住转换成hh:mm-hh:mm格式
 * @param startTime
 * @param endTime
 */
function formatTimeRange(startTime, endTime) {
  // 将字符串转换为 Date 对象
  const startDate = new Date(startTime);
  const endDate = new Date(endTime);

  // 获取小时和分钟
  const startHours = String(startDate.getHours()).padStart(2, '0');
  const startMinutes = String(startDate.getMinutes()).padStart(2, '0');
  const endHours = String(endDate.getHours()).padStart(2, '0');
  const endMinutes = String(endDate.getMinutes()).padStart(2, '0');

  // 返回格式化的时间范围
  return `${startHours}:${startMinutes} - ${endHours}:${endMinutes}`;
}

// function getTime(startTime, timeRange) {
//   const startDate = new Date(startTime);
//
//   const year
// }


/**
 * 获取当前医生或护士的信息
 */
const getGender = async (workerId: number) => {
  const res = await myAxios.get("/user/search",{
    params: {
      userId: workerId,
    }
  });

  if (res.code === 0) {
    // console.log("数据:",res.data);
    return  res.data;
  } else {
    message.error("加载失败，请稍后重试");
  }
}

/**
 * 获取医生的头像
 */
const getAvatar = (gender: number) => {
  console.log("性别:",gender);
  if (gender === 0) {
    return manAvatar;
  } else {
    return womenAvatar;
  }
}

const disabledDate = (current: Dayjs) => {

  return current && current < dayjs().startOf('day');
};


// 获取本周的周几的具体日期
function getDateOfWeekDay(targetDay) {
  // 获取当前日期
  const today = new Date();

  // 获取今天是周几（0 表示周日，1 表示周一，...，6 表示周六）
  const currentDay = today.getDay();

  // 计算本周的周一
  const monday = new Date(today);
  monday.setDate(today.getDate() - currentDay + 1);

  // 计算目标周几的日期
  const targetDate = new Date(monday);
  targetDate.setDate(monday.getDate() + targetDay - 1);

  const year = targetDate.getFullYear();
  const month = String(targetDate.getMonth() + 1).padStart(2, '0'); // 月份从 0 开始，需要加 1
  const day = String(targetDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

</script>

<style scoped>
.doctor-list {
  margin-top: 20px;
}

.doctor-card {
  cursor: pointer;
  transition: all 0.3s;
  height: 100%;
}

.doctor-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}

.doctor-card img {
  width: 100%;
  height: 180px; /* 或者 auto */
  object-fit: contain; /* 保持比例并适应容器 */

}

.doctor-info {
  font-size: 13px;
}

.doctor-info .dept-title {
  color: #1890ff;
  font-weight: 500;
  margin-bottom: 4px;
}

.doctor-info .hospital {
  color: #666;
  margin-bottom: 4px;
}

.doctor-info .specialty {
  color: #888;
  margin-bottom: 0;
}
</style>

