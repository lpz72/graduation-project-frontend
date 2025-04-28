<template>
  <div class="news-page">

    <a-button type="primary" @click="addNews" style="margin-top: 10px">
      <template #icon>
        <plus-outlined />
      </template>
      新建资讯
    </a-button>

    <a-table :columns="columns" :data-source="data" :pagination="false" style="margin-top: 10px">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'title'">
          <a @click="edit(record)">
            {{record.title}}
          </a>
        </template>
        <template v-if="column.key === 'createTime'">
          {{new Date(record.createTime).toLocaleString()}}
        </template>
        <template v-if="column.key === 'action'">
              <span>
                 <a-button type="primary" ghost @click="edit(record)">修改</a-button>
              </span>
              <span style="margin-left: 10px">
                <a-popconfirm
                  title="是否确定删除?"
                  @confirm="onDelete(record.id)"
                >
                <a-button danger >删除</a-button>
              </a-popconfirm>
              </span>
        </template>

      </template>
    </a-table>

<!--  编辑文章  -->
    <a-modal v-model:open="open" title="添加/修改排班信息" @ok="submit" style="top: 20px; width: 100%">
    <a-form ref="formRef" :model="article">
      <a-form-item
        label="作者"
        name="author"
        :rules="[{ required: true, message: '请填写作者' }]"
      >
        <a-input v-model:value="article.author" placeholder="请填写作者"/>
      </a-form-item>
      <a-form-item
        label="标题"
        name="title"
        :rules="[{ required: true, message: '请填写标题' }]"
      >
        <a-input v-model:value="article.title" placeholder="请填写标题"/>
      </a-form-item>
      <a-form-item
        label="内容"
        name="content"
        :rules="[{ required: true, message: '请填写内容' }]"
      >
        <v-md-editor
          v-model="article.content"
          :editor="editor"
          :settings="editorSettings"
          :preview-options="{ lineNumbers: true }"
          style="height: 600px"
        />
      </a-form-item>
    </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import VMdEditor from '@kangc/v-md-editor';
import myAxios from "@/plugins/myAxios";
import { message } from "ant-design-vue";
import { PlusOutlined } from "@ant-design/icons-vue";
import VueMarkdownEditor from '@kangc/v-md-editor';
import createAlignPlugin from '@kangc/v-md-editor/lib/plugins/align';

VueMarkdownEditor.use(createAlignPlugin());

const columns = ref([
  {
    title: '标题',
    dataIndex: 'title',
    key: 'title'
  },
  {
    title: '作者',
    dataIndex: 'author',
    key: 'author',
  },
  {
    title: '阅读量',
    dataIndex: 'readCount',
    key: 'readCount'
  },
  {
    title: '发布时间',
    dataIndex: 'createTime',
    key: 'createTime'
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
  }
]);

const data = ref([]);
const open = ref(false);
let type = 0;
const formRef = ref();


// 定义文章信息
const article = ref({
  author: '',
  title: '',
  content: ''
});

// 定义编辑器实例
const editor = ref(VMdEditor);

// 编辑器设置
const editorSettings = ref({
  placeholder: '请输入资讯内容，支持 Markdown 语法',
  theme: 'github'
});


onMounted(async () => {
    await getData();
})

const addNews = async () => {
  open.value = true;
  article.value.author = '';
  article.value.title = '';
  article.value.content = '';
  type = 0;
}

const getData = async () => {
  const res = await myAxios.get("/news/list");
  if (res.code === 0) {
    data.value = res.data;
  } else {
    message.error("数据获取失败，请稍后重试");
  }
}

// 提交文章
const submit = async () => {
  // 验证所有表单
  try {
    formRef.value?.validate();
  } catch (error) {
    message.error("请将数据填写完整");
    return;
  }

  if (type === 0) {
    const res = await myAxios.post("/news/add",article.value);
    if (res.code === 0) {
      message.success("发布成功");
      open.value = false;
      await getData();
    } else {
      message.error("发布失败，请稍后重试")
    }
  } else {
    const res = await myAxios.post("/news/update",article.value);
    if (res.code === 0) {
      message.success("修改成功");
      open.value = false;

    } else {
      message.error("修改失败，请稍后重试")
    }
  }
};

/**
 * 修改文章信息
 * @param record
 */
const edit =  (record) => {
  article.value = record;
  type = 1;
  open.value = true;
}

const onDelete = async (id) => {
  const res = await myAxios.post("/news/delete",{
    id: id,
  });

  if (res.code === 0) {
    message.success("删除成功");
    await getData();
  } else {
    message.error("删除失败，请稍后重试");
  }
}
</script>

<style scoped>
</style>