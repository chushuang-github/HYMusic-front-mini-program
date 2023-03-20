import hyRequest from "./index"

// 视频mv列表
export function getTopMV(offset = 0, limit = 20) {
  return hyRequest.get("/top/mv", {
    offset,
    limit
  })
}

// mv地址
export function getMVURL(id) {
  return hyRequest.get("/mv/url", {
    id
  })
}

// mv详情
export function getMVDetail(id) {
  return hyRequest.get("/mv/detail", {
    mvid: id
  })
}

// 推荐mv列表
export function getRelateMV(id) {
  return hyRequest.get("/related/allvideo", {
    id
  })
}