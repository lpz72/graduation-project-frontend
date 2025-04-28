<template>
  <div class="news-list-container" v-if="news.length > 0">
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
            <span style="margin-left: auto;margin-right: 10px">
              <a-tag color="blue">作者: {{item.author}}</a-tag>
              <a-tag color="purple">阅读量: {{item.readCount}}</a-tag>
            </span>
          </div>
        </template>
        <a-card hoverable class="news-card">
          <a-card-meta class="centered-title">
            <template #title>
              <a>{{item.title}}</a>
            </template>
            <template #description>
              <v-md-editor :model-value="item.content" mode="preview"></v-md-editor>
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
  <a-empty class="empty" v-if="news.length === 0" :image="simpleImage" description="暂无数据" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import myAxios from '@/plugins/myAxios';
import { message } from "ant-design-vue";
import { Empty } from 'ant-design-vue';
const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
const news = ref([]);
const activeKey = ref('');
import VueMarkdownEditor from '@kangc/v-md-editor';
import createAlignPlugin from '@kangc/v-md-editor/lib/plugins/align';

VueMarkdownEditor.use(createAlignPlugin());


onMounted(async () => {
    const res = await myAxios.get('/news/list');
    if (res.code === 0) {
      news.value = res.data;
      console.log(news.value);
    } else {
      message.error("数据获取失败，请刷新重试");
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
    await myAxios.get('/news/addReadCount',{
      params: {
        id: id,
      }
    });
  }



}

</script>

<style scoped>

.empty {
  margin-left: 600px;
  margin-top: 225px;
}

.news-list-container {
  padding: 20px;
  width: 100%;
  height: 100%;
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