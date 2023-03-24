// pages/music-player/music-player.js
import { getSongDetail, getSongLyric } from "../../services/player"
const app = getApp()
Page({
  // 页面的初始数据
  data: {
    id: 0,
    currentSong: {},
    lrcString: "",
    currentPage: 0,
    contentHeight: 0
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    // 计算内容高度
    const screenHeight = app.globalData.screenHeight
    const statusBarHeight = app.globalData.statusBarHeight
    this.setData({ contentHeight: screenHeight - statusBarHeight - 44 })

    const id = options.id
    this.setData({ id })

    this.fetchSongDetail()
    this.fetchSongLyric()
  },

  // 网络请求
  // 获取歌曲信息
  async fetchSongDetail() {
    const res = await getSongDetail(this.data.id)
    this.setData({
      currentSong: res.songs[0]
    })
  },

  // 获取歌词信息
  async fetchSongLyric() {
    const res = await getSongLyric(this.data.id)
    this.setData({
      lrcString: res.lrc.lyric
    })
  },

  // 事件处理
  handleSwiperChange(event) {
    this.setData({ currentPage: event.detail.current })
  }
})