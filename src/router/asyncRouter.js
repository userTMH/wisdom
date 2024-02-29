import Layout from "@/layout";
export const asyncRouter = [
  {
    path: "/park",
    component: Layout,
    redirect: "/park/building",
    name: "Example",
    permission: "park",
    alwaysShow: true,
    meta: { title: "园区管理", icon: "el-icon-s-data" },
    children: [
      {
        path: "building",
        permission: "park: building",
        component: () => import("@/views/park/building/index"),
        meta: { title: "楼宇管理" },
      },
      {
        path: "enterprise",
        permission: "park: enterprise",
        component: () => import("@/views/park/enterprise/index"),
        meta: { title: "企业管理" },
      },
    ],
  },

  {
    path: "/car",
    component: Layout,
    redirect: "/car/area",
    name: "car",
    alwaysShow: true,
    permission: "parking",
    meta: { title: "行车管理", icon: "el-icon-truck" },
    children: [
      {
        path: "area",
        permission: "parking: area",
        component: () => import("@/views/car/area/index"),
        meta: { title: "区域管理" },
      },
      {
        path: "monthCard",
        permission: "parking: card",
        component: () => import("@/views/car/monthCard/index"),
        meta: { title: "月卡管理" },
      },
      {
        path: "pay",
        permission: "parking: payment",
        component: () => import("@/views/car/pay/index"),
        meta: { title: "停车缴费管理" },
      },
      {
        path: "billing",
        permission: "parking: rule",
        component: () => import("@/views/car/billing/index"),
        meta: { title: "计费规则管理" },
      },
    ],
  },

  {
    path: "/propety",
    component: Layout,
    // alwaysShow: true,
    permission: "park",
    children: [
      {
        path: "cost",
        permission: "park: propertyFee",
        component: () => import("@/views/propety/cost"),
        meta: { title: "物业费管理", icon: "el-icon-wallet" },
      },
    ],
  },

  {
    path: "/rod",
    component: Layout,
    redirect: "/rod/manage",
    name: "rod",
    alwaysShow: true,
    permission: "pole",
    meta: { title: "一体杆管理", icon: "el-icon-hot-water" },
    children: [
      {
        path: "manage",
        permission: "pole: info",
        component: () => import("@/views/rod/manage/index"),
        meta: { title: "一体杆管理" },
      },
      {
        path: "warnList",
        permission: "pole: warning",
        component: () => import("@/views/rod/warnList/index"),
        meta: { title: "告警管理" },
      },
    ],
  },

  {
    path: "/system",
    component: Layout,
    redirect: "/system/employee",
    name: "system",
    alwaysShow: true,
    permission: "sys",
    meta: { title: "系统管理", icon: "el-icon-s-operation" },
    children: [
      {
        path: "employee",
        permission: "sys: user",
        component: () => import("@/views/system/employee/index"),
        meta: { title: "员工管理" },
      },
      {
        path: "permission",
        permission: "sys: role",
        component: () => import("@/views/system/permission/index"),
        meta: { title: "角色管理" },
      },
    ],
  },
];
