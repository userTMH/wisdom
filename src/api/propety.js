import request from "@/utils/request";

//物业费列表
export function propertyfeeApi(params) {
  return request({
    url: "/park/propertyfee",
    method: "GET",
    params,
  });
}

//预算金额
export function prepayment(data) {
  return request({
    url: "/park/propertyfee/pre/payment",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data,
  });
}

//查看所有企业
export function enterpriseApi(params) {
  return request({
    url: "/park/all/enterprise",
    method: "GET",
    params,
  });
}

//查看所有楼宇
export function buildingApi(params) {
  return request({
    url: "/park/all/building",
    method: "GET",
    params,
  });
}

//添加账单
export function propertyApi(data) {
  return request({
    url: "/park/propertyfee",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data,
  });
}

//账单详情
export function properfeeApi(id) {
  return request({
    url: `/park/propertyfee/${id}`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

//删除
export function editApi(id) {
  return request({
    url: `/park/propertyfee/${id}`,
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
}
