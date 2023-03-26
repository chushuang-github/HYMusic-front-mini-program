// 歌词解析
// [00:00.000] 作词 : G.E.M.邓紫棋\n
// [00:00.019] 作曲 : G.E.M.邓紫棋\n
// [00:00.038] 编曲 : Lupo Groinig\n
// [00:00.057] 制作人 : Lupo Groinig\n
// [00:00.79]阳光下的泡沫 是彩色的\n
// [00:08.29]就像被骗的我 是幸福的\n
// [00:15.37]追究什么对错 你的谎言\n
// [00:22.32]基于你还爱我\n

// 匹配：[00:58.65]部分，\d{2}表示匹配两个数字
const timeRegExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/

function parseLyric(lyricString) {
  const lyricInfos = []
  const lyricLines = lyricString.split("\n")
  for(const lineString of lyricLines) {
    const timeResult = timeRegExp.exec(lineString)
    if(!timeResult) continue
    // 1.获取时间
    const minute = timeResult[1] * 60 * 1000
    const second = timeResult[2] * 1000
    const millsecond = timeResult[3].length === 2 ? timeResult[3] * 10 : timeResult[3] * 1
    // 每一句歌词所在的毫秒钟
    const time = minute + second + millsecond

    // 2.获取歌词
    const text = lineString.replace(timeResult[0], "")
    lyricInfos.push({ time, text })
  }
  return lyricInfos
}

export default parseLyric