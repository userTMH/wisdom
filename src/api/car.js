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
