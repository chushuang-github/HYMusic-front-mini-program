// pages/main-music/main-music.js
import { getBannerList, getSongMenuList } from "../../services/music"
import recommendStore from "../../store/recommendStore"
import rankingStore from "../../store/rankingStore"
import { querySelect } from "../../utils/query-select"
// 使用我们自定义的节流函数，或者使用underscore库里面的节流函数，都是ok的
// import throttle from "../../utils/throttle"
import { throttle } from "underscore"

const querySelectThrottle = throttle(querySelect, 1000)

Page({
  // 页面的初始数据
  data: {
    bannerList: [],
    bannerHeight: 0,
    recommendSongs: [],
    hotMenuList: [],
    recommendMenuList: [],
    rankingInfos: {}
  },

  // 生命周期函数--监听页面加载
  onLoad() {
    this.fetchBannerList()
    this.fetchSongMenuList()

    // 使用store
    recommendStore.onState("recommendSongsInfo", this.handleRecommendSongs)
    rankingStore.onState("newRanking", this.getRankingHandle("newRanking"))
    rankingStore.onState("originRanking", this.getRankingHandle("originRanking"))
    rankingStore.onState("upRanking", this.getRankingHandle("upRanking"))
    recommendStore.dispatch("fetchRecommendSongsAction")
    rankingStore.dispatch("fetchRankingDataAction")
  },

  onUnload() {
    recommendStore.offState("recommendSongsInfo", this.handleRecommendSongs)
    rankingStore.offState("newRanking", this.getRankingHandle("newRanking"))
    rankingStore.offState("originRanking", this.getRankingHandle("originRanking"))
    rankingStore.offState("upRanking", this.getRankingHandle("upRanking"))
  },

  // 从store获取数据
  handleRecommendSongs(value) {
    if(!value.tracks) return
    this.setData({
      recommendSongs: value.tracks.slice(0, 6)
    })
  },

  getRankingHandle(ranking) {
    return (value) => {
      this.setData({
        rankingInfos: { ...this.data.rankingInfos, [ranking]: value }
      })
    }
  },

  // 网络请求
  // 获取轮播图
  async fetchBannerList() {
    const res = await getBannerList()
    this.setData({
      bannerList: res.banners
    })
  },

  // 歌单
  fetchSongMenuList() {
    getSongMenuList().then(res => {
      this.setData({
        hotMenuList: res.playlists
      })
    })
    getSongMenuList("华语").then(res => {
      this.setData({
        recommendMenuList: res.playlists
      })
    })
  },

  // 事件处理函数
  // 点击搜索
  onSearchClick() {
    wx.navigateTo({
      url: '/pages/detail-search/detail-search',
    })
  },

  // 图片加载完成
  onBannerImageLoad() {
    querySelectThrottle(".banner-image").then(res => {
      this.setData({
        bannerHeight: res.height
      })
    })
  },

  // 推荐歌曲更多
  onRecommendMoreClick() {
    wx.navigateTo({
      url: `/pages/detail-song/detail-song?type=recommend`,
    })
  }
})