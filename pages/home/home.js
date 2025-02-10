// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user : {},
    imgURLs: ['/images/background.jpg', '/images/background.jpg', '/images/background.jpg'],
    navList: [{
        'src': '/images/course.png',
        'title': '课程类别'
      },
      {
        'src': '/images/knowledge.png',
        'title': '知识库'
      },
      {
        'src': '/images/interact.png',
        'title': '交流区'
      },
      {
        'src': '/images/userid.png',
        'title': '菜单四'
      },
    ],
    dataList: [{
        'coverUrl': '../../images/demo.jpg',
        'label': '推荐',
        'title': '纯属示例数据呦~',
        'date': '2023年1月23日',
        'brand': '点赞',
        'price': '2.98'
      },
      {
        'coverUrl': '../../images/demo.jpg',
        'label': '经典',
        'title': '点赞收藏加关注，下次还能找到呦~',
        'date': '2023年1月23日',
        'brand': '收藏',
        'price': '1.98'
      },
      {
        'coverUrl': '../../images/demo.jpg',
        'label': '模板',
        'title': '不定期发布各种示例模板，进我主页，查看更多示例内容呦~',
        'date': '2023年1月23日',
        'brand': '关注',
        'price': '0.98'
      },
    ]
  },
  // 菜单
  navClick(e) {
    wx.showToast({
      title: '您点击了【' + e.currentTarget.dataset.item.title + '】',
    })
  },
  // 详情
  detailClick(e) {
    wx.showToast({
      title: e.currentTarget.dataset.item.title,
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
    }
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