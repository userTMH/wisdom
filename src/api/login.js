import request from "@/utils/request";

export function loginApi(data) {
  return request({
    url: "/park/login",
    method: "POST",
    data,
  });
}
