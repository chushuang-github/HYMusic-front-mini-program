// components/song-list/song-list.js
const app = getApp()
Component({
  // 组件的属性列表
  properties: {
    title: {
      type: String,
      value: "默认歌单"
    },
    songList: {
      type: Array,
      value: []
    }
  },
  data: {
    screenWidth: 375
  },

  lifetimes: {
    created() {
      this.setData({
        screenWidth: app.globalData.screenWidth
      })
    }
  }
})
