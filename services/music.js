import hyRequest from "./index"

// 轮播图
export function getBannerList() {
  return hyRequest.get("/banner", {
    type: 2
  })
}

// 推荐歌曲
export function getPlayListDetail(id) {
  return hyRequest.get("/playlist/detail", {
    id
  })
}