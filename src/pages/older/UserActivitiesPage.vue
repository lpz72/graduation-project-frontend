<template>
  <a-row v-if="activities.length > 0" :gutter="16" class="activity-list">
    <a-col :span="6" v-for="activity in activities" :key="activity.id" style="margin-bottom: 16px">
      <a-card hoverable  class="activity-card">
        <template #cover>
          <img alt="活动头像" :src="picture" />
        </template>
        <a-card-meta :title="activity.title">
          <template #description>
            <div class="activity-info">
              <p class="dept-title">类型: {{activity.type}}</p>
              <p class="dept-title">主题:
                  <a-tag  v-for="tags in activity.tags" :color="'cyan'" size="small">{{tags}}</a-tag>
              </p>
              <p class="people">参与人数: {{activity.currentCount}}/{{activity.peopleCount}}</p>
              <p class="time">时间: {{new Date(activity.startTime).toLocaleString()}} - {{new Date(activity.endTime).toLocaleString()}}</p>
              <p class="position">地点: {{ activity.position }}</p>
              <p>
                <a-button v-if="activity.currentCount === activity.peopleCount" class="submit" type="primary" disabled>人数已满</a-button>
                <a-button v-else-if="activity.status === 0" class="submit" type="primary" @click="showModal(activity)">立即报名</a-button>
                <a-button v-else-if="activity.status === 1"  class="submit" type="primary" >已报名</a-button>
                <a-modal v-model:open="open" title="是否确认报名" @ok="submit" />
              </p>
            </div>
          </template>
        </a-card-meta>
      </a-card>
    </a-col>
  </a-row>
  <a-empty  v-if="activities.length === 0" :image="simpleImage" description="暂无数据" style="margin-top: 100px" />
</template>

<script setup lang="ts">

import picture from "@/assets/活动.png";

import { onMounted, ref } from "vue";
import myAxios from "@/plugins/myAxios";
import { Empty, message } from "ant-design-vue";
import { UserType } from "@/models/user";
import { getCurrentUser } from "@/services/user";
import { JoinActivity } from "@/models/joinActivity";

const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
const activities = ref([]);
const loginUser = ref<UserType>();
const open = ref<boolean>(false);
const currentActivity = ref();

onMounted(async () => {
  loginUser.value = await getCurrentUser();

  const res = await myAxios.get("/activities/recommend");
  if (res.code === 0) {
    activities.value = res.data;
   // const temp = res.data;
   //map会返回个新数组，forEach不会返回新数组
   //  activities.value = temp.map(activity => {
   //    return {
   //      status: 0, //0：立即报名 1：已报名
   //      ...activity,
   //    };
   //  });
    const res2 = await myAxios.get("/activities/history",{
      params: {
        userId: loginUser.value?.id,
      }
    });

    if (res2.code === 0) {
      const temp = res2.data;
      activities.value = activities.value.map((activity) => {
        const hasJoin = temp.some((data) => activity.id === data.activityId);
        activity.tags = JSON.parse(activity.tags || '["无"]');
        return {
          status: hasJoin ? 1 : 0,
          ...activity,
        }
      })
      console.log("参加活动:",activities.value);
    }



  } else {
    message.error("活动获取失败，请刷新重试");
  }
})

const showModal = (activity) => {
  open.value = true;
  currentActivity.value = activity;
}

/**
 * 报名活动，活动当前参加人数+1
 */
const submit = async () => {
  if (currentActivity.value.currentCount === currentActivity.value.peopleCount) {
    message.error("人数已满");
    return;
  }

  const data = ({
    userId: loginUser.value?.id,
    activityId: currentActivity.value.id,
    startTime: currentActivity.value.startTime,
    endTime: currentActivity.value.endTime,
    type: 0,
  });



  const res = await myAxios.post("/activities/add", data);

  if (res.code === 0) {
    currentActivity.value.status = 1;
    currentActivity.value.currentCount ++ ;
    open.value = false;
    message.success("报名成功!");
  } else {
    message.error("报名失败，请刷新重试");
  }
}


</script>



<style scoped>
.activity-list {
  margin-top: 20px;
}

.activity-card {
  cursor: pointer;
  transition: all 0.3s;
  width: 270px;
  height: 350px;
  /*height: 100%;

   */
}

.activity-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}

.activity-card img {
  width: 100%;
  height: 100px; /* 或者 auto */
  object-fit: contain; /* 保持比例并适应容器 */

}

.activity-info {
  font-size: 13px;
}

.activity-info .dept-title {
  color: #1890ff;
  font-weight: 500;
  margin-bottom: 4px;
}

.activity-info .people {
  color: #666;
  margin-bottom: 4px;
}

.activity-info .position {
  color: #666;
  margin-bottom: 4px;
}
.activity-info .time {
  color: #666;
  margin-bottom: 4px;
}
.activity-info .submit {
  margin-top: 10px;
}
</style>