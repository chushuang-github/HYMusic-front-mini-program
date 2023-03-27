// components/nav-bar/nav-bar.js
Component({
  // 组件接收的属性
  properties: {
    title: {
      type: String,
      value: "默认标题"
    }
  },
  // 小程序组件里面使用多个插槽，必须写下面的属性
  options: {
    multipleSlots: true
  },
  // 组件的初始数据
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight
  },
  methods: {
    onLeftClick() {
      this.triggerEvent("leftClick")
    }
  }
})
