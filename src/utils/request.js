// 对axios进行二次封装

import axios from 'axios';

// 创建axios实例
const requests = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    // easy-mock服务挂了，暂时不使用了
    // baseURL: 'https://www.easy-mock.com/mock/592501a391470c0ac1fab128',
    //基础路径
    baseURL: "/im",
    //请求不能超过5S
    timeout: 5000
});

// 请求拦截器——发送请求前
requests.interceptors.request.use(
    config => {
        return config;
    },
    error => {
        console.log("请求拦截器错误：",error);
        return Promise.reject();
    }
);

// 响应拦截器——收到响应时
requests.interceptors.response.use(
    response => {
        if (response.status === 200) {
            return response.data;
        } else {
            console.log("请求失败",response)
            Promise.reject();
        }
    },
    error => {
        console.log("响应拦截器错误",error);
        return Promise.reject();
    }
);

export default requests;
