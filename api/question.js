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
        reject(err);
      })
    })
  })
}

function updateQuestion(obj, questionId) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `http://172.21.202.55:3000/api/questions/${questionId}`,
      method: 'PUT',
      data: obj,
      success: (res => {
        if (res.statusCode === 200) {
          resolve(res.data);
          wx.showToast({
            title: '修改成功',
            icon: 'none'
          });
        } else {
          console.error('修改失败:', res.data.message);
          wx.showToast({
            title: '修改失败',
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
        reject(err);
      })
    })
  })
}

function deleteQuestion(questionId) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `http://172.21.202.55:3000/api/questions/${questionId}`,
      method: 'DELETE',
      success: (res => {
        if (res.statusCode === 200) {
          resolve(res.data);
          wx.showToast({
            title: '删除成功',
            icon: 'none'
          });
        } else {
          console.error('删除失败:', res.data.message);
          wx.showToast({
            title: '删除失败',
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
        reject(err);
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

function getQuestionCounts(courseIds) {
  return new Promise((resolve, reject) => {
    const courseIdsParam = courseIds.join(',');
    wx.request({
      url: `http://172.21.202.55:3000/api/questions/count?courseIds=${courseIdsParam}`,
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          wx.showToast({
            title: '获取问题数量失败',
            icon: 'none'
          });
          reject(`Error: ${res.statusCode}`);
        }
      },
      fail: (err) => {
        wx.showToast({
          title: 'API 请求失败',
          icon: 'none'
        });
        reject(err);
      }
    });
  });
}

function getReplyCounts(questionIds) {
  return new Promise((resolve, reject) => {
    const questionIdsParam = questionIds.join(',');
    wx.request({
      url: `http://172.21.202.55:3000/api/replies/count?questionIds=${questionIdsParam}`,
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          wx.showToast({
            title: '获取回复数量失败',
            icon: 'none'
          });
          reject(`Error: ${res.statusCode}`);
        }
      },
      fail: (err) => {
        wx.showToast({
          title: 'API 请求失败',
          icon: 'none'
        });
        reject(err);
      }
    });
  });
}

function getQuestion(questionId) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `http://172.21.202.55:3000/api/questions/count?questionIds=${questionIdsParam}`,
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          wx.showToast({
            title: '获取回复数量失败',
            icon: 'none'
          });
          reject(`Error: ${res.statusCode}`);
        }
      },
      fail: (err) => {
        wx.showToast({
          title: 'API 请求失败',
          icon: 'none'
        });
        reject(err);
      }
    });
  });
}

export { addQuestion, uploadImages, getQuestionCounts, deleteQuestion, updateQuestion, getReplyCounts };