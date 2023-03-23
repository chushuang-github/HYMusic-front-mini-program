import { HYEventStore } from "hy-event-store"
import { getPlayListDetail } from "../services/music"

const rankingsMap = {
  newRanking: 3779629, 
  originRanking: 2884035, 
  upRanking: 19723756
}

const rankingStore = new HYEventStore({
  state: {
    newRanking: {},     // 新歌id=3779629
    originRanking: {},  // 原创id=2884035
    upRanking: {}       // 飙升id=19723756
  },
  actions: {
    fetchRankingDataAction(ctx) {
      for(const key in rankingsMap) {
        const id = rankingsMap[key]
        getPlayListDetail(id).then(res => {
          ctx[key] = res.playlist
        })
      }
    }
  }
})

export default rankingStore