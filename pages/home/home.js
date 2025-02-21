// pages/home/home.js
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
    dataList: [{
        'coverUrl': '/images/demo.jpg',
        'label': '推荐',
        'title': '纯属示例数据呦~',
        'date': '2023年1月23日',
        'brand': '点赞',
        'price': '2.98'
      },
      {
        'coverUrl': '/images/demo.jpg',
        'label': '经典',
        'title': '点赞收藏加关注，下次还能找到呦~',
        'date': '2023年1月23日',
        'brand': '收藏',
        'price': '1.98'
      },
      {
        'coverUrl': '/images/demo.jpg',
        'label': '模板',
        'title': '不定期发布各种示例模板，进我主页，查看更多示例内容呦~',
        'date': '2023年1月23日',
        'brand': '关注',
        'price': '0.98'
      },
    ],
    isTeacher: true
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
  onSearch() {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const userData = wx.getStorageSync('userData');
    if (userData) {
      this.setData({
        user: userData
      });
    } else {
      console.log('未找到用户数据');
      wx.redirectTo({
        url: '/pages/login/login',
      })
    }
    wx.hideHomeButton()
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