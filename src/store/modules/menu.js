import { constantRoutes } from "@/router";

const state = {
  menus: [...constantRoutes],
};

const mutations = {
  setMenus(state, asyncMenus) {
    state.menus = [...constantRoutes, ...asyncMenus];
  },
};

export default {
  namespaced: true,
  state,
  mutations,
};
