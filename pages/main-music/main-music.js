// pages/main-music/main-music.js
import { getBannerList, getSongMenuList } from "../../services/music"
import recommendStore from "../../store/recommendStore"
import rankingStore from "../../store/rankingStore"
import playerStore from "../../store/playerStore"
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
    rankingInfos: {},
    currentSong: {},  // 当前正在播放的歌曲信息
    isPlaying: false  // 歌曲是否在播放
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

    playerStore.onStates(["currentSong", "isPlaying"], this.handlePlayInfos)
  },

  onUnload() {
    recommendStore.offState("recommendSongsInfo", this.handleRecommendSongs)
    rankingStore.offState("newRanking", this.getRankingHandle("newRanking"))
    rankingStore.offState("originRanking", this.getRankingHandle("originRanking"))
    rankingStore.offState("upRanking", this.getRankingHandle("upRanking"))

    playerStore.offStates(["currentSong", "isPlaying"], this.handlePlayInfos)
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

  handlePlayInfos({ currentSong, isPlaying }) {
    if(currentSong) {
      this.setData({ currentSong })
    }
    if(isPlaying !== undefined) {
      this.setData({ isPlaying })
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
  },

  // 推荐歌曲点击 (收集播放列表，进行播放页面上一首、下一首功能实现)
  onSongItemTap(event) {
    const index = event.currentTarget.dataset.index
    playerStore.setState("playSongList", this.data.recommendSongs)
    playerStore.setState("playSongIndex", index)
  },

  // 播放、暂停
  onPlayOrPauseBtnTap() {
    playerStore.dispatch("changeMusicStatusAction")
  },

  onAlbumTap() {
    wx.navigateTo({
      url: '/pages/music-player/music-player',
    })
  }
})