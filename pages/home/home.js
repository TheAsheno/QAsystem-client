// pages/home/home.js
import { getCourses } from '../../api/course'
import { getLists } from '../../api/list'
import { getNotification } from '../../api/notification'
const utils = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user : {},
    imgURLs: ['/images/jnu-1.jpg', '/images/jnu-2.jpg', '/images/jnu-3.jpg'],
    navList: [{
        'src': '/images/course.png',
        'title': '课程类别',
        'page': '/pages/course/course'
      },
      {
        'src': '/images/knowledge.png',
        'title': '知识库',
        'page': '/pages/knowledge/knowledge'
      },
      {
        'src': '/images/interact.png',
        'title': 'AI答疑',
        'page': '/pages/chat/chat'
      },
      {
        'src': '/images/setting.png',
        'title': '设置',
        'page': '/pages/settings/settings'
      },
    ],
    questions: [],
    isNotice: false
  },
  navClick(e) {
    const item = e.currentTarget.dataset.item;
    if (item.title === '知识库') {
      if (this.data.user['role'] == 'teacher') {
        wx.navigateTo({
          url: item.page,
        });
      } else {
        wx.showToast({
          title: '您没有权限访问该部分',
          icon: 'none',
          duration: 2000
        });
      }
    } else {
      wx.navigateTo({
        url: item.page,
      });
    }
  },
  detailClick(e) {
    wx.showToast({
      title: e.currentTarget.dataset.item.title,
    })
  },
  noticeClick(e) {
    wx.navigateTo({
      url: '/pages/notification/notification',
    })
  },
  onQuestionClick(e) {
    const question = e.currentTarget.dataset.item;
    const questionStr = encodeURIComponent(JSON.stringify(question));
    wx.navigateTo({
      url: `/pages/question/question?data=${questionStr}`,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.hideHomeButton();
    this.setData({
      user: app.globalData.user
    }, () => {
      if (this.data.user.role == 'teacher') {
        getCourses(this.data.user.userid, 'teacher')
        .then(res => {
          getLists(res.map(course => course.courseid), 'open')
          .then(res => {
            res.forEach(item => {
              item.createdAt = utils.formatTime(new Date(item.createdAt));
            })
            this.setData({
              questions: res
            })
          })
        })
      }
      else {
        getLists(null, 'open', this.data.user.userid)
        .then(res => {
          res.forEach(item => {
            item.createdAt = utils.formatTime(new Date(item.createdAt));
          })
          this.setData({
            questions: res
          })
        })
      }
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
    getNotification(this.data.user.userid, this.data.user.role, false)
    .then(res => {
      if (res.length > 0) {
        this.setData({
          isNotice: true
        })
      }
    })
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
    this.onShow();
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