import axios from "axios";
import store from "@/store";
import { Message } from "element-ui";
import router from "@/router";

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
  timeout: 1000 * 5,
});

// 添加请求拦截器
service.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    if (store.getters.token) {
      config.headers.Authorization = `Bearer ${store.getters.token}`;
    }
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data;

    if (res.code === 10000) {
      return res;
    }

    Message({
      message: res.msg || "Error",
      type: "error",
      duration: 5 * 1000,
    });
    return Promise.reject(new Error(res.msg || "Error"));
  },
  async (error) => {
    // token失效处理
    if (error.response.status === 401 && error.response.data.code === 40001) {
      await store.dispatch("user/logout");
      await store.commit("menu/resetMenu");

      router.push("/login");
      Message({
        message: "登录已过期，请重新登录",
        type: "error",
        duration: 5 * 1000,
      });
      return Promise.reject(new Error("登录已过期，请重新登录"));
    }

    Message({
      message: error.message,
      type: "error",
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);

export default service;
