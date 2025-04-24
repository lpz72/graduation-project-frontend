import { HealthRecordType } from "@/models/healthRecord";

export const draftStore = () => {

  //保存草稿数据
  const save = (key:string,data: HealthRecordType) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  //加载草稿数据
  const load = (key:string): HealthRecordType | null => {
    // 添加数据验证
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  };

  //清除草稿数据
  const clear = (key:string) => {
    localStorage.removeItem(key);
  };

  return { save, load, clear };
};