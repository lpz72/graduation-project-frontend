<template>
  <a-layout style="height: 100vh">
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
      <div class="logo" />
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <a-menu-item key="1">
        <router-link to="/user/information" />
        <user-outlined />
        <span>健康信息</span>
      </a-menu-item>
        <a-menu-item key="2">
          <router-link to="/user/news" />
          <ContainerOutlined />
          <span>健康资讯</span>
        </a-menu-item>
        <a-menu-item key="3">
          <router-link to="/user/record" />
          <HistoryOutlined />
          <span>就诊记录</span>
        </a-menu-item>
        <a-menu-item key="4">
          <router-link to="/user/check" />
          <ProfileOutlined />
          <span>体检记录</span>
        </a-menu-item>
        <a-sub-menu key="5" title="预约信息">
          <template #icon>
            <ScheduleOutlined />
          </template>
            <a-menu-item key="8">
              <router-link to="/user/appointment/doctor" />
              <ScheduleOutlined />
              <span>预约挂号</span>
            </a-menu-item>
            <a-menu-item key="9">
              <router-link to="/user/appointment/history" />
              <ScheduleOutlined />
              <span>预约记录</span>
            </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="6" title="活动信息">
          <template #icon>
            <NotificationOutlined />
          </template>
          <a-menu-item key="10">
            <router-link to="/user/activities/join" />
            <NotificationOutlined />
            <span>参加活动</span>
          </a-menu-item>
          <a-menu-item key="11">
            <router-link to="/user/activities/history" />
            <NotificationOutlined />
            <span>已报名活动</span>
          </a-menu-item>
        </a-sub-menu>
        <a-menu-item key="7">
          <router-link to="/user/emergency" />
          <AlertOutlined />
          <span>紧急求救</span>
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
  ContainerOutlined,
  HistoryOutlined,
  ProfileOutlined,
  ScheduleOutlined,
  NotificationOutlined,
  AlertOutlined,
  LogoutOutlined,
  DownOutlined,
} from '@ant-design/icons-vue';
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

const routeToKeyMap = {
  '/user/information': '1',
  '/user/news': '2',
  '/user/record': '3',
  '/user/check': '4',
  '/user/appointment': '5',
  '/user/activities': '6',
  '/user/emergency': '7',
  '/user/appointment/doctor': '8',
  '/user/appointment/history': '9',
  '/user/activities/join': '10',
  '/user/activities/history': '11',
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