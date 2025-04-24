import LoginPage from "@/layouts/LoginPage.vue";
import RegisterPage from "@/layouts/RegisterPage.vue";
import UserHomePage from "@/pages/older/UserHomePage.vue";
import AdminHomePage from "@/pages/admin/AdminHomePage.vue";
import NurseHomePage from "@/pages/nurse/NurseHomePage.vue";
import DoctorHomePage from "@/pages/doctor/DoctorHomePage.vue";
import UserInformationPage from "@/pages/older/UserInformationPage.vue";
import UserMedicalCheckRecordPage from "@/pages/older/UserMedicalCheckRecordPage.vue";
import UserActivitiesPage from "@/pages/older/UserActivitiesPage.vue";
import UserEmergencyPage from "@/pages/older/UserEmergencyPage.vue";
import UserLogoutPage from "@/pages/older/UserLogoutPage.vue";
import UserMedicalRecordPage from "@/pages/older/UserMedicalRecordPage.vue";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import UserNewsPage from "@/pages/older/UserNewsPage.vue";
import UserAppointmentPage from "@/pages/older/UserAppointmentPage.vue";
import UserAppointmentHistoryPage from "@/pages/older/UserAppointmentHistoryPage.vue";
import UserActivitiesHistoryPage from "@/pages/older/UserActivitiesHistoryPage.vue";
import NurseInformationPage from "@/pages/nurse/NurseInformationPage.vue";
import NurseSchedulePage from "@/pages/nurse/NurseSchedulePage.vue";
import NurseAppointmentPage from "@/pages/nurse/NurseAppointmentPage.vue";
import NurseRecordPage from "@/pages/nurse/NurseRecordPage.vue";
import DoctorInformationPage from "@/pages/doctor/DoctorInformationPage.vue";
import DoctorSchedulePage from "@/pages/doctor/DoctorSchedulePage.vue";
import DoctorAppointmentPage from "@/pages/doctor/DoctorAppointmentPage.vue";
import DoctorEditCheckRecordPage from "@/pages/doctor/DoctorEditCheckRecordPage.vue";
import DoctorSelectCheckRecordPage from "@/pages/doctor/DoctorSelectCheckRecordPage.vue";
import DoctorEditMedicalRecordPage from "@/pages/doctor/DoctorEditMedicalRecordPage.vue";
import DoctorEmergencyHistoryPage from "@/pages/doctor/DoctorEmergencyHistoryPage.vue";

//定义一些路由
//name相当于key，不能重复
const routes: Array<RouteRecordRaw> = [
    { path: '/', name: "首页登录", component: LoginPage }, //默认路由
    { path: '/register',name: "注册", component: RegisterPage},
    { path: '/admin', name: "管理员首页", component: AdminHomePage },
    { path: '/user', name: "老人首页", component: UserHomePage,
    children: [
        { path: '/user/information', name: "老人个人信息", component: UserInformationPage},
        { path: '/user/news', name: "健康资讯", component: UserNewsPage},
        { path: '/user/record', name: "老人就诊记录", component: UserMedicalRecordPage},
        { path: '/user/check', name: "老人体检记录", component: UserMedicalCheckRecordPage},
        { path: '/user/appointment/doctor', name: "预约医生或护士信息", component: UserAppointmentPage},
        { path: '/user/appointment/history', name: "预约记录", component: UserAppointmentHistoryPage},
        { path: '/user/activities/join', name: "所有活动页面", component: UserActivitiesPage},
        { path: '/user/activities/history', name: "已参加活动页面", component: UserActivitiesHistoryPage},
        { path: '/user/emergency', name: "老人紧急呼救", component: UserEmergencyPage},
        { path: '/user/logout', name: "老人退出登录", component: UserLogoutPage},
    ]},
    { path: '/nurse', name: "护士首页", component: NurseHomePage,
    children: [
        { path: '/nurse/information', name: "护士个人信息页面", component: NurseInformationPage},
        { path: '/nurse/schedule', name: "护士排班信息页面", component: NurseSchedulePage},
        { path: '/nurse/appointment', name: "护士预约信息页面", component: NurseAppointmentPage},
        { path: '/nurse/record', name: "护士护理记录页面", component: NurseRecordPage},
        { path: '/nurse/activities/join', name: "护士所有活动页面", component: UserActivitiesPage},
        { path: '/nurse/activities/history', name: "护士已参加活动页面", component: UserActivitiesHistoryPage},
    ]},
    { path: '/doctor', name: "医生首页", component: DoctorHomePage,
    children: [
        { path: '/doctor/information', name: "医生个人信息页面", component: DoctorInformationPage},
        { path: '/doctor/schedule', name: "医生排班信息页面", component: DoctorSchedulePage},
        { path: '/doctor/appointment', name: "医生预约信息页面", component: DoctorAppointmentPage},
        { path: '/doctor/record/upload', name: "医生上传病人体检报告页面", component: DoctorEditCheckRecordPage},
        { path: '/doctor/record/history', name: "医生查询病人体检报告页面", component: DoctorSelectCheckRecordPage},
        { path: '/doctor/medical/upload', name: "医生上传病人就诊信息页面", component: DoctorEditMedicalRecordPage},
        { path: '/doctor/activities/join', name: "医生所有活动页面", component: UserActivitiesPage},
        { path: '/doctor/activities/history', name: "医生已参加活动页面", component: UserActivitiesHistoryPage},
        { path: '/doctor/emergency/history', name: "医生收到的紧急呼救记录页面", component: DoctorEmergencyHistoryPage},
    ]},

]
const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;