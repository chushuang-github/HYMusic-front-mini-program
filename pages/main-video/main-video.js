// pages/main-video/main-video.js
import { getTopMV } from "../../services/video"
Page({
  // 页面的初始数据
  data: {
    videoList: [],
    offset: 0,
    hasMore: true
  },

  // 生命周期函数--监听页面加载
  onLoad() {
    this.fetchTopMV()
  },

  // 网络请求
  // 获取视频列表
  async fetchTopMV() {
    const res = await getTopMV(this.data.offset)
    const newVideoList = [...this.data.videoList, ...res.data]
    this.setData({
      videoList: newVideoList
    })
    // 这个数据变化，不需要页面发生更新，所以不需要使用this.setData进行更新
    this.data.offset = this.data.videoList.length
    this.data.hasMore = res.hasMore
  },

  // 上拉加载
  onReachBottom() {
    // 判断是否有更多的数据，如果有更多的数据才允许上拉加载
    if(!this.data.hasMore) return
    this.fetchTopMV()
  },

  // 下拉刷新
  async onPullDownRefresh() {
    this.data.videoList = []
    this.data.offset = 0
    this.data.hasMore = true
    await this.fetchTopMV()
    // 请求完成，关闭下拉刷新的loading效果
    wx.stopPullDownRefresh()
  },

  // 事件监听
  onVideoItemTap(event) {
    const item = event.currentTarget.dataset.item
    wx.navigateTo({
      url: `/pages/detail-video/detail-video?id=${item.id}`,
    })
  }
})