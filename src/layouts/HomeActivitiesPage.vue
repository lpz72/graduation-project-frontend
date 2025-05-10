<template>
<div class="container">
  <a-list v-if="activities.length > 0" :grid="{ gutter: 15, column: 2 }" :data-source="activities">
    <template #renderItem="{ item }">
      <a-list-item>
        <a-card hoverable class="activity-card">
          <template #cover>
            <img alt="活动头像" :src="picture" />
          </template>
          <a-card-meta :title="item.title">
            <template #description>
              <div class="activity-info">
                <p class="dept-title">类型: {{ item.type }}</p>
                <p class="dept-title">主题:
                  <a-tag  v-for="tags in item.tags" :color="'cyan'" size="small">{{tags}}</a-tag>
                </p>
                <p class="people">参与人数: {{ item.currentCount }}/{{ item.peopleCount }}</p>
                <p class="time">时间: {{ new Date(item.startTime).toLocaleString() }} - {{ new Date(item.endTime).toLocaleString() }}</p>
                <p class="position">地点: {{ item.position }}</p>
                <p>
                  <a-button v-if="item.currentCount === item.peopleCount" class="submit" type="primary" disabled>人数已满</a-button>
                  <a-button v-else class="submit" type="primary" @click="join">立即报名</a-button>
                </p>
              </div>
            </template>
          </a-card-meta>
        </a-card>
      </a-list-item>
    </template>
  </a-list>
  <a-empty class="empty" v-if="activities.length === 0" :image="simpleImage" description="暂无数据"  />
</div>
</template>

<script setup lang="ts">

import picture from "@/assets/活动.png";

import { onMounted, ref } from "vue";
import myAxios from "@/plugins/myAxios";
import { Empty, message } from "ant-design-vue";
import { UserType } from "@/models/user";
import { getCurrentUser } from "@/services/user";
import { JoinActivity } from "@/models/joinActivity";
import { useRouter } from "vue-router";

const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
const activities = ref([]);
const loginUser = ref<UserType>();
const open = ref<boolean>(false);
const currentActivity = ref();

onMounted(async () => {
  const res = await myAxios.get("/activities/list");
  if (res.code === 0) {
    res.data.forEach(item => {
      item.tags = JSON.parse(item.tags || '["无"]');
    });
    activities.value = res.data;

  } else {
    message.error("活动获取失败，请刷新重试");
  }
})

const router = useRouter();
const join = async () => {
  loginUser.value = await getCurrentUser();
  if (!loginUser.value) {
    await router.push("/home");
    message.warn("请先登录");
  }

}


</script>



<style scoped>

.empty {
  margin-left: 600px;
  margin-top: 225px;
}

.activity-list {
  margin-top: 20px;
}

.activity-card {
  cursor: pointer;
  transition: all 0.3s;
  width: 100%;
  height: 350px;
  position: relative; /* 父容器设置为相对定位 */
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
  /*margin-bottom: 4px;*/
}
.activity-info .time {
  color: #666;
  margin-bottom: 4px;
}

.activity-info .submit {
  margin-top: 5px;
  margin-bottom: 5px;
}


</style>