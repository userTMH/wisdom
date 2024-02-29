import request from "@/utils/request";

//#region 员工管理
//系统管理-用户管理-用户列表
export function userList(params) {
  return request({
    url: "/park/sys/user",
    method: "GET",
    params,
  });
}
//系统管理-用户管理-添加用户
export function sysuserApi(data) {
  return request({
    url: "/park/sys/user",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data,
  });
}
//所有角色
export function roleList(params) {
  return request({
    url: "/park/sys/role",
    method: "GET",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    params,
  });
}
//系统管理-用户管理-删除用户
export function deleteApi(id) {
  return request({
    url: `/park/sys/user/${id}`,
    method: "DELETE",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
}
//系统管理-用户管理-编辑用户
export function editApi(data) {
  return request({
    url: `/park/sys/user`,
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    data,
  });
}
//系统管理-用户管理-编辑用户
export function resetApi(data) {
  return request({
    url: `/park/sys/user/resetPwd`,
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    data,
  });
}
//#endregion

//#region 角色管理
//系统管理-角色管理-所有角色
export function roleListApi(params) {
  return request({
    url: `/park/sys/role`,
    method: "GET",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    params,
  });
}

//系统管理-角色管理-查询所有功能权限(树形)
export function treeListApi(params) {
  return request({
    url: `/park/sys/permision/all/tree`,
    method: "GET",
    params,
  });
}

//系统管理-角色管理-查询当前角色详情-权限和分配人数
export function sysroleApi(roleId) {
  return request({
    url: `/park/sys/role/${roleId}`,
    method: "GET",
  });
}

//系统管理-角色管理-删除角色
export function deletesApi(id) {
  return request({
    url: `/park/sys/role/${id}`,
    method: "DELETE",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
}

//系统管理-角色管理-添加角色
export function sysroApi(data) {
  return request({
    url: `/park/sys/role`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data,
  });
}

//#endregion
