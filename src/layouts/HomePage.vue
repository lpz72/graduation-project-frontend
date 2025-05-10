<template>
  <div class="content">
    <!-- 左侧轮播图和资讯区 -->
    <div class="left-section">
      <!-- 轮播图 -->
      <a-carousel autoplay class="banner">
        <div v-for="item in banners" :key="item.id">
          <img :src="item.image" :alt="item.title" class="banner-img" />
          <div class="banner-title">{{ item.title }}</div>
        </div>
      </a-carousel>

      <!-- 活动信息和健康资讯入口 -->
      <div class="info-sections">
        <a-card title="健康活动" class="info-card">
          <template #extra>
            <a @click="goToPage('activities')">更多 ></a>
          </template>
          <a-list item-layout="horizontal" :data-source="activities">
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta :description="new Date(item.createTime).toLocaleDateString()">
                  <template #title>
                    <a  @click="showActivityDetail(item)" style="color:#1890ff;">{{ item.title }}</a>
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
        </a-card>

        <a-card title="健康资讯" class="info-card">
          <template #extra>
            <a @click="goToPage('news')">更多 ></a>
          </template>
          <a-list item-layout="horizontal" :data-source="news">
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta :description="item.author">
                  <template #title>
                    <a @click="showNewsDetail(item)" style="color:#1890ff;">{{ item.title }}</a>
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
        </a-card>
      </div>
    </div>

    <!-- 右侧登录框 -->
    <div class="right-section">
      <a-card v-show="open" title="用户登录" class="login-card">
        <a-form
          :model="formState"
          name="basic"
          autocomplete="off"
          @finish="handleSubmit"
        >
          <a-form-item
            name="userAccount"
            :rules="[{ required: true, message: '请输入账号!' }]"
          >
            <a-input v-model:value="formState.userAccount" placeholder="请输入账号">
              <template #prefix>
                <UserOutlined />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item
            name="userPassword"
            :rules="[{ required: true, message: '请输入密码!' }]"
          >
            <a-input-password v-model:value="formState.userPassword" placeholder="请输入密码">
              <template #prefix>
                <LockOutlined />
              </template>
            </a-input-password>
          </a-form-item>
          <a-form-item
            name="role"
            :rules="[{ required: true, message: '请选择你的身份!' }]"
          >
            <a-select v-model:value="formState.role" placeholder="请选择你的身份">
              <a-select-option value="0">管理员</a-select-option>
              <a-select-option value="1">老人</a-select-option>
              <a-select-option value="2">护士</a-select-option>
              <a-select-option value="3">医生</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item>
            <a-checkbox v-model:checked="formState.remember">记住我</a-checkbox>
            <a class="forgot-password" @click="showForgotPassword">忘记密码?</a>
          </a-form-item>

          <a-form-item>
            <a-button type="primary" html-type="submit" block>登录</a-button>
          </a-form-item>

          <div class="register-link">
            还没有账号? <a @click="goToRegister">立即注册</a>
          </div>
        </a-form>
      </a-card>

      <!-- 注册 -->
      <a-card v-show="!open" title="用户注册" class="login-card">
        <a-form
          :model="formState2"
          name="basic"
          autocomplete="off"
          @finish="handleSubmit"
        >
          <a-form-item
            name="userAccount"
            :rules="[{ required: true, message: '请输入账号!' }]"
          >
            <a-input v-model:value="formState2.userAccount" placeholder="请输入账号">
              <template #prefix>
                <UserOutlined />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item
            name="userPassword"
            :rules="[{ required: true, message: '请输入密码!' }]"
          >
            <a-input-password v-model:value="formState2.userPassword" placeholder="请输入密码">
              <template #prefix>
                <LockOutlined />
              </template>
            </a-input-password>
          </a-form-item>
          <a-form-item
            name="checkPassword"
            :rules="[{ required: true, message: '请再次输入密码!' }]"
          >
            <a-input-password v-model:value="formState2.checkPassword" placeholder="请再次输入密码">
              <template #prefix>
                <LockOutlined />
              </template>
            </a-input-password>
          </a-form-item>
          <a-form-item
            name="role"
            :rules="[{ required: true, message: '请选择你的身份!' }]"
          >
            <a-select v-model:value="formState2.role" placeholder="请选择你的身份">
              <a-select-option value="1">老人</a-select-option>
              <a-select-option value="2">护士</a-select-option>
              <a-select-option value="3">医生</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item>
            <a-button type="primary" html-type="submit" block>注册</a-button>
          </a-form-item>

          <div class="register-link">
            已有账号? <a @click="goToLogin">立即登录</a>
          </div>
        </a-form>
      </a-card>
    </div>

    <!-- 忘记密码模态框 -->
    <a-modal v-model:visible="forgotPasswordVisible" title="找回密码" @ok="close">
    请联系管理员邮箱3072303289@qq.com
    </a-modal>
  </div>
</template>

<script setup lang="ts">

import { LockOutlined, UserOutlined } from "@ant-design/icons-vue";
import banner1 from '@/assets/健康资讯.png';
import banner2 from '@/assets/健康头条.png';
import { useRouter } from "vue-router";
import { ref, reactive, onMounted } from "vue";
import myAxios from "@/plugins/myAxios";
import { message } from "ant-design-vue";

const router = useRouter();
//显示登录框或注册框
const open = ref(true);
let isLogin = true;

