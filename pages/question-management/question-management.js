// pages/question-management/question-management.js
import { getQuestions } from '../../api/question'
import { deleteQuestion, updateQuestion, getReplyCounts } from '../../api/question'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {},
    questions: [],
    showModal: false,
    questionid: null,
    title: '',
    content: '',
    questionid: null,
    index: null
  },
  closeModal() {
    this.setData({ 
      showModal: false
    })
  },
  inputChange(e) {
    const { field } = e.currentTarget.dataset
    this.setData({ [field]: e.detail.value })
  },
  confirmModel() {
    if (!this.data.title.trim()) {
      wx.showToast({
        icon: 'none',
        title: '问题标题不能为空',
      })
    }
    else if (!this.data.content.trim()) {
      wx.showToast({
        icon: 'none',
        title: '问题内容不能为空',
      })
    }
    else {
      let obj = {
        title: this.data.title,
        content: this.data.content,
      }
      updateQuestion(obj, this.data.questionid)
      .then(res => {
        const index = this.data.index;
        const updatedQuestions = [...this.data.questions];
        updatedQuestions[index] = res;
        this.setData({
          questions: updatedQuestions,
          questionid: null,
          index: null,
          showModal: false
        });
      })
    }
  },
  onChangeStatus(e) {
    const index = e.currentTarget.dataset.index;
    const question = this.data.questions[index];
    wx.showModal({
      title: '确定锁定问题吗？',
      content: '问题一旦锁定将不再能修改',
      complete: (res) => {
        if (res.confirm) {
          let obj = {
            status: 'locked'
          }
          updateQuestion(obj, question.questionid)
          .then(res => {
            this.data.questions[index].status = 'locked';
            this.setData({
              questions: this.data.questions,
              showModal: false
            });
          })
        }
      }
    })
  },
  updateQuestion(e) {
    const index = e.currentTarget.dataset.index;
    const question = this.data.questions[index];
    this.setData({
      showModal: true,
      questionid: question.questionid,
      title: question.title,
      content: question.content,
      index: index
    })
  },
  deleteQuestion(e) {
    wx.showModal({
      title: '确定删除问题吗？',
      content: '将同时删除该问题的所有回复',
      success: res => {
        if (res.confirm) {
          const index = e.currentTarget.dataset.index;
          deleteQuestion(this.data.questions[index].questionid)
          .then(res => {
            this.data.questions.splice(index, 1);
            this.setData({ 
              questions: this.data.questions
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
      getQuestions(null, null, this.data.user.userid)
      .then(questions => {
        this.setData({
          questions: questions
        })
        return getReplyCounts(questions.map(question => question.questionid))
      })
      .then(replyCounts => {
        const repliesWithCounts = this.data.questions.map(question => {
          const count = replyCounts.find(qc => qc.questionid === question.questionid);
          return {
            ...question,
            replyCount: count ? count.replyCount : 0
          };
        });
        this.setData({
          questions: repliesWithCounts
        });
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