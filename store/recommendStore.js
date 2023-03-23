import { HYEventStore } from "hy-event-store"
import { getPlayListDetail } from "../services/music"

const recommendStore = new HYEventStore({
  state: {
    recommendSongsInfo: {}
  },
  actions: {
    async fetchRecommendSongsAction(ctx) {
      const res = await getPlayListDetail(3778678)
      ctx.recommendSongsInfo = res.playlist
    }
  }
})

export default recommendStore