// pages/detail-song/detail-song.js
import recommendStore from "../../store/recommendStore"
Page({
  // 页面的初始数据
  data: {
    songs: []
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    recommendStore.onState("recommendSongs", this.handleRecommendSongs)
  },

  onUnload() {
    recommendStore.offState("recommendSongs", this.handleRecommendSongs)
  },

  handleRecommendSongs(value) {
    this.setData({
      songs: value
    })
  }
})