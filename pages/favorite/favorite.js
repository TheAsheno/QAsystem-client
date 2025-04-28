// pages/favorite/favorite.js
import { getFavorites, deleteFavorite } from '../../api/favorite'
const utils = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {},
    favorites: []
  },
  onQuestionClick(e) {
    const question = e.currentTarget.dataset.item;
    const questionStr = encodeURIComponent(JSON.stringify(question));
    wx.navigateTo({
      url: `/pages/question/question?data=${questionStr}`,
    });
  },
  deleteQuestion(e) {
    wx.showModal({
      title: '确定取消收藏吗？',
      content: '将从收藏夹中删除该问题',
      success: res => {
        if (res.confirm) {
          const index = e.currentTarget.dataset.index;
          deleteFavorite(this.data.favorites[index].favoriteid)
          .then(res => {
            this.data.favorites.splice(index, 1);
            this.setData({ 
              favorites: this.data.favorites
            });
          })
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
    }, () => {
      getFavorites(this.data.user.userid)
      .then(res => {
        res.forEach(item => {
          item.createdAt = utils.formatTime(new Date(item.createdAt));
        })
        this.setData({
          favorites: res
        })
      })
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