import request from "@/utils/request";

//#region 园区楼宇
//园区楼宇列表数据
export function buildingApi(params) {
  return request({
    url: "/park/building",
    method: "GET",
    params,
  });
}

//园区楼宇新增
export function buildingaddApi(data) {
  return request({
    url: "park/building",
    method: "POST",
    data,
  });
}

//园区楼宇修改
export function buildingreviseApi(data) {
  return request({
    url: "park/building",
    method: "PUT",
    Header: {
      "Content-Type": "application/json",
    },
    data,
  });
}

//园区楼宇删除
export function buildingeditApi(id) {
  return request({
    url: `park/building/${id}`,
    method: "DELETE",
    Header: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
}
//#endregion

//#region 园区企业
//园区企业列表
export function enterpriselistApi(params) {
  return request({
    url: "park/enterprise",
    method: "GET",
    params,
  });
}
//园区企业合同数据
export function enterpriserentApi(id) {
  return request({
    url: `park/enterprise/rent/${id}`,
    method: "GET",
  });
}
//园区企业合同楼宇列表数据
export function enterpribuildingApi(params) {
  return request({
    url: `/park/rent/building`,
    method: "GET",
  });
}
//园区管理-增加企业
export function enterpriseApi(data) {
  return request({
    url: "/park/enterprise",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data,
  });
}
//园区管理-添加/续租企业的租赁合同
export function enterpriseaddApi(data) {
  return request({
    url: "/park/enterprise/rent",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data,
  });
}
//#endregion
