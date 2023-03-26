import { HYEventStore } from "hy-event-store"

const playerStore = new HYEventStore({
  state: {
    playSongList: [],
    playSongIndex: 0
  }
})

export default playerStore