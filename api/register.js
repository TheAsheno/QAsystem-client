// api/register.js
import config from '../utils/config'
function register(obj) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.url_sql + '/api/users/register',
      method: 'POST',
      data: obj,
      success: (res => {
        if (res.statusCode === 200) {
          wx.redirectTo({
            url: '/pages/login/login'
          });
        } else {
          console.error('注册失败:', res.data.message);
          wx.showToast({
            title: '注册失败',
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
    });
  });
}

export default register;
