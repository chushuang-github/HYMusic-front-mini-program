import { favorCollection, likeCollection } from "../../database/index"
import { menuCollection, db } from "../../database/index"
import menuStore from "../../store/menuStore"

// components/song-item-v2/song-item-v2.js
Component({
  // 组件的属性列表
  properties: {
    itemData: {
      type: Object,
      value: {}
    },
    index: {
      type: Number,
      value: -1
    },
    menuList: {
      type: Array,
      value: []
    }
  },
  methods: {
    onSongItemClick() {
      const id = this.properties.itemData.id
      wx.navigateTo({
        url: `/pages/music-player/music-player?id=${id}`,
      })
    },
    onMoreIconTap() {
      // 从底部弹出的弹窗
      wx.showActionSheet({
        itemList: ["收藏", "喜欢", "添加到歌单"],
        success: (res) => {
          const index = res.tapIndex
          this.handleOperationResult(index)
        }
      })
    },
    async handleOperationResult(index) {
      let res = null
      switch(index) {
        case 0:  // 收藏
          // 添加数据到数据库里面
          res = await favorCollection.add(this.properties.itemData)
          break
        case 1:  // 喜欢
          res = await likeCollection.add(this.properties.itemData)
          break
        case 2:  // 歌单
          wx.showActionSheet({
            itemList: this.properties.menuList.map(item => item.name),
            success: (res) => {
              const menuIndex = res.tapIndex
              this.handleMenuIndex(menuIndex)
            }
          })
          return
      }
      if(res) {
        const title = index === 0 ? '收藏成功' : '喜欢成功'
        wx.showToast({
          title,
          icon: 'success',
          duration: 2000
        })
      }
    },
    async handleMenuIndex(menuIndex) {
      // 1.获取添加记录的歌单
      const menuItem = this.properties.menuList[menuIndex]
      // 2.向menuItem歌单中的songList中添加一条数据
      const data = this.properties.itemData
      const cmd = db.command
      const res = await menuCollection.update(menuItem._id, {
        // 使用command修饰符，数组更新操作符。对一个值为数组的字段，往数组添加一个或多个值
        songList: cmd.push(data)
      })
      if(res) {
        menuStore.dispatch("fetchMenuListAction")
        wx.showToast({ title: '歌单音乐成功' })
      }
    }
  }
})
