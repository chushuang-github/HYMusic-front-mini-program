// components/menu-item/menu-item.js
import { menuCollection } from "../../database/index"
import menuStore from '../../store/menuStore'

Component({
  // 组件的属性列表
  properties: {
    itemData: {
      type: Object,
      value: {}
    }
  },
  methods: {
    async onDeleteTap() {
      const _id = this.properties.itemData._id
      const res = await menuCollection.remove(_id)
      if(res) {
        menuStore.dispatch("fetchMenuListAction")
        wx.showToast({ title: '删除歌单成功' })
      }
    }
  }
})
