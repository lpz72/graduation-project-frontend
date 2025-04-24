import { UserType } from "@/models/user";

/**
 * 体检报告表
 */
export type HealthRecordType = {
  id: number;
  username: string;
  idNumber: string;
  gender: number;
  age: number;
  phone: string;
  //眼科
  leftEye: number;
  rightEye: number;
  colorVision: string;
  //五官科
  leftEar: number;
  rightEar: number;
  smell: string;
  stuttering: string;
  faceCondition: string;
  //内科
  heartRate: number;
  breathingRate: number;
  temperature: number;
  highBloodPressure: number;
  lowBloodPressure: number;
  liver: string;
  spleen: string;
  lung: string;
  //外科
  height: number;
  weight: number;
  skin: string;
  limbs: string;
  thyroidGland: string;
  /**
   * 健康状况（0：优 1：良 2：中 3：差）
   */
  healthCondition: number;
  healthAdvice: string;
  nextTime: Date;
  createTime: Date;
  doctor: string;
  institution: string;
  isDelete: number;
};