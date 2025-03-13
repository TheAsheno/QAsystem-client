// api/settings.js
import config from '../utils/config'
function updateUser(obj) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.url_sql + `/api/users/${obj.role}s/${obj.userid}`,
      method: 'PUT',
      data: { 
        nickname: obj.nickname,
        avatar: obj.avatar
       },
      success: (res) => {
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

function deleteImages(filePath) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.url_sql + '/api/upload',
      method: 'DELETE',
      data: { filePath: filePath },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          console.error('修改失败:', res.data.message);
          reject(res.data.message);
        }
      },
      fail: (err) => {
        console.error('请求失败', err);
        reject(err);
      }
    });
  });
}

export { updateUser, deleteImages };