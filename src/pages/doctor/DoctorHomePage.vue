<template>
  <a-layout style="height: 100vh">
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
      <div class="logo" />
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <a-menu-item key="1">
          <router-link to="/doctor/information" />
          <user-outlined />
          <span>个人信息</span>
        </a-menu-item>
        <a-menu-item key="2">
          <router-link to="/doctor/schedule" />
          <ScheduleOutlined />
          <span>排班信息</span>
        </a-menu-item>
        <a-menu-item key="3">
          <router-link to="/doctor/appointment" />
          <HistoryOutlined />
          <span>预约信息</span>
        </a-menu-item>
        <a-sub-menu key="4" title="体检报告">
          <template #icon>
            <profile-outlined />
          </template>
          <a-menu-item key="5">
            <router-link to="/doctor/record/upload" />
            <uploadOutlined />
            <span>上传体检报告</span>
          </a-menu-item>
          <a-menu-item key="6">
            <router-link to="/doctor/record/history" />
            <select-outlined />
            <span>查询体检报告</span>
          </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="8" title="活动信息">
          <template #icon>
            <NotificationOutlined />
          </template>
          <a-menu-item key="9">
            <router-link to="/doctor/activities/join" />
            <NotificationOutlined />
            <span>参加活动</span>
          </a-menu-item>
          <a-menu-item key="10">
            <router-link to="/doctor/activities/history" />
            <NotificationOutlined />
            <span>已报名活动</span>
          </a-menu-item>
        </a-sub-menu>
        <a-menu-item key="11">
          <router-link to="/doctor/emergency/history" />
          <AlertOutlined />
          <span>紧急呼救记录</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0;height: 48px;display: flex; align-items: center;">

        <menu-unfold-outlined
          v-if="collapsed"
          class="trigger"
          @click="() => (collapsed = !collapsed)"
        />
        <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
        <span style="margin-left: 10px;line-height: 48px; font-size: 18px; color: #666;">社区老人健康服务系统</span>
        <span v-if="loginUser && loginUser.id" style="margin-left: auto;margin-right: 20px">
          <a-dropdown>
            <a class="ant-dropdown-link">
              {{loginUser.username ?? "无名"}}
              <DownOutlined />
            </a>
            <template #overlay>
              <a-menu @click="onClick">
                <a-menu-item key="1" @click="logout">退出登录</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </span>
      </a-layout-header>
      <a-layout-content style="margin: 10px; padding: 10px; background: #fff;overflow: auto">
        <div>
          <router-view />
        </div>

      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import {
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  HistoryOutlined,
  ProfileOutlined,
  ScheduleOutlined,
  UploadOutlined,
  SelectOutlined,
  DownOutlined, NotificationOutlined, AlertOutlined
} from "@ant-design/icons-vue";
import myAxios from "@/plugins/myAxios";
import { message } from "ant-design-vue";
import { useRoute, useRouter } from "vue-router";
import { UserType } from "@/models/user";
import { getCurrentUser } from "@/services/user";
const selectedKeys = ref<string[]>([]);
const collapsed = ref<boolean>(false);
const router = useRouter();
const route = useRoute();

const loginUser = ref<UserType>();
// <a-menu-item key="7">
//   <router-link to="/doctor/medical/upload" />
//   <upload-outlined />
//   <span>上传就诊信息</span>
//   </a-menu-item>
const routeToKeyMap = {
  '/doctor/information': '1',
  '/doctor/schedule': '2',
  '/doctor/appointment': '3',
  '/doctor/record/upload': '5',
  '/doctor/record/history': '6',
  '/doctor/medical/upload': '7',
  '/doctor/activities/join': '9',
  '/doctor/activities/history': '10',
  '/doctor/emergency/history': '11',
} as const;
type RoutePath = keyof typeof routeToKeyMap; //指定其类型

onMounted(async () => {
  loginUser.value = await getCurrentUser();
  // console.log("网址：",route.path);
  await router.push(route.path);
  const path = route.path as RoutePath; //进行类型断言
  const matchedKey = routeToKeyMap[path] || '1';
  selectedKeys.value = [matchedKey];
  // console.log(loginUser.value);
})


const logout = async () => {
  const res = await myAxios.post("/user/logout");
  if (res.code === 0 && res.data) {
    message.success("退出成功");
    await router.push({
      path: "/",
      replace: true,
    });
  }
}

</script>

<style>
.trigger {
  font-size: 18px;
  line-height: 48px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
  margin-top: 8px;
}

.trigger:hover {
  color: #1890ff;
}

.logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.3);
  margin: 16px;
}
</style>