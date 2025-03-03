// api/chat.js

function getModelResponse(obj) {
  let requestTask; 
  const promise = new Promise((resolve, reject) => {
    requestTask = wx.request({
      url: 'http://127.0.0.1:5000/ask',
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${wx.getStorageSync('token')}`
      },
      data: {
        question: obj.question,
        history: obj.history,
        max_tokens: 100,
        temperature: 0.7,
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
