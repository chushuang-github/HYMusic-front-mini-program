import { HYEventStore } from "hy-event-store"
import { getSongDetail, getSongLyric } from "../services/player"
import parseLyric from "../utils/lyric-parse"
import { historyCollection } from "../database/index"

// 创建音频播放的实例对象
export const audioContext = wx.createInnerAudioContext()

const playerStore = new HYEventStore({
  state: {
    playSongList: [],  // 播放列表
    playSongIndex: 0,  // 当前播放列表的索引
    id: 0,  // 歌曲id
    currentSong: {},   // 歌曲信息
    currentTime: 0,    // 歌曲播放时间
    durationTime: 0,   // 歌曲播放的总时间
    lyricInfos: [],    // 歌词
    currentLyricText: "",   // 当前播放的歌词
    currentLyricIndex: -1,  // 当前播放歌词的索引
    isPlaying: false,   // 音乐是播放还是暂停
    playModeIndex: 0,   // 0顺序播放，1单曲循环，2随机播放

    isFirstPlay: true,  // 歌曲是否是第一次播放
  },
  actions: {
    // 歌曲信息，歌曲播放功能
    playMusicWithSongIdAction(ctx, id) {
      // 播放歌曲之前，都需要重置数据
      ctx.currentSong = {}
      ctx.durationTime = 0
      ctx.currentTime = 0
      ctx.currentLyricIndex = 0
      ctx.currentLyricText = ""
      ctx.lyricInfos = []
      ctx.isPlaying = true

      // 保存id
      ctx.id = id

      // 获取歌曲详情
      getSongDetail(id).then(res => {
        ctx.currentSong = res.songs[0]
        ctx.durationTime = res.songs[0].dt

        // 歌曲播放存入历史数据库中
        historyCollection.add(res.songs[0])
      })
      // 获取歌词信息
      getSongLyric(id).then(res => {
        const lrcString = res.lrc.lyric
        ctx.lyricInfos = parseLyric(lrcString)
      })

      // 播放当前的歌曲
      audioContext.stop()  // 每次播放歌曲之前，停止播放当前的歌曲
      audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
      audioContext.autoplay = true

      if(ctx.isFirstPlay) {
        ctx.isFirstPlay = false
        // 监听音频播放进度更新事件
        audioContext.onTimeUpdate(() => {
          // 获取歌曲播放的时间
          ctx.currentTime = audioContext.currentTime * 1000
          // 匹配歌词
          if(!ctx.lyricInfos.length) return
          let index = ctx.lyricInfos.length - 1
          for(let i = 0; i < ctx.lyricInfos.length; i++) {
            const info = ctx.lyricInfos[i]
            if(info.time > audioContext.currentTime * 1000) {
              index = i - 1
              break
            }
          }
          // 歌词索引发生变化的时候，重新设置歌词
          if(ctx.currentLyricIndex === index) return

          // 获取当前播放的歌词和当前播放歌词的索引
          const currentLyricInfo = ctx.lyricInfos[index]
          ctx.currentLyricText = currentLyricInfo.text
          ctx.currentLyricIndex = index
        })
        // 音乐资源准备好了，播放音乐
        audioContext.onCanplay(() => {
          audioContext.play()
        })
        // 音乐资源等待加载的过程中，暂停播放
        audioContext.onWaiting(() => {
          audioContext.pause()
        })
        // 监听歌曲播放完毕，自动播放下一首音乐
        audioContext.onEnded(() => {
          // 单曲循环，结束后不需要调用下面的切换下一首音乐的方法
          if(audioContext.loop) return
          // 切换下一首歌曲
          this.dispatch("playNewMusicAction")
        })
      }
    },
    // 播放/暂停
    changeMusicStatusAction(ctx) {
      // 当前音乐是否暂停或停止状态（只读）
      if(!audioContext.paused) {
        audioContext.pause()
        ctx.isPlaying = false
      }else {
        audioContext.play()
        ctx.isPlaying = true
      }
    },
    // 播放模式
    changePlayModeAction(ctx) {
      let modeIndex = ctx.playModeIndex
      modeIndex = modeIndex + 1
      if(modeIndex === 3) modeIndex = 0

      // 设置是否单曲循环
      if(modeIndex === 1) {
        audioContext.loop = true
      }else {
        audioContext.loop = false
      }

      ctx.playModeIndex = modeIndex
    },
    // 上一首/下一首
    playNewMusicAction(ctx, isNext = true) {
      let index = ctx.playSongIndex
      let length = ctx.playSongList.length

      // 计算索引
      // 单曲循环点击下一首，上一首，也是正常切换的，单曲循环只有在音乐自动播放结束的时候，进行单曲循环
      switch(ctx.playModeIndex) {
        case 1:  // 单曲循环
        case 0:  // 顺序播放
          index = isNext ? index + 1 : index - 1
          if(index === -1) index = length - 1
          if(index === length) index = 0
          break
        case 2:  // 随机播放
          index = Math.floor(Math.random() * length)
          break
      }

      // 获取要播放的歌曲
      const newSong = ctx.playSongList[index]

      // 开始播放新的歌曲，改变索引
      ctx.playSongIndex = index
      this.dispatch("playMusicWithSongIdAction", newSong.id)
    }
  }
})

export default playerStore