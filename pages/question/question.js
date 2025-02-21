// pages/question/question.js
import { getReply, addReply, changeLike } from '../../api/reply'
import { uploadImages } from '../../api/question'
const utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    question: {},
    user: {},
    allReplies: [],
    replyContent: "",
    images: [],
    only: false,
    images: []
  },
  toggleLike(e) {
    const replyid = e.currentTarget.dataset.id;
    const like = e.currentTarget.dataset.like;
    const newLikeValue = e.currentTarget.dataset.status ? like - 1 : like + 1;
    changeLike(replyid, newLikeValue)
      .then((res) => {
        this.setData({
          allReplies: this.data.allReplies.map(reply => 
            reply.replyid === replyid ? { ...reply, isLiked: !reply.isLiked, like: res.like } : reply
          )
        });
      })
  },
  onOnlyClick(e) {
    const only = !this.data.only;
    getReply(this.data.question.questionid)
    .then(res => {
      res.forEach(item => {
        item.images = JSON.parse(item.images);
        item.createdAt = utils.formatTime(new Date(item.createdAt));
        item.isLiked = false; 
      });
      const filteredReplies = only ? res.filter(reply => reply.sendertype === 'teacher') : res;  
      this.setData({
        only: only,
        allReplies: filteredReplies
      })
    })
  },
  bindInput(e) {
    this.setData({ replyContent: e.detail.value })
  },
  addImage() {
    if (this.data.images.length >= 3) {
      wx.showToast({
        title: '最多添加三张图片',
        icon: 'none'
      });
      return;
    }
    wx.chooseImage({
      count: 3 - this.data.images.length,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          images: this.data.images.concat(res.tempFilePaths)
        })
      }
    });
  },
  deleteImage(e) {
    const index = e.currentTarget.dataset.index;
    const newImages = this.data.images.filter((_, i) => i !== index);  // 删除对应图片
    this.setData({ images: newImages });
  },
  submitReply() {
    if (!this.data.replyContent.trim()) {
      wx.showToast({ title: '请输入回答内容', icon: 'none' })
      return
    }
    const { images, replyContent, question, user } = this.data;
    uploadImages(images)
    .then(uploadedImageUrls => {
      const obj = {
        questionid: question.questionid,
        content: replyContent,
        sendertype: user.role,
        senderid: user.userid,
        like: 0,
        images: JSON.stringify(uploadedImageUrls),
      };
      wx.showLoading({ title: '提交中...' });
      addReply(obj)
      .then((res) => {/*
        const newReply = {
          ...res,
          createdAt: utils.formatTime(new Date(res.createdAt)),
          isLiked: false,
          images: JSON.parse(res.images)
        };*/
        getReply(this.data.question.questionid)
        .then(res => {
          res.forEach(item => {
            item.images = JSON.parse(item.images);
            item.createdAt = utils.formatTime(new Date(item.createdAt));
            item.isLiked = false; 
          });
          this.setData({
            allReplies: res,
            replyContent: "",
            images: []
          })
        })
        wx.hideLoading();
      })
      .catch(err => {
        wx.hideLoading();
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const userData = wx.getStorageSync('userData');
    const question = JSON.parse(decodeURIComponent(options.data));
    this.setData({ 
      question: question,
      user: userData
     });
    getReply(question.questionid)
    .then(res => {
      res.forEach(item => {
        item.images = JSON.parse(item.images);
        item.createdAt = utils.formatTime(new Date(item.createdAt));
        item.isLiked = false; 
      });
      this.setData({
        allReplies: res
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