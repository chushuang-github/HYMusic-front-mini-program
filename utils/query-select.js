// 微信小程序里面，获取元素(组件)的高度 
export function querySelect(selector) {
  return new Promise((resolve, reject) => {
    const query = wx.createSelectorQuery()
    query.select(selector).boundingClientRect((res) => {
      resolve(res)
    }).exec()
  })
}