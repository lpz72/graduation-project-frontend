<template>
  <div class="elder-emergency-app">
    <!-- 主功能区域 -->
    <div class="main-content">
      <!-- 紧急联系人 -->
      <div class="contacts-section">
        <h3 class="section-title">
          <team-outlined />
          <span>值班医生</span>
        </h3>

        <a-list :data-source="emergencyContacts" class="contacts-list">
          <template #renderItem="{ item }">
            <a-list-item>
              <a-list-item-meta>
                <template #avatar>
                  <a-avatar :src="item.avatar" :style="{ backgroundColor: item.color }">
                    {{ item.username ? item.username.charAt(0) : '医' }}
                  </a-avatar>
                </template>
                <template #title>
                  <a>{{ item.username }}</a>
                </template>
                <template #description>
                  联系电话: {{ item.phone }}
                </template>
              </a-list-item-meta>
              <template #actions>
                <a-button type="link" @click="showModal(item)">
                  <phone-outlined /> 拨打
                </a-button>
              </template>
              <a-modal v-model:open="open"  @ok="submit" >
                <template #title>
                  是否确认拨打{{currentItem.username}}的电话:{{currentItem.phone}}
                </template>
              </a-modal>
            </a-list-item>
          </template>
        </a-list>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {
  TeamOutlined,
  PhoneOutlined,
} from '@ant-design/icons-vue';
import myAxios from "@/plugins/myAxios";
import { message } from "ant-design-vue";

const open = ref(false);
const currentItem = ref();

//展示对话框
const showModal = (item) => {
  open.value = true;
  currentItem.value = item;
  console.log("现在:",item);
};

const submit = async () => {
  open.value = false;
  message.success("拨打成功!");
}


// 紧急联系人，颜色#722ed1,#52c41a,#1890ff
const emergencyContacts = ref([]);


onMounted(async () => {
  const res = await myAxios.get("/appointment/emergency");
  if (res.code === 0) {
    console.log("数据:",res.data);
    emergencyContacts.value = res.data;

    if (emergencyContacts.value.length === 0) {
      emergencyContacts.value.push({
        id: 1,
        username: '社区服务中心',
        phone: '123-4567-8910',
        avatar: '',
        color: '#52c41a',
      });
    } else {
      //map方法会立即返回一个新的数组，而不会等待其中的异步操作完成。
      //因此，emergencyContacts.value 会是一个 Promise 对象的数组，而不是你期望的映射后的数据。
      emergencyContacts.value = await Promise.all(emergencyContacts.value.map(async (item) => {
        console.log("item:", item);
        const res2 = await myAxios.get('/user/search', {
          params: {
            userId: item.workerId,
          }
        });
        if (res2.code === 0) {
          const user = res2.data;
          return {
            id: item.id,
            username: item.username,
            phone: user.phone,
            avatar: user.avatarUrl ? user.avatarUrl : '',
            color: '#1890ff',
          }
        }
      }));
      console.log("111:",emergencyContacts.value);
    }
  }
});
</script>

<style scoped>
.elder-emergency-app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f5f5;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.contacts-section {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-title {
  color: #1890ff;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.section-title span {
  margin-left: 8px;
}

.contacts-list {
  padding: 0 8px;
}

.success-message h3 {
  margin: 16px 0;
  color: #52c41a;
}

.help-item span {
  margin-left: 8px;
}
</style>