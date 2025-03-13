// api/chat.js
import config from '../utils/config'
function getModelResponse(obj) {
  let requestTask; 
  const promise = new Promise((resolve, reject) => {
    requestTask = wx.request({
      url: config.url_llm + '/ask',
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${wx.getStorageSync('token')}`
      },
      data: {
        question: obj.question,
        history: obj.history,
        course: 1
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          wx.showToast({
            title: 'API 请求失败',
            icon: 'none'
          });
          reject(res.data);
        }
      },
      fail: (err) => {
        wx.showToast({
          title: '请求失败',
          icon: 'none'
        });
        reject(err);
      }
    });
  })
  return { promise, requestTask };
}

export default getModelResponse;
