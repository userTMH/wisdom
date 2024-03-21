import { constantRoutes, resetRouter } from "@/router";

const state = {
  menus: [...constantRoutes],
};

const mutations = {
  setMenus(state, asyncMenus) {
    state.menus = [...constantRoutes, ...asyncMenus];
  },
  resetMenu(state) {
    state.menus = constantRoutes;
    resetRouter();
  },
};

export default {
  namespaced: true,
  state,
  mutations,
};
