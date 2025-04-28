// pages/notification/notification.js
import { getNotification, markNotification, deleteNotification } from '../../api/notification'
import { getQuestions } from '../../api/question'
const utils = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {},
    notifications: [],
    page: 1,
    pageSize: 15
  },
  navigateToQuestion(e) {
    const index = e.currentTarget.dataset.index
    const notification = this.data.notifications[index];
    markNotification([notification.notificationid])
    .then(res => {
      this.data.notifications[index].isRead = true;
      this.setData({
        notifications: this.data.notifications
      })
    })
    getQuestions(null, null, null, notification.questionid)
    .then(res => {
      const questionStr = encodeURIComponent(JSON.stringify(res[0]));
      wx.navigateTo({
        url: `/pages/question/question?data=${questionStr}`,
      });
    })
  },
  markAllRead() {
    markNotification(this.data.notifications.map(item => item.notificationid))
    .then(res => {
      this.data.notifications.map(item => item.isRead = true);
      this.setData({
        notifications: this.data.notifications
      })
    })
  },
  deleteOne(e) {
    const index = e.currentTarget.dataset.index;
    const notification = this.data.notifications[index];
    deleteNotification([notification.notificationid])
    .then(res => {
      this.data.notifications.splice(index, 1);
      this.setData({
        notifications: this.data.notifications
      })
    })
  },
  clearAll() {
    deleteNotification(this.data.notifications.map(item => item.notificationid))
    .then(res => {
      this.setData({
        notifications: []
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      user: app.globalData.user
    }, () => {
      getNotification(this.data.user.userid, this.data.user.role)
      .then(res => {
        res.forEach(item => {
          item.createdAt = utils.formatTime(item.createdAt)
        })
        this.setData({
          notifications: res
        })
      })
    })
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
    this.onLoad();
    wx.stopPullDownRefresh();
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