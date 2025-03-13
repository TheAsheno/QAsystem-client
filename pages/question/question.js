// pages/question/question.js
import { getReply, addReply, changeLike } from '../../api/reply'
import { uploadImages, updateQuestion } from '../../api/question'
import { sendNotification } from '../../api/notification'
import config from '../../utils/config'
const utils = require('../../utils/util.js');
const app = getApp();
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
    images: [],
    config: config
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
        item.createdAt = utils.formatTime(new Date(item.createdAt));
        item.isLiked = false; 
      });
      const filteredReplies = only ? res.filter(reply => reply.role === 'teacher') : res;  
      this.setData({
        only: only,
        allReplies: filteredReplies
      })
    })
  },
  bindInput(e) {
    this.setData({ replyContent: e.detail.value })
  },
  questionSolved(e) {
    wx.showModal({
      title: '锁定问题',
      content: '该问题将会进入待锁定状态',
      complete: (res) => {
        if (res.confirm) {
          let obj = {
            status: 'pending',
            pendingTime: new Date()
          }
          updateQuestion(obj, this.data.question.questionid)
          .then(res => {
            this.data.question.status = 'pending';
            this.setData({
              question: this.data.question
            })
            let obj = {
              receiverid: this.data.question.studentid,
              role: 'student',
              questionid: this.data.question.questionid,
              message: `您的问题《${this.data.question.title}》将于24小时后锁定`
            }
            sendNotification(obj);
          })
        }
      }
    })
  },
  lockQuestion(e) {
    wx.showModal({
      title: '立即锁定',
      content: '该问题将进入锁定状态',
      complete: (res) => {
        if (res.confirm) {
          let obj = {
            status: 'locked'
          }
          updateQuestion(obj, this.data.question.questionid)
          .then(res => {
            this.data.question.status = 'locked';
            this.setData({
              question: this.data.question
            })
          })
        }
      }
    })
  },
  relieveQuestion(e) {
    wx.showModal({
      title: '解除锁定',
      content: '该问题将进入开放状态',
      complete: (res) => {
        if (res.confirm) {
          let obj = {
            status: 'open'
          }
          updateQuestion(obj, this.data.question.questionid)
          .then(res => {
            this.data.question.status = 'open';
            this.setData({
              question: this.data.question
            })
            let obj = {
              receiverid: this.data.question.Course.teacherid,
              role: 'teacher',
              questionid: this.data.question.questionid,
              message: `问题《${this.data.question.title}》已解除锁定并重新开放`
            }
            sendNotification(obj);
          })
        }
      }
    })
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
    const newImages = this.data.images.filter((_, i) => i !== index);
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
        role: user.role,
        senderid: user.userid,
        like: 0,
        images: JSON.stringify(uploadedImageUrls),
      };
      wx.showLoading({ title: '提交中...' });
      addReply(obj)
      .then((res) => {
        getReply(this.data.question.questionid)
        .then(res => {
          res.forEach(item => {
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
        if (this.data.question.studentid != this.data.user.userid) {
          let obj = {
            receiverid: this.data.question.studentid,
            role: 'student',
            questionid: this.data.question.questionid,
            message: `您的问题《${this.data.question.title}》收到了新的回复`
          }
          sendNotification(obj);
        }
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const question = JSON.parse(decodeURIComponent(options.data));
    this.setData({ 
      question: question,
      user: app.globalData.user
     });
    getReply(question.questionid)
    .then(res => {
      res.forEach(item => {
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