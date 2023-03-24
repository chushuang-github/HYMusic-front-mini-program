// app.js
App({
  onLaunch() {
    // 获取设备的信息
    wx.getSystemInfo({
      success: (res) => {
        // 屏幕宽度、屏幕高度、状态栏高度 (有时间、电量的那个)、导航栏高度
        this.globalData.screenWidth = res.screenWidth
        this.globalData.screenHeight = res.screenHeight
        this.globalData.statusBarHeight = res.statusBarHeight
        if (res.platform == 'android') {
          this.globalData.navBarHeight = 48;
        } else {
          this.globalData.navBarHeight = 44;
        }
      }
    })
  },
  globalData: {
    screenWidth: 375,
    screenHeight: 667,
    statusBarHeight: 0,
    navBarHeight: 0
  }
})
