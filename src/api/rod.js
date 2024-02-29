import request from "@/utils/request";

//#region 一体杆管理
//查看一体杆列表
export function listApi(params) {
  return request({
    url: "/pole/info/list",
    method: "GET",
    params,
  });
}

//添加一体杆
export function infoApi(data) {
  return request({
    url: "/pole/info",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data,
  });
}

//编辑一体杆
export function infosApi(data) {
  return request({
    url: "/pole/info",
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    data,
  });
}

//删除一体杆
export function editApi(ids) {
  return request({
    url: `/pole/info/${ids}`,
    method: "DELETE",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
}

//获取关联区域下拉列表
export function dropListApi(params) {
  return request({
    url: "/parking/area/dropList",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    params,
  });
}

//#endregion
