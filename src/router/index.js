import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true,
  },

  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true,
  },

  {
    path: "/",
    component: Layout,
    redirect: "/workbench",
    children: [
      {
        path: "workbench",
        name: "Workbench",
        component: () => import("@/views/workbench/index"),
        meta: { title: "工作台", icon: "el-icon-monitor" },
      },
    ],
  },

  {
    path: "/system/role/add/",
    name: "add",
    component: () => import("@/views/system/permissionadd/index"),
    Headers: false,
  },
];

const createRouter = () =>
  new Router({
    mode: "history", // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
