// api/message.js
import config from '../utils/config'
function getReply(questionId) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.url_sql + `/api/replies?questionid=${questionId}`,
      method: 'GET',
      success: (res => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          console.error('获取失败:', res.data.message);
          wx.showToast({
            title: '获取失败',
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

function addReply(obj) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.url_sql + '/api/replies',
      method: 'POST',
      data: obj,
      success: (res => {
        if (res.statusCode === 200) {
          resolve(res.data);
          wx.showToast({
            title: '提交成功',
            icon: 'none'
          });
        } else {
          console.error('提交失败:', res.data.message);
          wx.showToast({
            title: '提交失败',
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

function changeLike(replyid, like) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.url_sql + `/api/replies/${replyid}/like`,
      method: 'PUT',
      data: { like: like },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          console.error('点赞失败:', res.data.message);
          wx.showToast({
            title: '点赞失败',
            icon: 'none'
          });
          reject(res.data.message);
        }
      },
      fail: (err) => {
        console.error('请求失败', err);
        wx.showToast({
          title: '请求失败',
          icon: 'none'
        });
        reject(err);
      }
    });
  });
}

export { getReply, addReply, changeLike }