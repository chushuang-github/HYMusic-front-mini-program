// components/top-list-item/top-list-item.js
Component({
  // 组件的属性列表
  properties: {
    itemData: {
      type: Object,
      value: {}
    },
    key: {
      type: String,
      value: ""
    }
  },

  methods: {
    onRankingItemTap() {
      wx.navigateTo({
        url: `/pages/detail-song/detail-song?type=ranking&key=${this.properties.key}`,
      })
    }
  }
})
