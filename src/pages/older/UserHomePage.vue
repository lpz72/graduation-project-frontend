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
        <a-menu-item key="5">
          <router-link to="/user/appointment" />
          <ScheduleOutlined />
          <span>预约信息</span>
        </a-menu-item>
        <a-menu-item key="6">
          <router-link to="/user/activities" />
          <NotificationOutlined />
          <span>活动信息</span>
        </a-menu-item>
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
import { useRouter } from "vue-router";
import { UserType } from "@/models/user";
import { getCurrentUser } from "@/services/user";
const selectedKeys = ref<string[]>(['1']);
const collapsed = ref<boolean>(false);
const router = useRouter();

const loginUser = ref<UserType>();

onMounted(async () => {
  loginUser.value = await getCurrentUser();
  console.log(loginUser.value);
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