/**
 * 健康信息表
 */
export type InformationType = {
  userId: number;
  id: number;
  weight: number;
  height: number;
  highBloodPressure: number;
  lowBloodPressure: number;
  heartRate: number;
  leftEye: number;
  rightEye: number;
  hypertension: number;
  diabetes: number;
  heartDisease: number;
  stroke: number;
  cancer:number;
  osteoporosis: number;
  otherDiseases: string;
  isDelete: number;
  createTime: Date;
};