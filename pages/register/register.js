// pages/register/register.js
import register from '../../api/register';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userid : '',
    username : '',
    code : '',
    text : '',
    role: '',
    placeholderText: "学号",
    clientHeight: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      clientHeight: wx.getWindowInfo().windowHeight
    })
    var that = this;
    this.drawPic(that);
  },
  userid(e) {
    this.setData({
      userid : e.detail.value
    })
  },
  username(e) {
    this.setData({
      username : e.detail.value
    })
  },
  password(e) {
    this.setData({
      password : e.detail.value
    })
  },
  code(e) {
    let code = e.detail.value;
    code = code.toUpperCase();
    this.setData({
      code : code
    })
  },
  role(e) {
    let role = e.detail.value;
    if (role === "student") {
      this.setData({
        placeholderText: "学号",
        role: role
      });
    } else if (role === "teacher") {
      this.setData({
        placeholderText: "工号",
        role : role
      });
    }
  },
  randomNum(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  },
  randomColor(min, max) {
    let r = this.randomNum(min, max);
    let g = this.randomNum(min, max);
    let b = this.randomNum(min, max);
    return "rgb(" + r + "," + g + "," + b + ")";
  },
  onChange() {
    var that = this;
    this.drawPic(that);
  },
  drawPic(that) {
    const ctx = wx.createCanvasContext ('canvas');
    /**绘制背景色**/
    ctx.fillStyle = this.randomColor(180, 240); //颜色若太深可能导致看不清
    ctx.fillRect(0, 0, 100, 38)
    /**绘制文字**/
    var arr;
    var text = '';
    var str = 'ABCEFGHJKLMNPQRSTWXY123456789';
    for (var i = 0; i < 4; i++) {
      var txt = str[this.randomNum(0, str.length)];
      ctx.fillStyle = this.randomColor(50, 160); //随机生成字体颜色
      ctx.font = this.randomNum(22, 28) + 'px SimHei'; //随机生成字体大小
      var x = 5 + i * 20;
      var y = this.randomNum(22, 28);
      var deg = this.randomNum(-20, 20);
      //修改坐标原点和旋转角度
      ctx.translate(x, y);
      ctx.rotate(deg * Math.PI / 180);
      ctx.fillText(txt, 5, 0);
      text = text + txt;
      //恢复坐标原点和旋转角度
      ctx.rotate(-deg * Math.PI / 180);
      ctx.translate(-x, -y);
    }
    /**绘制干扰线**/
    for (var i = 0; i < 4; i++) {
      ctx.strokeStyle = this.randomColor(40, 180);
      ctx.beginPath();
      ctx.moveTo(this.randomNum(0, 90), this.randomNum(0, 28));
      ctx.lineTo(this.randomNum(0, 90), this.randomNum(0, 28));
      ctx.stroke();
    }
    /**绘制干扰点**/
    for (var i = 0; i < 20; i++) {
      ctx.fillStyle = this.randomColor(0, 255);
      ctx.beginPath();
      ctx.arc(this.randomNum(0, 90), this.randomNum(0, 28), 1, 0, 2 * Math.PI);
      ctx.fill();
    }
    ctx.draw();
    that.setData({
      text: text
    });
  },
  goRegister() {
    if (this.data.userid == '') {
      wx.showToast({
        title: '学号不能为空',
        icon:'none'
      })
    } else if (this.data.code == '') {
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none',
      })
    } else if (this.data.code != this.data.text) {
      wx.showToast({
        title: '验证码错误',
        icon:'none'
      })
    } else {
      let obj = {
        userid : this.data.userid,
        username : this.data.username,
        password : this.data.password,
        role : this.data.role
      }
      register(obj);
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