import myAxios from "@/plugins/myAxios";
import {getCurrentUserState, setCurrentUserState} from "@/states/user";

/**
 * 获取当前用户
 */
export const getCurrentUser = async () => {
    //用户量不太多时可以不用在前端缓存用户
    // const currentUser = getCurrentUserState();
    // if (currentUser) {
    //     return currentUser;
    // }

    // 不存在则从远程获取
    const res =  await myAxios.get('/user/current');

    if (res.data) {
        setCurrentUserState(res.data);
        return res.data;
    }
    return null;

}
