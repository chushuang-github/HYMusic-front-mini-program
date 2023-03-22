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

// 热门歌单
/**
 * cat："华语"、"古风"、"欧美"、"流行"，默认为 "全部"
 * @param {} idx 
 */
export function getSongMenuList(cat = "全部", limit = 6, offset = 0) {
  return hyRequest.get("/top/playlist", {
    cat,
    limit,
    offset
  })
}