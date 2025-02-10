// pages/quiz/quiz.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: '',
    messages: [],
  },
  // 监听输入框的内容变化
  onInputChange(e) {
    this.setData({
      inputValue: e.detail.value,
    });
  },

  // 发送消息
  onSendMessage() {
    const inputMessage = this.data.inputValue.trim();
    if (inputMessage) {
      // 用户消息
      this.addMessage(inputMessage, 'user');
      
      // 调用 AI 处理回复（模拟）
      setTimeout(() => {
        this.addMessage(`AI 回复: ${inputMessage}`, 'ai');
      }, 1000);

      // 清空输入框
      this.setData({
        inputValue: '',
      });
    }
  },

  // 添加消息到消息列表
  addMessage(content, type) {
    const newMessage = { content, type };
    this.setData({
      messages: [...this.data.messages, newMessage],
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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