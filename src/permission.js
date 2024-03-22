import router from "./router";
import store from "./store";
import { Message } from "element-ui";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import { getToken } from "@/utils/auth"; // get token from cookie
import getPageTitle from "@/utils/get-page-title";

import { asyncRouter } from "@/router/asyncRouter";

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ["/login"]; // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start();

  // set page title
  document.title = getPageTitle(to.meta.title);

  // determine whether the user has logged in
  const hasToken = getToken();
  //筛选一级
  const permissionsList = (permis) => {
    const arr = permis.map((item) => {
      return item.split(":")[0];
    });
    return [...new Set(arr)];
  };
  //二级
  const permissionsLists = (permis) => {
    const arr = permis.map((item) => {
      const a = item.split(":");
      return `${a[0]}: ${a[1]}`;
    });
    return [...new Set(arr)];
  };
  //筛选所拥有的数据
  const gitList = (newAdd, newAdds, asyncRouter) => {
    // console.log(newAdds);
    if (newAdd == "*") {
      return asyncRouter;
    }
    const routes = asyncRouter
      .filter((item) => {
        return newAdd.includes(item.permission);
      })
      .map((item) => {
        return {
          ...item,
          children: item.children.filter((e) => {
            return newAdds.includes(e.permission);
          }),
        };
      });
    return routes;
  };

  if (hasToken) {
    if (to.path === "/login") {
      // if is logged in, redirect to the home page
      next({ path: "/" });
      NProgress.done();
    } else {
      const hasGetUserInfo = store.getters.name;
      if (hasGetUserInfo) {
        next();
      } else {
        try {
          const res = await store.dispatch("user/getInfo");
          // console.log(res.data.permissions);
          const newAdd = permissionsList(res.data.permissions);
          const newAdds = permissionsLists(res.data.permissions);
          //一级路由数据
          // console.log(newAdd);
          //二级
          // console.log(newAdds);
          //自定义路由表数据
          // console.log(asyncRouter);
          const asyncList = gitList(newAdd, newAdds, asyncRouter);
          //动态添加路由表
          router.addRoutes([
            ...asyncList,
            // 404 page must be placed at the end !!!
            // { path: "*", redirect: "/404", hidden: true },
          ]);

          store.commit("menu/setMenus", asyncList);

          next(to.fullPath);
        } catch (error) {
          console.log("error=>", error);
          // 失败, 清空token 以及 用户信息
          await store.dispatch("user/logout");
          await store.commit("menu/resetMenu");
          // 进行错误信息提示
          Message.error(error || "Has Error");
          // 跳转到登录页
          next(`/login?redirect=${to.path}`);
          NProgress.done();
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next();
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
