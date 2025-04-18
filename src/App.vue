<template>
<!--  设置组件内的语言-->
  <a-config-provider :locale="zhCN" >
    <router-view />
  </a-config-provider>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
// dayjs.locale('zh-cn');
</script>

<style>

</style>
