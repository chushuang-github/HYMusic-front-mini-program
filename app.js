// app.js
App({
  onLaunch() {
    // 获取设备的信息
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.screenWidth = res.screenWidth
        this.globalData.screenHeight = res.screenHeight
      }
    })
  },
  globalData: {
    screenWidth: 375,
    screenHeight: 667
  }
})
