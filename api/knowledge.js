// api/knowledge.js

function getKnowledgeFiles(courseIds) {
  return new Promise((resolve, reject) => {
    const courseIdsParam = courseIds.join(',');
    wx.request({
      url: `http://172.21.202.55:3000/api/knowledge?courseIds=${courseIdsParam}`,
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          wx.showToast({
            title: '获取文件失败',
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

function uploadFile(obj) {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: 'http://172.21.202.55:3000/api/knowledge/upload',
      filePath: obj.filePath,
      name: 'file',
      formData: {
        uploaderid: obj.uploaderid,
        courseid: obj.courseid,
        type: obj.type,
        filename: obj.filename
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(res.data));
        } else {
          wx.showToast({
            title: '上传失败',
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

function updateRelations(knowledgeid, relations) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `http://172.21.202.55:3000/api/knowledge/${knowledgeid}/relations`,
      method: 'PUT',
      data: { relations: relations },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          console.error('修改失败:', res.data.message);
          wx.showToast({
            title: '修改失败',
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

function deleteFile(knowledgeid, filePath) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `http://172.21.202.55:3000/api/knowledge/${knowledgeid}`,
      method: 'DELETE',
      data: { filePath: filePath },
      success: (res) => {
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

export { getKnowledgeFiles, uploadFile, updateRelations, deleteFile };