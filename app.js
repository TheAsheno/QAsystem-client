// app.js
App({
  onLaunch() {
    const userData = wx.getStorageSync('userData');
    const token = wx.getStorageSync('token');
    if (userData && token) {
      this.globalData.user = userData;
      this.globalData.token = token;
      wx.reLaunch({
        url: '/pages/home/home',
      })
    } else {
      wx.showToast({
        title: '请登录',
        icon: 'none'
      })
      setTimeout(() => {
        wx.reLaunch({
          url: '/pages/login/login',
        })
      }, 500);
    }
  },
  globalData: {
    user: null,
    token: null
  }
})
