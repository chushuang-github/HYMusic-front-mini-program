import hyRequest from "./index"

// 获取歌曲详情
export function getSongDetail(ids) {
  return hyRequest.get("/song/detail", {
    ids
  })
}

// 获取歌词信息
export function getSongLyric(id) {
  return hyRequest.get("/lyric", {
    id
  })
}