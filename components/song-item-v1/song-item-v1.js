// components/song-item-v1/song-item-v1.js
Component({
  // 组件的属性列表
  properties: {
    itemData: {
      type: Object,
      value: {}
    }
  },
  methods: {
    onSongItemClick() {
      const id = this.properties.itemData.id
      wx.navigateTo({
        url: `/pages/music-player/music-player?id=${id}`,
      })
    }
  }
})
