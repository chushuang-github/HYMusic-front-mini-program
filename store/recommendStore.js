import { HYEventStore } from "hy-event-store"
import { getPlayListDetail } from "../services/music"

const recommendStore = new HYEventStore({
  state: {
    recommendSongs: []
  },
  actions: {
    async fetchRecommendSongsAction(ctx) {
      const res = await getPlayListDetail(3778678)
      const recommendSongs = res.playlist.tracks
      ctx.recommendSongs = recommendSongs
    }
  }
})

export default recommendStore