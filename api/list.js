// api/list.js
import config from '../utils/config'
function getLists(courseIds, status, studentid, questionid) {
  return new Promise((resolve, reject) => {
    let url = config.url_sql + '/api/questions';
    const params = [];
    if (courseIds) {
      params.push(`courseIds=${courseIds.join(',')}`);
    }
    if (status) {
      params.push(`status=${status}`);
    }
    if (studentid) {
      params.push(`studentid=${studentid}`);
    }
    if (questionid) {
      params.push(`questionid=${questionid}`);
    }
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
     wx.request({
      url: url,
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
       } else {
          wx.showToast({
            title: '获取列表失败',
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

export { getLists };