// api/register.js
import config from '../utils/config'
function login(obj) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.url_sql + '/api/users/login',
      method: 'POST',
      data: obj,
      success: (res => {
        if (res.statusCode === 200) {
          const userData = {
            ...res.data.user,
            role: res.data.role
        };
          wx.setStorageSync("token", res.data.token);
          wx.setStorageSync('userData', userData);
          getApp().globalData.token = res.data.token;
          getApp().globalData.user = userData;
          wx.redirectTo({
            url: '/pages/home/home'
          });
        } else {
          console.error('登录失败:', res.data.message);
          wx.showToast({
            title: '登录失败',
            icon: 'none'
          });
        }
      }),
      fail: (err => {
        console.error('请求失败', err);
        wx.showToast({
          title: '请求失败',
          icon: 'none'
        });
      })
    })
  })
}

export default login;