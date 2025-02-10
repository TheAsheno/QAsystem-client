// pages/login/login.js
import login from '../../api/login';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userid: '',
    password: '',
    clientHeight: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      clientHeight: wx.getWindowInfo().windowHeight
    })
    const token = wx.getStorageSync("token");
    const userData = wx.getStorageSync("userData");
    /*if (token && userData)
      return wx.redirectTo({
        url: "/pages/home/home"
    });*/
  },
  onuseridChange(e) {
    this.setData({
      userid: e.detail.value
    })
  },
  onPasswordChange(e) {
    this.setData({
      password: e.detail.value
    })
  },
  // 登录事件
  goAdmin() {
    let flag = false
    if (this.data.userid === '') {
      wx.showToast({
        icon: 'none',
        title: '账号不能为空',
      })
    } else if (this.data.password === '') {
      wx.showToast({
        icon: 'none',
        title: '密码不能为空',
      })
    } else {
      let obj = {
        userid : this.data.userid,
        password : this.data.password
      }
      login(obj);
    }
  },
  goRegister() {
    wx.navigateTo({
      url: '/pages/register/register'
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