// api/register.js

function register(obj) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'http://127.0.0.1:3000/api/users/register',  // 替换为你自己的注册接口 URL
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
