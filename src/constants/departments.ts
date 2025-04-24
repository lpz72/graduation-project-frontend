import { ref } from "vue";
import { SelectProps } from "ant-design-vue";

export const departments = ref<SelectProps['options']>([
  {value: "疼痛科", label: "疼痛科"},
  {value: "皮肤科", label: "皮肤科"},
  {value: "五官科", label: "五官科"},
]);