<template>
  <div class="news-list-container">
    <div>
      <img src="../../assets/健康资讯.png" style="width: 100%;height: 100px;margin-bottom: 20px">
    </div>
    <a-collapse v-model:activeKey="activeKey" accordion>
      <a-collapse-panel
        v-for="(item, index) in news"
        :key="index"
        :show-arrow="false"
        class="news-panel"
        @click="addCount(item.id,index)"
      >
        <template #header>
          <div style="display: flex;width: 100%;align-items: center;">
            <a>{{item.title}}</a>
            <span style="margin-left: auto;margin-right: 10px">作者: {{ item.author }}</span>
          </div>
        </template>
        <a-card hoverable class="news-card">
          <a-card-meta class="centered-title">
            <template #title>
              <a>{{item.title}}</a>
            </template>
            <template #description>
              <div v-html="markdownToHtml(item.content)"></div>
            </template>
          </a-card-meta>
        </a-card>
        <div class="news-author" style="display: flex">
          作者: {{ item.author }}
          <span style="margin-left: 10px">阅读量: {{item.readCount}}</span>
          <span style="margin-left: auto;margin-right: 10px">发布时间: {{new Date(item.createTime).toLocaleString()}}</span>
        </div>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import myAxios from '@/plugins/myAxios';
import { message } from "ant-design-vue";
import { marked } from "marked";
import { toFormData } from "axios";

const news = ref([]);
const activeKey = ref('');
const markdownToHtml = (markdown: string) => {
  return marked(markdown);
};

onMounted(async () => {
    const res = await myAxios.get('/news/list');
    if (res.code === 0) {
      news.value = res.data;
      console.log(news.value);
    } else {
      message.error(res.description);
    }
});

/**
 * 增加阅读次数
 * @param id
 */
const addCount = async (id: number,key: string) => {
  //currentKey:当前打开的卡片，如果没打开则是空，只有打开时阅读量+1，这就避免了点击关闭时阅读量+1
  const currentKey = activeKey.value;
  if (currentKey) {
    await myAxios.get('/news/add',{
      params: {
        id: id,
      }
    });
  }



}

</script>

<style scoped>
.news-list-container {
  padding: 20px;
}

.news-panel {
  margin-bottom: 10px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.news-panel:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.news-card {
  width: 100%;
}

.news-author {
  margin-top: 10px;
  color: #666;
  font-size: 14px;
}
/* 使用深度选择器确保样式生效 */
:deep().centered-title .ant-card-meta-title {
  text-align: center;
}

</style>