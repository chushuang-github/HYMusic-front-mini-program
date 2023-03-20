// 网络请求的封装
import { BASE_URL, TIMEOUT } from './config'

class HYRequest {
  request(url, method, params) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: BASE_URL + url,
        timeout: TIMEOUT,
        method: method,
        data: params,
        success: (res) => resolve(res.data),
        fail: reject
      })
    })
  }

  post(url, params) {
    return this.request(url, "POST", params)
  }

  get(url, params) {
    return this.request(url, "GET", params)
  }
}

const hyRequest = new HYRequest()
export default hyRequest