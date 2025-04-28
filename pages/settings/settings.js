// pages/settings/settings.js
import { uploadImages } from '../../api/question'
import { updateUser, deleteImages } from '../../api/settings'
import config from '../../utils/config'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {},
    config: config
  },
  changeAvatar() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      success: res => {
        deleteImages(this.data.user.avatar);
        const avatar = res.tempFiles[0].tempFilePath;
        uploadImages([avatar])
        .then(uploadedImageUrls => {
          const obj = {
            userid: this.data.user.userid,
            avatar: uploadedImageUrls[0],
            role: this.data.user.role
          };
          updateUser(obj)
          .then(res => {
            const user = {
              ...this.data.user,
              avatar: res.avatar
            }
            wx.setStorageSync('userData', user)
            this.setData({ user })
          })
        })
      }
    })
  },
  manageCourse(e) {
    wx.navigateTo({
      url: '/pages/course-management/course-management',
    })
  },
  changeNickname() {
    wx.showModal({
      title: '修改昵称',
      content: this.data.user.nickname,
      editable: true,
      success: res => {
        if (res.confirm && res.content) {
          if (res.content.length < 2 || res.content.length > 15) {
            wx.showToast({ title: '昵称长度不符合要求', icon: 'none' })
            return
          }
          let obj = {
            userid: this.data.user.userid,
            nickname: res.content,
            role: this.data.user.role
          }
          updateUser(obj)
          .then(res => {
            const user = {
              ...this.data.user,
              nickname: res.nickname
            }
            wx.setStorageSync('userData', user)
            this.setData({ user })
            app.globalData.user = user;
          })
        }
      }
    })
  },
  manageQuestion(e) {
    wx.navigateTo({
      url: '/pages/question-management/question-management'
    })
  },
  questionMark(e) {
    wx.navigateTo({
      url: '/pages/favorite/favorite',
    })
  },
  userNotification(e) {
    wx.navigateTo({
      url: '/pages/notification/notification',
    })
  },
  navigateToFeedback() {
    wx.navigateTo({
      url: '/pages/feedback/feedback'
    })
  },
  navigateToAbout() {
    wx.navigateTo({
      url: '/pages/about/about'
    })
  },
  showLogoutConfirm() {
    wx.showModal({
      title: '确定退出登录吗？',
      content: '退出后需要重新登录才能使用完整功能',
      success: res => {
        if (res.confirm) {
          wx.removeStorageSync('token')
          wx.removeStorageSync('userData')
          wx.reLaunch({ url: '/pages/login/login' })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      user: app.globalData.user
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})