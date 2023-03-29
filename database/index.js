// 对云开发数据库操作进行封装
export const db = wx.cloud.database()

class HYCollection {
  constructor(collectionName) {
    this.collection = db.collection(collectionName)
  }

  // 数据库操作封装
  // 增
  add(data) {
    return this.collection.add({
      data
    })
  }

  // 删
  // 删除的两种方式：根据id删除单条数据、使用where条件一次性删除多条数据
  // this.collection.doc(_id).remove()
  // this.collection.where({}).remove()
  remove(condition, isDoc = true) {
    if(isDoc) {
      return this.collection.doc(condition).remove()
    }else {
      return this.collection.where(condition).remove()
    }
  }

  // 改
  update(condition, data, isDoc = true) {
    if(isDoc) {
      return this.collection.doc(condition).update({
        data
      })
    }else {
      return this.collection.where(condition).update({
        data
      })
    }
  }

  // 查
  query(offset = 0, size = 20, condition = {}, isDoc = false) {
    if(isDoc) {
      return this.collection.doc(condition).get()
    }else {
      return this.collection.where(condition).skip(offset).limit(size).get()
    }
  }
}

export const favorCollection = new HYCollection("c_favor")
export const likeCollection = new HYCollection("c_like")
export const historyCollection = new HYCollection("c_history")
export const menuCollection = new HYCollection("c_menu")