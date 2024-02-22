import request from "@/utils/request";

export function getInfo() {
  return request({
    url: "park/user/profile",
    method: "get",
  });
}
