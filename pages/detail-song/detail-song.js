// pages/detail-song/detail-song.js
import recommendStore from "../../store/recommendStore"
import rankingStore from "../../store/rankingStore"
import playerStore from "../../store/playerStore"
import { getPlayListDetail } from "../../services/music"

Page({
  // 页面的初始数据
  data: {
    type: "ranking",
    key: "newRanking",
    songInfo: {}
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    const type = options.type
    this.setData({ type })
    if(type === "ranking") {
      const key = options.key
      this.data.key = key
      rankingStore.onState(key, this.handleRanking)
    }else if(type === "recommend") {
      this.data.key = "recommendSongsInfo"
      recommendStore.onState(this.data.key, this.handleRanking)
    }else if(type === "menu") {
      const id = options.id
      this.fetchMenuSongInfo(id)
    }
  },

  onUnload() {
    if(this.data.type === "ranking") {
      rankingStore.offState(this.data.key, this.handleRanking)
    }else if(this.data.type === "recommend") {
      recommendStore.offState(this.data.key, this.handleRanking)
    }
  },

  // store数据获取
  handleRanking(value) {
    this.setData({
      songInfo: value
    })
    wx.setNavigationBarTitle({
      title: value.name,
    })
  },

  // 网络请求
  async fetchMenuSongInfo(id) {
    const res = await getPlayListDetail(id)
    this.setData({
      songInfo: res.playlist
    })
  },

  // 事件监听
  // 推荐歌曲点击 (收集播放列表，进行播放页面上一首、下一首功能实现)
  onSongItemTap(event) {
    const index = event.currentTarget.dataset.index
    playerStore.setState("playSongList", this.data.songInfo.tracks)
    playerStore.setState("playSongIndex", index)
  }
})