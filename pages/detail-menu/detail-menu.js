// pages/detail-menu/detail-menu.js
import { getSongMenuTag, getSongMenuList } from "../../services/music"
Page({
  // 页面的初始数据
  data: {
    songMenus: []
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    this.fetchSongMenuTag()
  },

  // 网络请求
  async fetchSongMenuTag() {
    // 获取tags
    const res = await getSongMenuTag()
    const tags = res.tags

    // 根据tags获取对应标签下面的歌单
    const allPromises = []
    for(const tag of tags) {
      const promise = getSongMenuList(tag.name)
      allPromises.push(promise)
    }

    Promise.all(allPromises).then(res => {
      this.setData({
        songMenus: res
      })
    })
  }
})