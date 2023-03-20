// pages/detail-video/detail-video.js
import { getMVURL, getMVDetail, getRelateMV } from "../../services/video"
Page({
  // 页面的初始数据
  data: {
    id: 0,
    mvUrl: "",
    // 弹幕列表
    danmuList: [
      { text: '哈哈哈，真好听', color: '#ff0000', time: 3 }, 
      { text: '呵呵呵，还不错', color: '#ff00ff', time: 8 },
      { text: '嘿嘿嘿，好喜欢', color: '#ffffff', time: 10 }
    ],
    mvInfo: {},
    relateMVList: []
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    const id = options.id
    this.setData({ id })
    this.fetchMVUrl()
    this.fetchMVDetail()
    this.fetchRelateMV()
  },

  // 网络请求
  // 获取mv的地址
  async fetchMVUrl() {
    const res = await getMVURL(this.data.id)
    this.setData({
      mvUrl: res.data.url
    })
  },

  // 获取mv详情
  async fetchMVDetail() {
    const res = await getMVDetail(this.data.id)
    this.setData({
      mvInfo: res.data
    })
  },

  // 推荐mv列表
  async fetchRelateMV() {
    const res = await getRelateMV(this.data.id)
    this.setData({
      relateMVList: res.data
    })
  }
})