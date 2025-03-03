// pages/add/add.js
import { addQuestion, uploadImages } from '../../api/question'
import { sendNotification } from '../../api/notification'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    content: '',
    tags: [{
      name: '编程问题',
      status: 'unselected'
    }, {
      name: '作业疑问',
      status: 'unselected'
    }, {
      name: '概念理解',
      status: 'unselected'
    }, {
      name: '考试相关',
      status: 'unselected'
    }, {
      name: '其他',
      status: 'unselected'
    }],
    images: [],
    user: {},
    courseId: '',
    coursename: ''
  },
  bindTitleInput(e) {
    this.setData({ title: e.detail.value })
  },
  bindContentInput(e) {
    this.setData({ content: e.detail.value })
  },
  toggleTag(e) {
    const index = e.currentTarget.dataset.index;
    const tags = this.data.tags; 
    const selectedTag = tags[index];
    const selectedTags = tags.filter(tag => tag.status === 'selected');
    if (selectedTags.length >= 3 && selectedTag.status === 'unselected') {
      wx.showToast({
        title: '最多选择三个标签',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    selectedTag.status = selectedTag.status === 'unselected' ? 'selected' : 'unselected';
    this.setData({ tags: [...tags] });
  },  
  chooseImage() {
    wx.chooseImage({
      count: 3 - this.data.images.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        this.setData({
          images: this.data.images.concat(res.tempFilePaths)
        })
      }
    })
  },
  deleteImage(e) {
    const index = e.currentTarget.dataset.index
    this.data.images.splice(index, 1)
    this.setData({ images: this.data.images })
  },
  submitQuestion() {
    if (!this.data.title.trim()) {
      wx.showToast({ title: '请填写问题标题', icon: 'none' })
      return
    }
    if (!this.data.content.trim()) {
      wx.showToast({ title: '请填写问题描述', icon: 'none' })
      return
    }
    const selectedTags = this.data.tags.filter(tag => tag.status === 'selected');
    if (selectedTags.length === 0) {
      wx.showToast({ title: '请添加最少一个标签', icon: 'none' })
      return
    }
    const { title, content, user, courseId, images } = this.data;
    uploadImages(images)
    .then(uploadedImageUrls => {
      let obj = {
        title: title,
        content: content,
        studentid: user.userid,
        courseid: courseId,
        tags: JSON.stringify(selectedTags.map(tag => tag.name)),
        images: JSON.stringify(uploadedImageUrls),
        status: 'open'
      };
      wx.showLoading({ title: '提交中...' });
      addQuestion(obj)
      .then((res) => {
        let obj = {
          receiverid: this.data.courseId,
          role: 'teacher',
          questionid: res.questionid,
          message: `学生在课程《${this.data.coursename}》中发布了一个新问题: "${res.title}"`
        }
        sendNotification(obj)
        .then(() => {
          wx.hideLoading();
          wx.navigateBack();
        });
      })
      .catch((err) => {
        wx.hideLoading();
      });
    })
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