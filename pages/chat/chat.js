// pages/chat/chat.js
import { getCourses } from '../../api/course';
import getModelResponse from '../../api/chat.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: '',
    messages: [],
    sendButtonImage: '/images/up-arrow-none.png',
    isLoading: false,
    requestTask: null,
    courses: [],
    filteredCourses: [],
    selectedCourseid: null,
    selectedCoursename: null,
    isQuote: false,
    quoteText: ''
  },
  showCoursePicker(e) {
    this.setData({
      filteredCourses: this.data.courses
    })
    this.selectComponent('#coursePicker').showPicker();
  },
  searchCourse(e) {
    const searchValue = e.detail;
    let filteredCourses = this.data.courses;
    if (searchValue) {
      filteredCourses = filteredCourses.filter(course => course.coursename.includes(searchValue))
    }
    this.setData({
      filteredCourses: filteredCourses
    })
  },
  selectCourse(e) {
    const index = e.detail[0];
    const filteredCourses = this.data.filteredCourses;
    this.setData({
      selectedCourseid: filteredCourses[index].courseid,
      selectedCoursename: filteredCourses[index].coursename
    })
  },
  onInputChange(e) {
    const inputValue = e.detail.value;
    this.setData({
      inputValue: inputValue,
      sendButtonImage: inputValue ? '/images/up-arrow.png' : '/images/up-arrow-none.png'
    });
  },
  onDelete() {
    this.setData({
      messages: []
    });
  },
  onTransfer() {
    
  },
  onCopy(e) {
    const index = e.currentTarget.dataset.index;
    const message = this.data.messages[index];
    wx.setClipboardData({
      data: message.content,
      success: function () {
        wx.showToast({
          title: '复制成功',
          icon: 'none',
          duration: 1500
        });
      },
      fail: function () {
        wx.showToast({
          title: '复制失败',
          icon: 'none',
          duration: 1500
        });
      }
    });
  },
  onQuote(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      isQuote: true,
      quoteText: this.data.messages[index].context
    })
  },
  closeContext(e) {
    this.setData({
      isQuote: false
    })
  },
  onRefresh(e) {
    const type = e.currentTarget.dataset.type;
    const index = e.currentTarget.dataset.index;
    let messagePair = [];
    if (type === 'user') {
      const aiMessageIndex = index + 1;
      messagePair = [this.data.messages[index], this.data.messages[aiMessageIndex]];
    } else {
      const userMessageIndex = index - 1;
      messagePair = [this.data.messages[userMessageIndex], this.data.messages[index]];
    }
    const updatedMessages = this.data.messages.filter(
      (msg, i) => i !== index && i !== (type === 'user' ? index + 1 : index - 1)
    );
    this.setData({
      messages: updatedMessages,
    });
    this.onSendMessage(messagePair[0].content);
  },
  onSendMessage(message) {
    if (message && message.type === "tap")
      message = null;
    const inputMessage = message ?? this.data.inputValue?.trim();
    const history = this.data.messages.map(msg => ({ role: msg.type, content: msg.content }));
    if (!inputMessage) {
      return;
    }
    if (!this.data.selectedCourseid) {
      wx.showToast({
        title: '请选择对应课程',
        icon: 'none'
      })
      return;
    }
    this.setData({
      inputValue: '',
      isLoading: true,
      sendButtonImage: '/images/loading.png',
    });
    this.addMessage(inputMessage, 'user');
    const { promise, requestTask } = getModelResponse({ 
      question: inputMessage,
      history: history,
      course: this.data.selectedCourseid
    })
    this.setData({ requestTask });
    promise
      .then((res) => {
        this.addMessage(res.answer, 'ai', res.context);
      })
      .catch((err) => {
        this.addMessage(err.error, 'ai');
      })
      .finally(() => {
        this.setData({
          isLoading: false,
          sendButtonImage: '/images/up-arrow-none.png',
          requestTask: null,
        });
      });
  },  
  addMessage(content, type, context) {
    const newMessage = { content, type, context };
    this.setData({
      messages: [...this.data.messages, newMessage],
    });
  },
  onAbort() {
    const requestTask = this.data.requestTask;
    if (requestTask) {
      requestTask.abort();
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    getCourses()
    .then(res => {
      this.setData({
        courses: res,
        filteredCourses: res
      })
    })
    .catch(err => {
      console.error('Failed to get courses:', err);
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