/**
 * 参加活动类别
 */
export type JoinActivity = {
  userId: number;
  activityId: number;
  startTime: Date;
  endTime: Date;
  type: number;
};
