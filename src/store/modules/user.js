import { loginApi } from "@/api/login";
import { getInfo } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { resetRouter } from "@/router";

const state = {
  token: getToken() || "",
  userinfo: {},
};

const mutations = {
  setToken(state, token) {
    state.token = token;
    setToken(token);
    // console.log(token);
  },
  removeToken(state) {
    state.token = null;
    state.userinfo = {};
    removeToken();
  },
  userInfo(state, data) {
    state.userinfo = data;
    // console.log(data);
  },
};

const actions = {
  //登录
  async Login(context, data) {
    const res = await loginApi(data);
    // console.log(res);
    context.commit("setToken", res.data.token);
  },
  //退出登录
  removeToken(context, data) {
    context.commit("removeToken");
    // this.$router.push("/login");
  },
  //获取用户信息
  async getInfo(context, data) {
    const res = await getInfo();
    context.commit("userInfo", res.data);
    return res;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
