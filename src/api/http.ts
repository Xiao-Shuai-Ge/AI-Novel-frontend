import axios, {AxiosError} from 'axios'
import {useUserStore} from "@/store/user";
import { config } from '@/config.js'

console.log("config.BACKEND_URL", config.BACKEND_URL)

// 创建axios实例
const http = axios.create({
    timeout: 20000
})

// 获取token的函数（方便后续更换存储方式）
const getAToken = () => localStorage.getItem('atoken')
const getRToken = () => localStorage.getItem('rtoken')

// 请求拦截器
http.interceptors.request.use(config => {
    const token = getAToken()
    //console.log("请求拦截器")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// 添加闭包变量控制刷新状态和队列
let isRefreshing = false
let queuedRequests: ((token: string) => void)[] = []

// 响应拦截器
http.interceptors.response.use(
    (response) => {
        // 如果响应状态码是 2xx，直接返回 response
        return response;
    },
    (error) => {
        const originalRequest = error.config;
        const UserStore = useUserStore();
        let returnedPromise: Promise<any>;

        // 如果错误状态码是 401，说明 token 可能失效
        if (error.response && error.response.status === 401) {
            console.log("token 失效，开始刷新 token");

            // 如果已经在刷新 token，将当前请求加入等待队列
            if (!isRefreshing) {
                isRefreshing = true;

                returnedPromise = refreshToken()
                    .then((newAToken) => {
                        // 1. 存储新 token
                        UserStore.setAtoken(newAToken);

                        // 2. 更新后续请求的默认 headers
                        http.defaults.headers.common.Authorization = `Bearer ${newAToken}`;

                        // 3. 重发队列中的请求
                        queuedRequests.forEach((cb) => cb(newAToken));
                        queuedRequests = [];

                        // 4. 重发原始请求
                        originalRequest.headers.Authorization = `Bearer ${newAToken}`;
                        return http(originalRequest);
                    })
                    .catch((err) => {
                        // 刷新失败时清理 token 并跳转登录
                        UserStore.logout();
                        window.location.href = "/login";
                        return Promise.reject(err);
                    })
                    .finally(() => {
                        isRefreshing = false;
                    });
            } else {
                // 如果已经在刷新 token，将当前请求加入队列等待
                returnedPromise = new Promise((resolve) => {
                    queuedRequests.push((newAToken: string) => {
                        originalRequest.headers.Authorization = `Bearer ${newAToken}`;
                        resolve(http(originalRequest));
                    });
                });
            }
        } else {
            // 其他错误，返回一个新的 Promise，包含原始错误和一个标志位
            // returnedPromise = Promise.reject({
            //     error: error,
            //     isErrorHandled: false // 标志位，表示这个错误还没有被处理
            // });
            returnedPromise = Promise.reject(error);
        }

        return returnedPromise;
    }
);

const url = config.BACKEND_USER_URL

// 刷新Token的函数
async function refreshToken() {
    const rtoken = getRToken()
    console.log("rtoken", rtoken)
    if (!rtoken) throw new Error('No refresh token available')

    console.log("发送刷新token请求", rtoken)
    const response = await http.post(url + '/v1/login/refresh-token', {
        rtoken: rtoken
    })
    console.log("刷新token成功", response.data.atoken)
    return response.data.atoken
}

export default http