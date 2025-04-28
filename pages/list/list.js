// pages/list/list.js
import { getQuestions } from '../../api/question'
const utils = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {},
    courseId: '',
    coursename: '',
    searchQuery: '',
    allQuestions: [],
    filteredQuestions: [],
    statusOptions: ['open', 'locked', 'pending'],
    selectedstatus: '',
    sortOptions: ['最新', '最旧'],
    selectedsort: '最新',
    tagOptions: ['编程问题', '作业疑问', '概念理解', '考试相关', '其他'],
    selectedtag: '',
    currentPage: 1,
    pageSize: 5,
    paginatedQuestions: []
  },
  handlePageChange(e) {
    const paginatedQuestions = e.detail;
    this.setData({
      paginatedQuestions: paginatedQuestions
    });
  },
  onSearchInput(e) {
    this.setData({
      searchQuery: e.detail.value,
      currentPage: 1
    });
    this.filterQuestions();
  },
  filterQuestions() {
    const { searchQuery, allQuestions, selectedstatus, selectedsort, selectedtag } = this.data;
    let filteredQuestions = allQuestions;
    if (selectedstatus) {
      filteredQuestions = filteredQuestions.filter(question => question.status === selectedstatus);
    }
    if (selectedsort) {
      if (selectedsort === '最新') {
        filteredQuestions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (selectedsort === '最旧') {
        filteredQuestions.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      }
    }
    if (selectedtag) {
      filteredQuestions = filteredQuestions.filter(question => question.tags.includes(selectedtag));
    }
    if (searchQuery) {
      filteredQuestions = filteredQuestions.filter(question => question.title.includes(searchQuery) || question.content.includes(searchQuery));
    }
    this.setData({
      filteredQuestions: filteredQuestions
    });
  },
  onstatusChange(e) {
    const status = this.data.statusOptions[e.detail.value];
    this.setData({
      selectedstatus: status,
      currentPage: 1
    });
    this.filterQuestions();
  },
  onsortChange(e) {
    const sort = this.data.sortOptions[e.detail.value];
    this.setData({
      selectedsort: sort,
      currentPage: 1
    });
    this.filterQuestions();
  },
  ontagChange(e) {
    const tag = this.data.tagOptions[e.detail.value];
    this.setData({
      selectedtag: tag,
      currentPage: 1
    });
    this.filterQuestions();
  },
  onAddClick(e) {
    wx.navigateTo({
      url: `/pages/add/add?courseId=${this.data.courseId}&coursename=${this.data.coursename}`,
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
    this.setData({ 
      user: app.globalData.user,
      courseId: options.courseId,
      coursename: options.coursename
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
    getQuestions([this.data.courseId])
    .then(res => {
      res.forEach(item => {
        item.createdAt = utils.formatTime(new Date(item.createdAt));
      });
      this.setData({
        allQuestions: res,
        filteredQuestions: res
      });
      this.filterQuestions();
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