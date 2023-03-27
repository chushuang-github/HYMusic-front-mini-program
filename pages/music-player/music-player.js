// pages/music-player/music-player.js
import playerStore, { audioContext } from "../../store/playerStore"
import throttle from "../../utils/throttle"

const app = getApp()

Page({
  // 页面的初始数据
  data: {
    // 页面本身的数据
    keys: ["id", "currentSong", "currentTime", "durationTime", "lyricInfos", "currentLyricText", "currentLyricIndex", "isPlaying", "playModeIndex", "playSongList", "playSongIndex"],
    pageTitles: ["歌曲", "歌词"],
    currentPage: 0,
    contentHeight: 0,
    sliderValue: 0,   // 滑块位置
    isSliderChanging: false,     // 进度条是否可以改变
    lyricScrollTop: 0,     // 歌词滚动距离

    // 歌曲播放需要的数据
    playSongIndex: 0,  // 当前播放列表的索引
    playSongList: [],  // 播放列表
    id: 0,
    currentSong: {},  // 歌曲信息
    currentTime: 0,    // 歌曲播放时间
    durationTime: 0,   // 歌曲播放的总时间
    lyricInfos: [],   // 歌词
    currentLyricText: "",   // 当前播放的歌词
    currentLyricIndex: -1,  // 当前播放歌词的索引
    isPlaying: true,   // 音乐是播放还是暂停
    playModeIndex: 0,  // 0顺序播放，1单曲循环，2随机播放

    playModeName: ["order", "repeat", "random"]
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    // 计算内容高度
    const screenHeight = app.globalData.screenHeight
    const statusBarHeight = app.globalData.statusBarHeight
    this.setData({ contentHeight: screenHeight - statusBarHeight - 44 })

    // 根据id播放歌曲
    const id = options.id
    if(id) {
      playerStore.dispatch("playMusicWithSongIdAction", id)
    }

    // 获取store共享数据
    playerStore.onStates(this.data.keys, this.getPlayerInfosHandler)
  },

  onUnload() {
    playerStore.offStates(this.data.keys, this.getPlayerInfosHandler)
  },

  updateProgress: throttle(function(currentTime) {
    if(this.data.isSliderChanging) return
    const sliderValue = currentTime / this.data.durationTime * 100
    this.setData({ sliderValue, currentTime })
  }, 500, { leading: false, trailing: false }),

  // store仓库数据获取：获取歌曲数据
  getPlayerInfosHandler({ id, currentSong, currentTime, durationTime, lyricInfos, currentLyricText, currentLyricIndex, isPlaying, playModeIndex, playSongList, playSongIndex }) {
    if(id !== undefined) {
      this.setData({ id })
    }
    if(currentSong) {
      this.setData({ currentSong })
    }
    if(currentTime !== undefined) {
      this.updateProgress(currentTime)
    }
    if(durationTime !== undefined) {
      this.setData({ durationTime })
    }
    if(lyricInfos) {
      this.setData({ lyricInfos })
    }
    if(currentLyricText) {
      this.setData({ currentLyricText })
    }
    if(currentLyricIndex !== undefined) {
      this.setData({ 
        currentLyricIndex,
        lyricScrollTop: currentLyricIndex * 35
      })
    }
    if(isPlaying !== undefined) {
      this.setData({ isPlaying })
    }
    if(playModeIndex !== undefined) {
      this.setData({ playModeIndex })
    }
    if(playSongList) {
      this.setData({ playSongList })
    }
    if(playSongIndex !== undefined) {
      this.setData({ playSongIndex })
    }
  },

  // 事件处理
  // 返回
  leftClick() {
    wx.navigateBack()
  },

  // 轮播图切换歌曲/歌词
  handleSwiperChange(event) {
    this.setData({ currentPage: event.detail.current })
  },

  // 点击歌曲/歌词
  onNavTabItem(event) {
    const index = event.currentTarget.dataset.index
    this.setData({ currentPage: index })
  },

  // 滑块拖动结束之后触发
  handleSliderChange(event) {
    // 1.获取Slider变化的值
    const value = event.detail.value
    // 2.音乐的总时长 * 进度条百分比 = 当前应该播放的音乐时间
    const currentTime = this.data.durationTime * (value / 100)
    // 3.音乐播放到对应位置，使用seek方法，跳转到指定的时间(单位秒)
    audioContext.seek(currentTime / 1000)
    this.setData({ 
      currentTime, 
      sliderValue: value,
      isSliderChanging: false
    })
    playerStore.setState("isPlaying", true)
  },

  // 拖动进度条：拖动的过程中，音乐继续沿着当前时间播放，松开鼠标，音乐跳转到对应的时间播放
  // 滑动的过程中，音乐不随之跟着变化播放，但是当前音乐播放时间在页面中实时展示
  // Slider组件bindchanging事件结束的时候，会调用一次bindchange事件的回调函数
  // 滑动结束松开鼠标的时候，会自动调用handleSliderChange方法，内部自动调用的
  // 拖动进度条的时候，不能让onTimeUpdate回调改变sliderValue的值，不然进度条反复横跳
  handleSliderChanging: throttle(function(event) {
    const value = event.detail.value
    const currentTime = this.data.durationTime * value / 100
    this.setData({
      currentTime,
      isSliderChanging: true
    })
  }, 100),

  // 音乐播放/暂停
  onPlayOrPause() {
    playerStore.dispatch("changeMusicStatusAction")
  },

  // 播放模式切换
  onModeTap() {
    playerStore.dispatch("changePlayModeAction")
  },

  // 上一首
  onPrevTap() {
    playerStore.dispatch("playNewMusicAction", false)
  },

  // 下一首
  onNextTap() {
    playerStore.dispatch("playNewMusicAction", true)
  }
})