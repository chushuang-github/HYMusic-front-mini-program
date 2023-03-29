// pages/detail-song/detail-song.js
import recommendStore from "../../store/recommendStore"
import rankingStore from "../../store/rankingStore"
import playerStore from "../../store/playerStore"
import menuStore from "../../store/menuStore"
import { getPlayListDetail } from "../../services/music"

const db = wx.cloud.database()

Page({
  // 页面的初始数据
  data: {
    type: "ranking",
    key: "newRanking",
    songInfo: {},
    menuList: []
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
    }else if(type === "profile") {
      const tabname = options.tabname
      const title = options.title
      this.handleProfileTabInfos(tabname, title)
    }else if(type === "music") {
      const _id = options.id
      this.handleMusic(_id)
    }

    // 歌单数据
    menuStore.onState("menuList", this.handleMenuList)
  },

  onUnload() {
    if(this.data.type === "ranking") {
      rankingStore.offState(this.data.key, this.handleRanking)
    }else if(this.data.type === "recommend") {
      recommendStore.offState(this.data.key, this.handleRanking)
    }
    menuStore.offState("menuList", this.handleMenuList)
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

  handleMenuList(value) {
    this.setData({ menuList: value })
  },

  // 网络请求
  async fetchMenuSongInfo(id) {
    const res = await getPlayListDetail(id)
    this.setData({
      songInfo: res.playlist
    })
  },

  async handleProfileTabInfos(tabname, title) {
    // 动态获取集合
    const collection = db.collection(`c_${tabname}`)
    // 查询数据
    const res = await collection.get()
    this.setData({
      songInfo: {
        name: title,
        tracks: res.data
      }
    })
  },

  async handleMusic(_id) {
    const collection = db.collection('c_menu')
    const res = await collection.doc(_id).get()
    this.setData({
      songInfo: {
        name: res.data.name,
        tracks: res.data.songList
      }
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