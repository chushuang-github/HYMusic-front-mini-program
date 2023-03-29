// pages/main-profile/main-profile.js
import { menuCollection } from "../../database/index"
import menuStore from '../../store/menuStore'

Page({
  // 页面的初始数据
  data: {
    userInfo: {},     // 用户信息
    isLogin: false,   // 用户是否登录
    tabs: [
      { name: '我的收藏', type: 'favor', icon: 'star' },
      { name: '我的喜欢', type: 'like', icon: 'like' },
      { name: '历史记录', type: 'history', icon: 'clock' }
    ],
    isShowDialog: false,
    menuName: "",
    menuList: []
  },

  // 生命周期函数--监听页面加载
  onLoad() {
    // 判断用户是否登录
    const openid = wx.getStorageSync('openid')
    const userInfo = wx.getStorageSync('userInfo')
    this.setData({ isLogin: !!openid })
    if(this.data.isLogin) {
      this.setData({ userInfo })
    }

    // 获取歌单
    menuStore.onState("menuList", this.handleMenuList)
  },

  onUnload() {
    menuStore.offState("menuList", this.handleMenuList)
  },

  // store数据获取
  handleMenuList(value) {
    this.setData({ menuList: value })
  },

  // 事件监听
  // 登录，获取用户信息和openid
  async onUserInfoTap() {
    // 1.获取用户的头像和昵称
    // 注意：我自己测试，使用2.15.0以下的版本，控制台都会报错
    const profile = await wx.getUserProfile({
      desc: '获取您的头像和昵称'
    })

    // 2.获取用户的openid (openid是用户的唯一标识)
    // 正常公司服务器，使用token判断用户有没有登录; 在我们云开发里面，使用openid来判断用户有没有登录
    const loginRes = await wx.cloud.callFunction({
      name: 'music-login'
    })
    const openid = loginRes.result.openid

    // 3.用户信息保存到本地
    wx.setStorageSync('openid', openid)
    wx.setStorageSync('userInfo', profile.userInfo)

    // 4.设置数据
    this.setData({ 
      isLogin: true, 
      userInfo: profile.userInfo 
    })
  },

  // 点击我的收藏、我的喜欢、历史记录
  onTabItem(event) {
    const item = event.currentTarget.dataset.item
    wx.navigateTo({
      url: `/pages/detail-song/detail-song?type=profile&tabname=${item.type}&title=${item.name}`,
    })
  },

  // 点击创建歌单加号
  onPlusTap() {
    this.setData({ isShowDialog: true })
  },

  // 弹窗创建确认按钮点击
  async onConfirm() {
    // 1.获取歌单名称
    const menuName = this.data.menuName
    // 2.模拟歌单数据
    const menuRecord = {
      name: menuName,
      songList: []
    }
    // 3.将歌单数据添加到数据库中
    const res = await menuCollection.add(menuRecord)
    if(res) {
      menuStore.dispatch("fetchMenuListAction")
      wx.showToast({ title: '添加歌单成功' })
    }
  },

  // 我的歌单点击
  onMenuItem(event) {
    const item = event.currentTarget.dataset.item
    wx.navigateTo({
      url: `/pages/detail-song/detail-song?type=music&id=${item._id}`,
    })
  },

  // input组件value变化的事件
  // 这个事件里面什么都不用做，用于消除使用双向绑定语法，小程序内部的警告
  onInputChange() {}
})