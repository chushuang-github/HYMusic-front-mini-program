// components/area-header/area-header.js
Component({
  // 组件的属性列表
  properties: {
    title: {
      type: String,
      value: "默认标题"
    },
    rightText: {
      type: String,
      value: "更多"
    },
    showRight: {
      type: Boolean,
      value: true
    }
  },

  methods: {
    onMoreTab() {
      this.triggerEvent("moreClick")
    }
  }
})
