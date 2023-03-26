// pages/music-player/music-player.js
import { getSongDetail, getSongLyric } from "../../services/player"
import playerStore from "../../store/playerStore"
import throttle from "../../utils/throttle"
import parseLyric from "../../utils/lyric-parse"

const app = getApp()
const audioContext = wx.createInnerAudioContext()

Page({
  // 页面的初始数据
  data: {
    pageTitles: ["歌曲", "歌词"],
    id: 0,
    currentSong: {},  // 歌曲信息
    lyricInfos: [],   // 歌词
    currentLyricText: "",  // 当前播放的歌词
    currentLyricIndex: 0,  // 当前播放歌词的索引
    lyricScrollTop: 0,     // 歌词滚动距离
    currentPage: 0,
    contentHeight: 0,
    sliderValue: 0,   // 滑块位置
    isSliderChanging: false,     // 进度条是否可以改变
    currentTime: 0,    // 歌曲播放时间
    durationTime: 0,   // 歌曲播放的总时间
    isPlaying: true,   // 音乐是播放还是暂停

    playSongIndex: 0,  // 当前播放列表的索引
    playSongList: [],  // 播放列表
  },

  // 生命周期函数--监听页面加载
  onLoad(options) {
    // 计算内容高度
    const screenHeight = app.globalData.screenHeight
    const statusBarHeight = app.globalData.statusBarHeight
    this.setData({ contentHeight: screenHeight - statusBarHeight - 44 })

    const id = options.id
    this.setData({ id })

    this.fetchSongDetail()
    this.fetchSongLyric()

    // 播放当前的歌曲
    audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
    audioContext.autoplay = true
    // 音乐资源准备好了，播放音乐
    audioContext.onCanplay(() => {
      audioContext.play()
    })
    // 音乐资源等待加载的过程中，暂停播放
    audioContext.onWaiting(() => {
      audioContext.pause()
    })
    // 音乐播放监听
    audioContext.onPlay(() => {
      this.setData({ isPlaying: true })
    })
    // 音乐停止监听
    audioContext.onPause(() => {
      this.setData({ isPlaying: false })
    })
    // 监听音频播放进度更新事件
    // onTimeUpdate回调函数更新频繁，更新时间和滑块，使用节流函数
    const throttleUpdateProgress = throttle(this.updateProgress, 800, { leading: false, trailing: false })
    audioContext.onTimeUpdate(() => {
      if(!this.data.isSliderChanging) {
        throttleUpdateProgress()
      }
      // 匹配歌词
      let i = 0
      for(i; i < this.data.lyricInfos.length; i++) {
        const info = this.data.lyricInfos[i]
        if(info.time > audioContext.currentTime * 1000) {
          break
        }
      }
      const currentIndex = i - 1
      // 歌词索引发生变化的时候，重新设置歌词
      if(this.data.currentLyricIndex !== currentIndex) {
        const currentLyricInfo = this.data.lyricInfos[currentIndex]
        this.setData({
          currentLyricText: currentLyricInfo.text,
          currentLyricIndex: currentIndex,
          // 歌词索引发生变化的时候，歌词向上滚动的距离，35是每一行歌词的高度
          lyricScrollTop: currentIndex * 35
        })
      }
    })

    // 获取store共享数据 (做上一首、下一首需要的音乐列表)
    playerStore.onStates(["playSongList", "playSongIndex"], this.getPlaySongListHandler)
  },

  onUnload() {
    playerStore.offStates(["playSongList", "playSongIndex"], this.getPlaySongListHandler)
  },

  updateProgress() {
    const currentTime = audioContext.currentTime * 1000
    const sliderValue = currentTime / this.data.durationTime * 100
    this.setData({ 
      sliderValue, 
      currentTime 
    })
  },

  // store数据获取
  getPlaySongListHandler({ playSongList, playSongIndex }) {
    if(playSongList) {
      this.setData({ playSongList })
    }
    if(playSongIndex !== undefined) {
      this.setData({ playSongIndex })
    }
  },

  // 网络请求
  // 获取歌曲信息
  async fetchSongDetail() {
    const res = await getSongDetail(this.data.id)
    this.setData({
      currentSong: res.songs[0],
      durationTime: res.songs[0].dt
    })
  },

  // 获取歌词信息
  async fetchSongLyric() {
    const res = await getSongLyric(this.data.id)
    const lrcString = res.lrc.lyric
    const lyricInfos = parseLyric(lrcString)
    this.setData({ lyricInfos })
  },

  // 事件处理
  handleSwiperChange(event) {
    this.setData({ currentPage: event.detail.current })
  },

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
  },

  // 拖动进度条：拖动的过程中，音乐继续沿着当前时间播放，松开鼠标，音乐跳转到对应的时间播放
  // 滑动的过程中，音乐不随之跟着变化播放，但是当前音乐播放时间在页面中实时展示
  // Slider组件bindchanging事件结束的时候，会调用一次bindchange事件的回调函数
  // 滑动结束松开鼠标的时候，会自动调用handleSliderChange方法，内部自动调用的
  // 拖动进度条的时候，不能让onTimeUpdate回调改变sliderValue的值，不然进度条反复横跳
  handleSliderChanging(event) {
    const value = event.detail.value
    const currentTime = this.data.durationTime * value / 100
    this.setData({
      currentTime,
      sliderValue: value,
      isSliderChanging: true
    })
  },

  // 音乐播放/暂停
  onPlayOrPause() {
    // 当前音乐是否暂停或停止状态（只读）
    if(!audioContext.paused) {
      audioContext.pause()
      this.setData({ isPlaying: false })
    }else {
      audioContext.play()
      this.setData({ isPlaying: true })
    }
  }
})