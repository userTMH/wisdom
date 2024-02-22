import request from "@/utils/request";

//#region 行车管理
//列表数据
export function listApi(params) {
  return request({
    url: `/parking/area/list`,
    method: "GET",
    params,
  });
}
//关联下拉数据
export function dropListApi(params) {
  return request({
    url: `/parking/rule/list`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    params,
  });
}
//添加数据
export function areaApi(data) {
  return request({
    url: `/parking/area`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data,
  });
}
//删除数据
export function deleteApi(id) {
  return request({
    url: `/parking/area/${id}`,
    method: "DELETE",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
}
//编辑数据
export function areasApi(data) {
  return request({
    url: `/parking/area`,
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    data,
  });
}
//#endregion

//#region 停车缴费管理
//查看停车缴费列表
export function paymentlistApi(params) {
  return request({
    url: "/parking/payment/list",
    method: "GET",
    params,
  });
}

//#endregion

//#region 计费规则管理
//计费规则列表
export function rulelistApi(params) {
  return request({
    url: "/parking/rule/list",
    method: "GET",
    params,
  });
}
//添加计费规则
export function ruleListApi(data) {
  return request({
    url: "/parking/rule",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data,
  });
}
//编辑回显
export function ruleeApi(id) {
  return request({
    url: `/parking/rule/${id}`,
    method: "GET",
  });
}
//编辑
export function parkingListApi(data) {
  return request({
    url: "/parking/rule",
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    data,
  });
}
//删除
export function editApi(id) {
  return request({
    url: `/parking/rule/${id}`,
    method: "DELETE",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
}
//#endregion
