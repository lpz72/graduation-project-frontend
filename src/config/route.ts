import LoginPage from "@/layouts/LoginPage.vue";
import RegisterPage from "@/layouts/RegisterPage.vue";
import UserHomePage from "@/pages/older/UserHomePage.vue";
import AdminHomePage from "@/pages/admin/AdminHomePage.vue";
import NurseHomePage from "@/pages/nurse/NurseHomePage.vue";
import DoctorHomePage from "@/pages/doctor/DoctorHomePage.vue";
import UserInformationPage from "@/pages/older/UserInformationPage.vue";
import UserMedicalCheckRecordPage from "@/pages/older/UserMedicalCheckRecordPage.vue";
import UserAppointmentPage from "@/pages/older/UserAppointmentPage.vue";
import UserActivitiesPage from "@/pages/older/UserActivitiesPage.vue";
import UserEmergencyPage from "@/pages/older/UserEmergencyPage.vue";
import UserLogoutPage from "@/pages/older/UserLogoutPage.vue";
import UserMedicalRecordPage from "@/pages/older/UserMedicalRecordPage.vue";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import UserNewsPage from "@/pages/older/UserNewsPage.vue";

//定义一些路由

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
        { path: '/user/appointment', name: "老人预约信息", component: UserAppointmentPage},
        { path: '/user/activities', name: "老人活动信息", component: UserActivitiesPage},
        { path: '/user/emergency', name: "老人紧急呼救", component: UserEmergencyPage},
        { path: '/user/logout', name: "老人退出登录", component: UserLogoutPage},
    ]},
    { path: '/nurse', name: "护士首页", component: NurseHomePage},
    { path: '/doctor', name: "医生首页", component: DoctorHomePage},

]
const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;