// 轮播图数据
const banners = ref([
  { id: 1, image: banner1, title: '关注健康，享受生活' },
  { id: 2, image: banner2, title: '专业医疗团队为您服务' },
]);

// 活动信息
const activities = ref([]);

// 健康资讯
const news = ref([]);

//登录
interface FormState {
  userAccount: string;
  userPassword: string;
  role: string;
  remember: boolean;
}

const formState = reactive<FormState>({
  userAccount: "",
  userPassword: "",
  role: null,
  remember: true,
});

//注册
interface FormState2 {
  userAccount: string;
  userPassword: string;
  checkPassword: string;
  register: number;
  role: string;
}

const formState2 = reactive<FormState2>({
  userAccount: "",
  userPassword: "",
  remember: undefined,
  checkPassword: null,
  role: null,
});
const forgotPasswordVisible = ref(false);


onMounted(async () => {
    await getActivities();
    await getNews();
})

//获取活动
const getActivities = async () => {
  const res = await myAxios.get("/activities/list");
  if (res.code === 0) {
    activities.value = res.data.length >= 3 ? res.data.slice(0,3) : res.data;

  } else {
    message.error("活动获取失败，请刷新重试");
  }
}

//获取资讯
const getNews = async () => {
  const res = await myAxios.get("/news/list");
  if (res.code === 0) {
    news.value = res.data.length >= 3 ? res.data.slice(0,3) : res.data;

  } else {
    message.error("资讯获取失败，请刷新重试");
  }
}

/**
 * 提交表单
 */
const handleSubmit = async () => {
  if (open.value) {
    const res = await myAxios.post("/user/login",
      {
        userAccount: formState.userAccount,
        userPassword: formState.userPassword,
        userRole: Number(formState.role),
      });
    if (res.code === 0 && res.data) {
      message.success("登录成功!");
      // window.location.href = "/register";
      let routePath;
      if (formState.role === "0") routePath = "/admin/users";
      else if (formState.role === "1") routePath = "/user/information";
      else if (formState.role === "2") routePath = "/nurse/information";
      else if (formState.role === "3") routePath = "/doctor/information";
      // console.log("准备跳转到:", routePath); // 检查 routePath 是否正确
      await router.push({
        path: routePath,
        replace: true,
      });
      // console.log("跳转完成"); // 检查是否执行到这里
      // console.log(routePath);
    } else {
      // console.log(res.code);
      message.error(res.description);
    }
  } else {
    const res = await myAxios.post("/user/register",
      {
        userAccount: formState2.userAccount,
        userPassword: formState2.userPassword,
        checkPassword: formState2.checkPassword,
        userRole: Number(formState2.role),
        register: formState2.role === "1" ? 0 : 1,
      });
    // console.log(formState2);
    if (res.code === 0 && res.data) {
      if (formState2.role === "1") message.success("注册成功!");
      else message.success("注册提交成功，等待管理员审核!");
      open.value = true;
    } else {
      // console.log(res.code);
      // message.error(res.message);
      message.error(res.description || "注册失败，请稍后重试");
    }
  }

};


const showForgotPassword = () => {
  forgotPasswordVisible.value = true;
};

const close = () => {
  forgotPasswordVisible.value = false;
};

const goToRegister = () => {
  open.value = false;
};

const goToLogin = () => {
  open.value = true;
};


const goToPage = (page) => {
  router.push(`/${page}`);
};

const showActivityDetail = (item) => {
  router.push('/activities');
};

const showNewsDetail = (item) => {
  router.push('/news');
};
</script>

<style scoped>
.content {
    max-width: 1300px;
    margin: 0 auto;
    display: flex;
    gap: 24px;
    max-height: calc(100vh - 150px); /* 限制高度 */
    overflow: auto; /* 添加滚动条 */
}
.banner {
  border-radius: 8px;
  height: 200px !important;
  /*overflow: hidden;*/
  box-shadow: none !important;
  position: relative; /* 确保内部元素定位正确 */
  /*
  height: 300px; /* 设置固定高度 */
  /*width: 100%; /* 占满宽度 */
}


.banner-img {
  /*
  width: 100%;
  height: 300px;
  object-fit: cover;*/
  width: 100%;
  height: 200px; /* 图片占满轮播图区域 */
  object-fit: cover; /* 防止图片变形 */
}



.banner-title {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  /*background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));*/
  color: #1890ff;
  font-size: 18px;
  font-weight: bold;
}

.info-sections {
  display: flex;
  flex-direction: column; /* 垂直排列 */
  gap: 24px;
}
/*
.info-card {
  flex: 1;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}*/



.info-card {
  max-height: 400px; /* 限制卡片高度 */
  width: auto;
  overflow: hidden; /* 防止内容溢出 */
}

.left-section {
  /*
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-height: calc(100vh - 200px);  /*限制高度 */
  /*overflow: auto;  启用滚动 */
  flex: 1;
  display: flex;
  flex-direction: column; /* 垂直排列 */
  gap: 24px; /* 子元素间距 */
  overflow: auto;
  margin-left: 30px;

}

.right-section {
  width: 360px;
  /*margin-left: 30px;*/
}

.login-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.forgot-password {
  float: right;
}

.register-link {
  text-align: center;
  margin-top: 16px;
}

.social-login {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.social-btn {
  width: 40px;
  height: 40px;
  font-size: 16px;
}
</style>