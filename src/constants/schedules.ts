import { ref } from "vue";
import { SelectProps } from "ant-design-vue";

export const schedules = ref<SelectProps['options']>([
  {value: 0, label: "早班"},
  {value: 1, label: "中班"},
  {value: 2, label: "晚班"},
  {value: 3, label: "全天"},
  {value: 4, label: "休息"},
]);