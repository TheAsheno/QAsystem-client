// api/question.js

function addQuestion(obj) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'http://172.21.202.55:3000/api/questions',
      method: 'POST',
      data: obj,
      success: (res => {
        if (res.statusCode === 200) {
          resolve(res.data);
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

function uploadImages(images) {
  const uploadPromises = images.map(image => {
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: 'http://172.21.202.55:3000/api/upload',
        filePath: image,
        name: 'images',
        success: res => {
          const data = JSON.parse(res.data);
          resolve(data.urls[0]);
        },
        fail: err => {
          reject(err);
        }
      });
    });
  });
  return Promise.all(uploadPromises);
}

export { addQuestion, uploadImages };